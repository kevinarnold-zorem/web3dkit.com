import { createHmac, randomBytes, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { sendOtpWithSmtp } from "./smtp.js";
const ONE_HOUR = 60 * 60;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
function json(response, status, value, headers = {}) {
    const body = Buffer.from(JSON.stringify(value));
    response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": String(body.byteLength),
        "Cache-Control": "no-store",
        ...headers,
    });
    response.end(body);
}
function redirect(response, location) {
    response.writeHead(302, { Location: location, "Cache-Control": "no-store" });
    response.end();
}
async function bodyBuffer(request, limit = 1024 * 1024) {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.byteLength;
        if (size > limit)
            throw new Error("Request body is too large");
        chunks.push(buffer);
    }
    return Buffer.concat(chunks);
}
async function bodyJson(request) {
    const raw = await bodyBuffer(request);
    if (!raw.byteLength)
        return {};
    const parsed = JSON.parse(raw.toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
        throw new Error("Expected a JSON object");
    return parsed;
}
function base64Url(value) {
    return Buffer.from(value).toString("base64url");
}
function hash(secret, value) {
    return createHmac("sha256", secret).update(value).digest("base64url");
}
function secureEqual(left, right) {
    const a = Buffer.from(left);
    const b = Buffer.from(right);
    return a.byteLength === b.byteLength && timingSafeEqual(a, b);
}
function nowIso() {
    return new Date().toISOString();
}
function optionalString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function maskedEmail(email) {
    const [name = "", domain = ""] = email.split("@");
    return `${name.slice(0, 2)}${"*".repeat(Math.max(2, name.length - 2))}@${domain}`;
}
export function backendConfigFromEnv(port, host) {
    const production = process.env.NODE_ENV === "production";
    const jwtSecret = process.env.AUTH_JWT_SECRET ?? (production ? "" : "web3dkit-local-development-secret-change-me");
    if (!jwtSecret)
        throw new Error("AUTH_JWT_SECRET is required in production");
    const publicUrl = (process.env.PUBLIC_URL ?? `http://${host}:${port}`).replace(/\/$/, "");
    const googleClientId = optionalString(process.env.GOOGLE_CLIENT_ID);
    const googleClientSecret = optionalString(process.env.GOOGLE_CLIENT_SECRET);
    const emailWebhookUrl = optionalString(process.env.EMAIL_WEBHOOK_URL);
    const emailWebhookToken = optionalString(process.env.EMAIL_WEBHOOK_TOKEN);
    const smtpHost = optionalString(process.env.SMTP_HOST);
    const smtpUser = optionalString(process.env.SMTP_USER);
    const smtpPassword = optionalString(process.env.SMTP_PASSWORD);
    const smtpPort = Number(process.env.SMTP_PORT ?? "465");
    const hasAnySmtpValue = Boolean(smtpHost || smtpUser || smtpPassword);
    if (hasAnySmtpValue && (!smtpHost || !smtpUser || !smtpPassword)) {
        throw new Error("SMTP_HOST, SMTP_USER and SMTP_PASSWORD must be configured together");
    }
    if (!Number.isSafeInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535)
        throw new Error("SMTP_PORT is invalid");
    const smtp = smtpHost && smtpUser && smtpPassword ? {
        host: smtpHost,
        port: smtpPort,
        secure: (process.env.SMTP_SECURE ?? (smtpPort === 465 ? "true" : "false")) === "true",
        user: smtpUser,
        password: smtpPassword,
        from: optionalString(process.env.EMAIL_FROM) ?? `Web3DKit <${smtpUser}>`,
    } : undefined;
    const stripeSecretKey = optionalString(process.env.STRIPE_SECRET_KEY);
    const stripeWebhookSecret = optionalString(process.env.STRIPE_WEBHOOK_SECRET);
    const stripeYearlyPriceId = optionalString(process.env.STRIPE_PRICE_YEARLY);
    const stripeLifetimePriceId = optionalString(process.env.STRIPE_PRICE_LIFETIME);
    return {
        databasePath: resolve(process.env.BACKEND_DATABASE_PATH ?? "data/web3dkit.sqlite"),
        publicUrl,
        jwtSecret,
        devExposeOtp: process.env.AUTH_DEV_EXPOSE_OTP === "true",
        devCheckout: process.env.BACKEND_DEV_CHECKOUT === "true",
        ...(googleClientId ? { googleClientId } : {}),
        ...(googleClientSecret ? { googleClientSecret } : {}),
        ...(emailWebhookUrl ? { emailWebhookUrl } : {}),
        ...(emailWebhookToken ? { emailWebhookToken } : {}),
        ...(smtp ? { smtp } : {}),
        ...(stripeSecretKey ? { stripeSecretKey } : {}),
        ...(stripeWebhookSecret ? { stripeWebhookSecret } : {}),
        ...(stripeYearlyPriceId ? { stripeYearlyPriceId } : {}),
        ...(stripeLifetimePriceId ? { stripeLifetimePriceId } : {}),
    };
}
export class Web3DKitBackend {
    config;
    baseUrl;
    db;
    catalogCache = null;
    constructor(config) {
        this.config = config;
        mkdirSync(dirname(config.databasePath), { recursive: true });
        this.db = new DatabaseSync(config.databasePath);
        this.baseUrl = `${config.publicUrl}/api/backend`;
        this.migrate();
    }
    close() {
        this.db.close();
    }
    migrate() {
        this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        email_confirmed_at TEXT,
        google_sub TEXT UNIQUE,
        is_anonymous INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sessions (
        refresh_hash TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS otp_codes (
        email TEXT PRIMARY KEY,
        code_hash TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS oauth_states (
        state TEXT PRIMARY KEY,
        redirect_to TEXT NOT NULL,
        link_user_id TEXT,
        expires_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS entitlements (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        plan TEXT NOT NULL,
        status TEXT NOT NULL,
        expires_at TEXT,
        stripe_customer_id TEXT
      );
      CREATE TABLE IF NOT EXISTS shader_metrics (
        shader_id TEXT PRIMARY KEY,
        views INTEGER NOT NULL DEFAULT 0,
        copies INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS metric_events (
        event_key TEXT PRIMARY KEY,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS feedback (
        request_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        message TEXT NOT NULL,
        page TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY,
        billing_email TEXT NOT NULL,
        plan TEXT NOT NULL,
        status TEXT NOT NULL,
        expires_at TEXT,
        stripe_customer_id TEXT,
        claimed_user_id TEXT
      );
      CREATE TABLE IF NOT EXISTS recovery_codes (
        billing_email TEXT PRIMARY KEY,
        code_hash TEXT NOT NULL,
        expires_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS claim_tokens (
        token_hash TEXT PRIMARY KEY,
        source_user_id TEXT NOT NULL,
        expires_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS checkout_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        checkout_state TEXT NOT NULL,
        payment_status TEXT NOT NULL,
        amount_total INTEGER NOT NULL,
        currency TEXT NOT NULL,
        stripe_customer_id TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS designcode_passes (
        token_hash TEXT PRIMARY KEY,
        expires_at TEXT NOT NULL,
        redeemed_by TEXT
      );
    `);
    }
    signAccessToken(user) {
        const issued = Math.floor(Date.now() / 1000);
        const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = base64Url(JSON.stringify({
            aud: "authenticated",
            exp: issued + ONE_HOUR,
            iat: issued,
            role: "authenticated",
            sub: user.id,
            email: user.email,
            is_anonymous: Boolean(user.is_anonymous),
        }));
        return `${header}.${payload}.${hash(this.config.jwtSecret, `${header}.${payload}`)}`;
    }
    verifyAccessToken(token) {
        const [header, payload, signature] = token.split(".");
        if (!header || !payload || !signature || !secureEqual(signature, hash(this.config.jwtSecret, `${header}.${payload}`)))
            return null;
        try {
            const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
            if (!claims.sub || !claims.exp || claims.exp <= Date.now() / 1000)
                return null;
            return this.db.prepare("SELECT * FROM users WHERE id = ?").get(claims.sub) ?? null;
        }
        catch {
            return null;
        }
    }
    requestUser(request) {
        const authorization = request.headers.authorization;
        if (!authorization?.startsWith("Bearer "))
            return null;
        return this.verifyAccessToken(authorization.slice(7));
    }
    publicUser(user) {
        return {
            id: user.id,
            aud: "authenticated",
            role: "authenticated",
            email: user.email,
            email_confirmed_at: user.email_confirmed_at,
            phone: "",
            confirmed_at: user.email_confirmed_at,
            last_sign_in_at: nowIso(),
            app_metadata: { provider: user.google_sub ? "google" : "email", providers: [user.google_sub ? "google" : "email"] },
            user_metadata: {},
            identities: [],
            created_at: user.created_at,
            updated_at: nowIso(),
            is_anonymous: Boolean(user.is_anonymous),
        };
    }
    createSession(user) {
        const refreshToken = randomBytes(32).toString("base64url");
        this.db.prepare("INSERT INTO sessions(refresh_hash,user_id,expires_at,created_at) VALUES(?,?,?,?)").run(hash(this.config.jwtSecret, refreshToken), user.id, new Date(Date.now() + 30 * ONE_DAY_MS).toISOString(), nowIso());
        const expiresAt = Math.floor(Date.now() / 1000) + ONE_HOUR;
        return {
            access_token: this.signAccessToken(user),
            token_type: "bearer",
            expires_in: ONE_HOUR,
            expires_at: expiresAt,
            refresh_token: refreshToken,
            user: this.publicUser(user),
        };
    }
    findOrCreateEmailUser(email) {
        const existing = this.db.prepare("SELECT * FROM users WHERE lower(email)=lower(?)").get(email);
        if (existing) {
            if (!existing.email_confirmed_at)
                this.db.prepare("UPDATE users SET email_confirmed_at=? WHERE id=?").run(nowIso(), existing.id);
            return this.db.prepare("SELECT * FROM users WHERE id=?").get(existing.id);
        }
        const user = { id: randomUUID(), email, email_confirmed_at: nowIso(), google_sub: null, is_anonymous: 0, created_at: nowIso() };
        this.db.prepare("INSERT INTO users(id,email,email_confirmed_at,google_sub,is_anonymous,created_at) VALUES(?,?,?,?,?,?)").run(user.id, user.email, user.email_confirmed_at, null, 0, user.created_at);
        return user;
    }
    async sendCode(email, code, purpose) {
        if (this.config.smtp) {
            await sendOtpWithSmtp(this.config.smtp, email, code, purpose);
            return;
        }
        if (!this.config.emailWebhookUrl) {
            if (process.env.NODE_ENV === "production")
                throw new Error("SMTP or EMAIL_WEBHOOK_URL is required in production");
            console.log(`[Web3DKit auth] ${purpose} code for ${email}: ${code}`);
            return;
        }
        const response = await fetch(this.config.emailWebhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(this.config.emailWebhookToken ? { Authorization: `Bearer ${this.config.emailWebhookToken}` } : {}),
            },
            body: JSON.stringify({ to: email, code, purpose, product: "Web3DKit" }),
        });
        if (!response.ok)
            throw new Error(`Email delivery failed with ${response.status}`);
    }
    safeRedirect(value) {
        const fallback = new URL("/pricing", this.config.publicUrl);
        if (!value)
            return fallback.toString();
        try {
            const candidate = new URL(value, this.config.publicUrl);
            return candidate.origin === fallback.origin ? candidate.toString() : fallback.toString();
        }
        catch {
            return fallback.toString();
        }
    }
    googleAuthorization(redirectTo, linkUserId) {
        if (!this.config.googleClientId || !this.config.googleClientSecret)
            return null;
        const state = randomBytes(24).toString("base64url");
        this.db.prepare("INSERT INTO oauth_states(state,redirect_to,link_user_id,expires_at) VALUES(?,?,?,?)").run(state, redirectTo, linkUserId, new Date(Date.now() + 10 * 60 * 1000).toISOString());
        const google = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        google.searchParams.set("client_id", this.config.googleClientId);
        google.searchParams.set("redirect_uri", `${this.baseUrl}/auth/google/callback`);
        google.searchParams.set("response_type", "code");
        google.searchParams.set("scope", "openid email profile");
        google.searchParams.set("state", state);
        return google.toString();
    }
    entitlement(userId) {
        return this.db.prepare("SELECT plan,status,expires_at,stripe_customer_id FROM entitlements WHERE user_id=?").get(userId)
            ?? { plan: "free", status: "inactive", expires_at: null, stripe_customer_id: null };
    }
    upsertEntitlement(userId, plan, status, expiresAt, customerId = null) {
        this.db.prepare(`INSERT INTO entitlements(user_id,plan,status,expires_at,stripe_customer_id) VALUES(?,?,?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET plan=excluded.plan,status=excluded.status,expires_at=excluded.expires_at,
      stripe_customer_id=COALESCE(excluded.stripe_customer_id,entitlements.stripe_customer_id)`).run(userId, plan, status, expiresAt, customerId);
    }
    async stripe(path, form) {
        if (!this.config.stripeSecretKey)
            throw new Error("Stripe is not configured");
        const response = await fetch(`https://api.stripe.com/v1/${path}`, {
            method: form ? "POST" : "GET",
            headers: { Authorization: `Bearer ${this.config.stripeSecretKey}`, ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}) },
            ...(form ? { body: form } : {}),
        });
        const value = await response.json();
        if (!response.ok)
            throw new Error(typeof value.error?.message === "string" ? String(value.error.message) : "Stripe request failed");
        return value;
    }
    async stripeWebhook(request, response) {
        if (!this.config.stripeWebhookSecret)
            return json(response, 503, { error: "Stripe webhook is not configured" });
        const raw = await bodyBuffer(request);
        const signature = request.headers["stripe-signature"];
        const parts = typeof signature === "string" ? Object.fromEntries(signature.split(",").map((part) => part.split("=", 2))) : {};
        const timestamp = parts.t;
        const received = parts.v1;
        if (!timestamp || !received || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300)
            return json(response, 400, { error: "Invalid Stripe signature" });
        const expected = createHmac("sha256", this.config.stripeWebhookSecret).update(`${timestamp}.${raw.toString("utf8")}`).digest("hex");
        if (!secureEqual(received, expected))
            return json(response, 400, { error: "Invalid Stripe signature" });
        const event = JSON.parse(raw.toString("utf8"));
        const object = event.data?.object ?? {};
        if (event.type === "checkout.session.completed") {
            const metadata = object.metadata;
            const userId = optionalString(object.client_reference_id) ?? optionalString(metadata?.user_id);
            const plan = metadata?.plan === "lifetime" ? "lifetime" : "yearly";
            if (userId) {
                const id = optionalString(object.id) ?? randomUUID();
                const customer = optionalString(object.customer) ?? null;
                const expiresAt = plan === "yearly" ? new Date(Date.now() + 365 * ONE_DAY_MS).toISOString() : null;
                this.db.prepare(`INSERT INTO checkout_sessions(id,user_id,plan,checkout_state,payment_status,amount_total,currency,stripe_customer_id,created_at)
          VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET checkout_state='active',payment_status=excluded.payment_status,stripe_customer_id=excluded.stripe_customer_id`).run(id, userId, plan, "active", optionalString(object.payment_status) ?? "paid", Number(object.amount_total ?? 0), optionalString(object.currency) ?? "usd", customer, nowIso());
                this.upsertEntitlement(userId, plan, "active", expiresAt, customer);
            }
        }
        if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
            const metadata = object.metadata;
            const userId = optionalString(metadata?.user_id);
            if (userId) {
                const periodEnd = Number(object.current_period_end ?? 0);
                const status = event.type.endsWith("deleted") ? "canceled" : optionalString(object.status) ?? "inactive";
                this.upsertEntitlement(userId, "yearly", status, periodEnd ? new Date(periodEnd * 1000).toISOString() : null, optionalString(object.customer) ?? null);
            }
        }
        json(response, 200, { received: true });
    }
    catalog() {
        if (this.catalogCache)
            return this.catalogCache;
        const root = resolve(this.config.mirrorRoot ?? process.env.MIRROR_ROOT ?? "web3dkit-public");
        const categories = ["landing-pages", "hero", "three-js", "backgrounds", "buttons", "text-animation", "ui-elements", "css", "motion-design"];
        const items = [];
        const visit = (directory, category) => {
            for (const entry of readdirSync(directory, { withFileTypes: true })) {
                if (!entry.isDirectory())
                    continue;
                const child = resolve(directory, entry.name);
                const relative = child.slice(root.length).replaceAll("\\", "/");
                if (readdirSync(child).includes("index.html")) {
                    const id = relative.split("/").filter(Boolean).join("-");
                    const title = entry.name.split("-").map((word) => word ? `${word[0]?.toUpperCase()}${word.slice(1)}` : word).join(" ");
                    items.push({ id, path: relative, category, title });
                }
                visit(child, category);
            }
        };
        for (const category of categories)
            visit(resolve(root, category), category);
        this.catalogCache = items;
        return items;
    }
    async mcp(request, response) {
        if (request.method === "OPTIONS") {
            response.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization,content-type,mcp-session-id", "Access-Control-Allow-Methods": "POST,OPTIONS" });
            response.end();
            return;
        }
        if (request.method !== "POST")
            return json(response, 405, { error: "MCP requires POST" }, { Allow: "POST, OPTIONS" });
        const body = await bodyJson(request);
        const id = body.id ?? null;
        const method = optionalString(body.method) ?? "";
        const params = body.params && typeof body.params === "object" && !Array.isArray(body.params) ? body.params : {};
        const send = (result) => json(response, 200, { jsonrpc: "2.0", id, result }, { "Access-Control-Allow-Origin": "*" });
        if (method === "initialize") {
            send({ protocolVersion: "2025-03-26", capabilities: { tools: { listChanged: false } }, serverInfo: { name: "web3dkit", version: "1.0.0" } });
            return;
        }
        if (method === "notifications/initialized") {
            send({});
            return;
        }
        if (method === "tools/list") {
            send({ tools: [
                    { name: "search_catalog", description: "Find templates and components by name, category, runtime, or description.", inputSchema: { type: "object", properties: { query: { type: "string" }, limit: { type: "number" } } } },
                    { name: "get_catalog_item", description: "Read one item's metadata and local route.", inputSchema: { type: "object", required: ["id"], properties: { id: { type: "string" } } } },
                    { name: "get_item_source", description: "Retrieve the exact mirrored document or stored source bundle for an item.", inputSchema: { type: "object", required: ["id"], properties: { id: { type: "string" } } } },
                    { name: "get_item_prompt", description: "Load an implementation prompt for a catalog item.", inputSchema: { type: "object", required: ["id"], properties: { id: { type: "string" } } } },
                ] });
            return;
        }
        if (method === "tools/call") {
            const name = optionalString(params.name);
            const args = params.arguments && typeof params.arguments === "object" && !Array.isArray(params.arguments) ? params.arguments : {};
            const catalog = this.catalog();
            let value;
            if (name === "search_catalog") {
                const query = (optionalString(args.query) ?? "").toLowerCase();
                const limit = Math.min(100, Math.max(1, Number(args.limit ?? 20) || 20));
                value = catalog.filter((item) => !query || `${item.id} ${item.title} ${item.category}`.toLowerCase().includes(query)).slice(0, limit);
            }
            else {
                const itemId = optionalString(args.id) ?? "";
                const item = catalog.find((candidate) => candidate.id === itemId || candidate.path === `/${itemId}`);
                if (!item)
                    return json(response, 200, { jsonrpc: "2.0", id, error: { code: -32602, message: "Catalog item not found" } });
                if (name === "get_catalog_item")
                    value = { ...item, url: new URL(item.path, this.config.publicUrl).toString() };
                else if (name === "get_item_source") {
                    const root = resolve(this.config.mirrorRoot ?? process.env.MIRROR_ROOT ?? "web3dkit-public");
                    const storedSource = resolve(root, "source-code", `${item.id}.json`);
                    let source;
                    try {
                        source = readFileSync(storedSource, "utf8");
                    }
                    catch {
                        source = readFileSync(resolve(root, item.path.slice(1), "index.html"), "utf8");
                    }
                    value = { item, source };
                }
                else if (name === "get_item_prompt")
                    value = { item, prompt: `Implementa ${item.title} de Web3DKit conservando su estructura, interacción, estados responsive y recursos locales. Ruta de referencia: ${item.path}.` };
                else
                    return json(response, 200, { jsonrpc: "2.0", id, error: { code: -32601, message: "Unknown tool" } });
            }
            send({ content: [{ type: "text", text: JSON.stringify(value, null, 2) }] });
            return;
        }
        json(response, 200, { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
    }
    async auth(request, response, path, url) {
        if (path === "/auth/v1/otp" && request.method === "POST") {
            const body = await bodyJson(request);
            const email = optionalString(body.email)?.toLowerCase();
            if (!email || !/^\S+@\S+\.\S+$/.test(email))
                return json(response, 400, { code: "invalid_email", message: "Invalid email" }), true;
            const code = String(randomInt(100000, 1000000));
            this.db.prepare("INSERT INTO otp_codes(email,code_hash,expires_at,attempts) VALUES(?,?,?,0) ON CONFLICT(email) DO UPDATE SET code_hash=excluded.code_hash,expires_at=excluded.expires_at,attempts=0").run(email, hash(this.config.jwtSecret, code), new Date(Date.now() + 10 * 60 * 1000).toISOString());
            await this.sendCode(email, code, "login");
            json(response, 200, this.config.devExposeOtp ? { debug_code: code } : {});
            return true;
        }
        if (path === "/auth/v1/verify" && request.method === "POST") {
            const body = await bodyJson(request);
            const email = optionalString(body.email)?.toLowerCase();
            const token = optionalString(body.token);
            const row = email ? this.db.prepare("SELECT * FROM otp_codes WHERE email=?").get(email) : undefined;
            if (!email || !token || !row || Date.parse(row.expires_at) <= Date.now() || row.attempts >= 5 || !secureEqual(row.code_hash, hash(this.config.jwtSecret, token))) {
                if (email && row)
                    this.db.prepare("UPDATE otp_codes SET attempts=attempts+1 WHERE email=?").run(email);
                json(response, 403, { code: "otp_expired", message: "Token has expired or is invalid" });
                return true;
            }
            this.db.prepare("DELETE FROM otp_codes WHERE email=?").run(email);
            const user = this.findOrCreateEmailUser(email);
            const session = this.createSession(user);
            json(response, 200, { ...session });
            return true;
        }
        if (path === "/auth/v1/signup" && request.method === "POST") {
            const user = { id: randomUUID(), email: null, email_confirmed_at: null, google_sub: null, is_anonymous: 1, created_at: nowIso() };
            this.db.prepare("INSERT INTO users(id,email,email_confirmed_at,google_sub,is_anonymous,created_at) VALUES(?,?,?,?,?,?)").run(user.id, null, null, null, 1, user.created_at);
            const session = this.createSession(user);
            json(response, 200, { user: this.publicUser(user), session });
            return true;
        }
        if (path === "/auth/v1/token" && request.method === "POST" && url.searchParams.get("grant_type") === "refresh_token") {
            const body = await bodyJson(request);
            const refreshToken = optionalString(body.refresh_token);
            const refreshHash = refreshToken ? hash(this.config.jwtSecret, refreshToken) : "";
            const row = refreshToken ? this.db.prepare("SELECT user_id,expires_at FROM sessions WHERE refresh_hash=?").get(refreshHash) : undefined;
            const user = row && Date.parse(row.expires_at) > Date.now() ? this.db.prepare("SELECT * FROM users WHERE id=?").get(row.user_id) : undefined;
            if (!user)
                return json(response, 401, { code: "refresh_token_not_found", message: "Invalid refresh token" }), true;
            // Rotate refresh tokens. A copied token cannot be replayed after a
            // successful refresh, matching the security expectations of GoTrue.
            this.db.prepare("DELETE FROM sessions WHERE refresh_hash=?").run(refreshHash);
            json(response, 200, this.createSession(user));
            return true;
        }
        if (path === "/auth/v1/user" && request.method === "GET") {
            const user = this.requestUser(request);
            json(response, user ? 200 : 401, user ? this.publicUser(user) : { code: "bad_jwt", message: "Invalid token" });
            return true;
        }
        if (path === "/auth/v1/logout" && request.method === "POST") {
            const user = this.requestUser(request);
            if (user)
                this.db.prepare("DELETE FROM sessions WHERE user_id=?").run(user.id);
            json(response, 204, null);
            return true;
        }
        if (path === "/auth/v1/authorize" && request.method === "GET") {
            if (url.searchParams.get("provider") !== "google")
                return json(response, 400, { code: "unsupported_provider", message: "Only Google is supported" }), true;
            const redirectTo = this.safeRedirect(url.searchParams.get("redirect_to"));
            const google = this.googleAuthorization(redirectTo, null);
            if (!google)
                return json(response, 503, { code: "google_not_configured", message: "Google login is not configured" }), true;
            redirect(response, google);
            return true;
        }
        if (path === "/auth/v1/user/identities/authorize" && request.method === "GET") {
            const user = this.requestUser(request);
            if (!user)
                return json(response, 401, { code: "bad_jwt", message: "Authentication required" }), true;
            if (url.searchParams.get("provider") !== "google")
                return json(response, 400, { code: "unsupported_provider", message: "Only Google is supported" }), true;
            const google = this.googleAuthorization(this.safeRedirect(url.searchParams.get("redirect_to")), user.id);
            if (!google)
                return json(response, 503, { code: "google_not_configured", message: "Google login is not configured" }), true;
            json(response, 200, { url: google });
            return true;
        }
        if (path === "/auth/google/callback" && request.method === "GET") {
            const state = url.searchParams.get("state") ?? "";
            const code = url.searchParams.get("code") ?? "";
            const record = this.db.prepare("SELECT * FROM oauth_states WHERE state=?").get(state);
            if (!record || Date.parse(record.expires_at) <= Date.now() || !code || !this.config.googleClientId || !this.config.googleClientSecret)
                return json(response, 400, { code: "invalid_oauth_state", message: "OAuth state is invalid" }), true;
            this.db.prepare("DELETE FROM oauth_states WHERE state=?").run(state);
            const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: this.config.googleClientId, client_secret: this.config.googleClientSecret, redirect_uri: `${this.baseUrl}/auth/google/callback`, grant_type: "authorization_code" }) });
            const token = await tokenResponse.json();
            if (!tokenResponse.ok || !token.access_token)
                return json(response, 401, { code: "oauth_exchange_failed", message: "Google authentication failed" }), true;
            const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${token.access_token}` } });
            const profile = await profileResponse.json();
            if (!profileResponse.ok || !profile.sub || !profile.email || !profile.email_verified)
                return json(response, 401, { code: "unverified_email", message: "Google did not return a verified email" }), true;
            let user;
            if (record.link_user_id) {
                this.db.prepare("UPDATE users SET email=?,email_confirmed_at=?,google_sub=?,is_anonymous=0 WHERE id=?").run(profile.email.toLowerCase(), nowIso(), profile.sub, record.link_user_id);
                user = this.db.prepare("SELECT * FROM users WHERE id=?").get(record.link_user_id);
            }
            else {
                user = this.findOrCreateEmailUser(profile.email.toLowerCase());
                this.db.prepare("UPDATE users SET google_sub=? WHERE id=?").run(profile.sub, user.id);
                user = this.db.prepare("SELECT * FROM users WHERE id=?").get(user.id);
            }
            const session = this.createSession(user);
            const destination = new URL(record.redirect_to);
            destination.hash = new URLSearchParams({ access_token: String(session.access_token), refresh_token: String(session.refresh_token), expires_in: String(ONE_HOUR), expires_at: String(session.expires_at), token_type: "bearer", type: "signup" }).toString();
            redirect(response, destination.toString());
            return true;
        }
        return false;
    }
    async rpc(request, response, name) {
        const body = await bodyJson(request);
        if (name === "get_catalog_popularity") {
            const ids = Array.isArray(body.p_shader_ids) ? body.p_shader_ids.filter((value) => typeof value === "string") : [];
            const statement = this.db.prepare("SELECT views,copies FROM shader_metrics WHERE shader_id=?");
            json(response, 200, ids.map((shaderId) => ({ shader_id: shaderId, ...(statement.get(shaderId) ?? { views: 0, copies: 0 }) })));
            return;
        }
        if (name === "get_shader_metrics") {
            const shaderId = optionalString(body.p_shader_id) ?? "";
            json(response, 200, this.db.prepare("SELECT views,copies FROM shader_metrics WHERE shader_id=?").get(shaderId) ?? { views: 0, copies: 0 });
            return;
        }
        if (name === "get_my_entitlement") {
            const user = this.requestUser(request);
            if (!user)
                return json(response, 401, { code: "PGRST301", message: "JWT required" });
            const entitlement = this.entitlement(user.id);
            json(response, 200, { plan: entitlement.plan, status: entitlement.status, expires_at: entitlement.expires_at });
            return;
        }
        json(response, 404, { code: "PGRST202", message: `Unknown RPC ${name}` });
    }
    async functionCall(request, response, name) {
        const body = await bodyJson(request);
        const user = this.requestUser(request);
        if (name === "shader-metrics") {
            const shaderId = optionalString(body.shaderId);
            const metric = body.metric === "copy" ? "copy" : body.metric === "view" ? "view" : null;
            const visitorId = optionalString(body.visitorId);
            if (!shaderId || !metric || !visitorId)
                return json(response, 400, { error: "Invalid metric payload" });
            const eventKey = hash(this.config.jwtSecret, `${visitorId}:${shaderId}:${metric}:${optionalString(body.copyKind) ?? ""}`);
            const accepted = this.db.prepare("INSERT OR IGNORE INTO metric_events(event_key,created_at) VALUES(?,?)").run(eventKey, nowIso()).changes > 0;
            this.db.prepare("INSERT OR IGNORE INTO shader_metrics(shader_id,views,copies) VALUES(?,0,0)").run(shaderId);
            if (accepted)
                this.db.prepare(`UPDATE shader_metrics SET ${metric === "view" ? "views" : "copies"}=${metric === "view" ? "views" : "copies"}+1 WHERE shader_id=?`).run(shaderId);
            const metrics = this.db.prepare("SELECT views,copies FROM shader_metrics WHERE shader_id=?").get(shaderId);
            json(response, 200, { ...metrics, accepted });
            return;
        }
        if (!user)
            return json(response, 401, { error: "Authentication required" });
        if (name === "send-feedback") {
            const message = optionalString(body.message);
            const page = optionalString(body.page) ?? "unknown";
            const requestId = optionalString(body.requestId) ?? randomUUID();
            if (!message || message.length > 5000)
                return json(response, 400, { error: "Invalid feedback" });
            this.db.prepare("INSERT OR IGNORE INTO feedback(request_id,user_id,message,page,created_at) VALUES(?,?,?,?,?)").run(requestId, user.id, message, page, nowIso());
            json(response, 200, { sent: true });
            return;
        }
        if (name === "claim-pro-entitlement") {
            const action = optionalString(body.action);
            if (action === "recover") {
                if (!user.email || !user.email_confirmed_at)
                    return json(response, 200, { recovered: false });
                const purchase = this.db.prepare(`SELECT id,plan,expires_at,stripe_customer_id FROM purchases
          WHERE lower(billing_email)=lower(?) AND status='active'
          ORDER BY CASE plan WHEN 'lifetime' THEN 0 ELSE 1 END LIMIT 1`).get(user.email);
                if (!purchase || purchase.expires_at && Date.parse(purchase.expires_at) <= Date.now()) {
                    return json(response, 200, { recovered: false });
                }
                this.upsertEntitlement(user.id, purchase.plan, "active", purchase.expires_at, purchase.stripe_customer_id);
                this.db.prepare("UPDATE purchases SET claimed_user_id=? WHERE id=?").run(user.id, purchase.id);
                return json(response, 200, { recovered: true, entitlement: this.entitlement(user.id) });
            }
            if (action === "begin") {
                if (!user.is_anonymous)
                    return json(response, 400, { error: "Anonymous purchase session required" });
                const token = randomBytes(32).toString("base64url");
                this.db.prepare("INSERT INTO claim_tokens(token_hash,source_user_id,expires_at) VALUES(?,?,?)").run(hash(this.config.jwtSecret, token), user.id, new Date(Date.now() + 30 * 60 * 1000).toISOString());
                return json(response, 200, { token });
            }
            if (action === "complete") {
                const token = optionalString(body.token);
                const claim = token ? this.db.prepare("SELECT * FROM claim_tokens WHERE token_hash=?").get(hash(this.config.jwtSecret, token)) : undefined;
                if (!claim || Date.parse(claim.expires_at) <= Date.now())
                    return json(response, 400, { error: "Invalid claim token" });
                const source = this.entitlement(claim.source_user_id);
                if (source.plan === "free")
                    return json(response, 404, { error: "No entitlement to claim" });
                this.upsertEntitlement(user.id, source.plan, source.status, source.expires_at, source.stripe_customer_id);
                this.db.prepare("DELETE FROM claim_tokens WHERE token_hash=?").run(hash(this.config.jwtSecret, token ?? ""));
                return json(response, 200, { entitlement: this.entitlement(user.id) });
            }
            if (action === "request_verification") {
                const email = optionalString(body.billing_email)?.toLowerCase();
                const purchase = email ? this.db.prepare("SELECT id FROM purchases WHERE lower(billing_email)=lower(?) AND status='active'").get(email) : undefined;
                if (email && purchase) {
                    const code = String(randomInt(100000, 1000000));
                    this.db.prepare("INSERT INTO recovery_codes(billing_email,code_hash,expires_at) VALUES(?,?,?) ON CONFLICT(billing_email) DO UPDATE SET code_hash=excluded.code_hash,expires_at=excluded.expires_at").run(email, hash(this.config.jwtSecret, code), new Date(Date.now() + 10 * 60 * 1000).toISOString());
                    await this.sendCode(email, code, "recovery");
                }
                return json(response, 200, { email: email ? maskedEmail(email) : "" });
            }
            if (action === "verify") {
                const email = optionalString(body.billing_email)?.toLowerCase();
                const code = optionalString(body.code);
                const recovery = email ? this.db.prepare("SELECT * FROM recovery_codes WHERE billing_email=?").get(email) : undefined;
                const purchase = email ? this.db.prepare("SELECT * FROM purchases WHERE lower(billing_email)=lower(?) AND status='active'").get(email) : undefined;
                if (!email || !code || !recovery || !purchase || Date.parse(recovery.expires_at) <= Date.now() || !secureEqual(recovery.code_hash, hash(this.config.jwtSecret, code)))
                    return json(response, 403, { error: "Invalid recovery code" });
                this.upsertEntitlement(user.id, purchase.plan, "active", purchase.expires_at, purchase.stripe_customer_id);
                this.db.prepare("UPDATE purchases SET claimed_user_id=? WHERE id=?").run(user.id, purchase.id);
                this.db.prepare("DELETE FROM recovery_codes WHERE billing_email=?").run(email);
                return json(response, 200, { entitlement: this.entitlement(user.id) });
            }
            return json(response, 400, { error: "Unsupported claim action" });
        }
        if (name === "create-checkout-session") {
            const plan = body.plan === "lifetime" ? "lifetime" : body.plan === "yearly" ? "yearly" : null;
            if (!plan)
                return json(response, 400, { error: "Invalid plan" });
            const localId = `cs_local_${randomBytes(12).toString("hex")}`;
            const amount = plan === "lifetime" ? 24900 : 9900;
            if (this.config.devCheckout) {
                this.db.prepare("INSERT INTO checkout_sessions VALUES(?,?,?,?,?,?,?,?,?)").run(localId, user.id, plan, "processing", "unpaid", amount, "usd", null, nowIso());
                return json(response, 200, { url: `${this.baseUrl}/dev-checkout?id=${encodeURIComponent(localId)}` });
            }
            const price = plan === "lifetime" ? this.config.stripeLifetimePriceId : this.config.stripeYearlyPriceId;
            if (!price || !this.config.stripeSecretKey)
                return json(response, 503, { error: "Checkout is not configured" });
            const form = new URLSearchParams({ mode: plan === "lifetime" ? "payment" : "subscription", "line_items[0][price]": price, "line_items[0][quantity]": "1", success_url: `${this.config.publicUrl}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${this.config.publicUrl}/pricing`, client_reference_id: user.id, "metadata[user_id]": user.id, "metadata[plan]": plan });
            if (plan === "yearly")
                form.set("subscription_data[metadata][user_id]", user.id);
            if (user.email)
                form.set("customer_email", user.email);
            const session = await this.stripe("checkout/sessions", form);
            const stripeId = optionalString(session.id);
            if (!stripeId || !optionalString(session.url))
                return json(response, 502, { error: "Stripe did not return a checkout session" });
            this.db.prepare("INSERT INTO checkout_sessions VALUES(?,?,?,?,?,?,?,?,?)").run(stripeId, user.id, plan, "processing", "unpaid", amount, "usd", optionalString(session.customer) ?? null, nowIso());
            json(response, 200, { url: session.url });
            return;
        }
        if (name === "create-portal-session") {
            const entitlement = this.entitlement(user.id);
            if (!entitlement.stripe_customer_id)
                return json(response, 400, { error: "No billing customer is linked" });
            const portal = await this.stripe("billing_portal/sessions", new URLSearchParams({ customer: entitlement.stripe_customer_id, return_url: `${this.config.publicUrl}/pricing` }));
            json(response, 200, { url: portal.url });
            return;
        }
        if (name === "checkout-status") {
            const id = optionalString(body.checkout_session_id);
            let local = id ? this.db.prepare("SELECT * FROM checkout_sessions WHERE id=? AND user_id=?").get(id, user.id) : undefined;
            if (!local)
                return json(response, 404, { error: "Checkout session was not found" });
            if (id?.startsWith("cs_") && this.config.stripeSecretKey && local.checkout_state !== "active") {
                const stripeSession = await this.stripe(`checkout/sessions/${encodeURIComponent(id)}`);
                const paid = stripeSession.payment_status === "paid" || stripeSession.status === "complete";
                if (paid) {
                    const plan = local.plan === "lifetime" ? "lifetime" : "yearly";
                    const customer = optionalString(stripeSession.customer) ?? null;
                    const expires = plan === "yearly" ? new Date(Date.now() + 365 * ONE_DAY_MS).toISOString() : null;
                    this.db.prepare("UPDATE checkout_sessions SET checkout_state='active',payment_status='paid',stripe_customer_id=? WHERE id=?").run(customer, id);
                    this.upsertEntitlement(user.id, plan, "active", expires, customer);
                    local = this.db.prepare("SELECT * FROM checkout_sessions WHERE id=?").get(id);
                }
            }
            json(response, 200, { checkout_state: local.checkout_state, plan: local.plan, payment_status: local.payment_status, amount_total: local.amount_total, currency: local.currency, entitlement_active: this.entitlement(user.id).plan !== "free" });
            return;
        }
        if (name === "redeem-designcode-pass") {
            const token = optionalString(body.token);
            const tokenHash = token ? hash(this.config.jwtSecret, token) : "";
            const pass = token ? this.db.prepare("SELECT expires_at,redeemed_by FROM designcode_passes WHERE token_hash=?").get(tokenHash) : undefined;
            if (!pass || Date.parse(pass.expires_at) <= Date.now() || pass.redeemed_by && pass.redeemed_by !== user.id)
                return json(response, 403, { error: "DesignCode pass is invalid or already redeemed" });
            this.db.prepare("UPDATE designcode_passes SET redeemed_by=? WHERE token_hash=?").run(user.id, tokenHash);
            this.upsertEntitlement(user.id, "yearly", "complimentary", pass.expires_at);
            return json(response, 200, { entitlement: { expires_at: pass.expires_at } });
        }
        json(response, 404, { error: `Unknown function ${name}` });
    }
    async handle(request, response, url) {
        if (url.pathname === "/api/mcp") {
            try {
                await this.mcp(request, response);
            }
            catch (error) {
                json(response, 500, { error: error instanceof Error ? error.message : "MCP failed" });
            }
            return true;
        }
        if (!url.pathname.startsWith("/api/backend/"))
            return false;
        const path = url.pathname.slice("/api/backend".length);
        if (request.method === "OPTIONS") {
            response.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization,apikey,content-type,x-client-info", "Access-Control-Allow-Methods": "GET,POST,OPTIONS" });
            response.end();
            return true;
        }
        try {
            if (await this.auth(request, response, path, url))
                return true;
            if (path === "/webhooks/stripe" && request.method === "POST") {
                await this.stripeWebhook(request, response);
                return true;
            }
            if (path.startsWith("/rest/v1/rpc/") && request.method === "POST") {
                await this.rpc(request, response, path.slice("/rest/v1/rpc/".length));
                return true;
            }
            if (path.startsWith("/functions/v1/") && request.method === "POST") {
                await this.functionCall(request, response, path.slice("/functions/v1/".length));
                return true;
            }
            if (path === "/dev-checkout" && request.method === "GET" && this.config.devCheckout) {
                const id = url.searchParams.get("id") ?? "";
                const checkout = this.db.prepare("SELECT * FROM checkout_sessions WHERE id=?").get(id);
                if (!checkout)
                    return json(response, 404, { error: "Checkout not found" }), true;
                const expires = checkout.plan === "yearly" ? new Date(Date.now() + 365 * ONE_DAY_MS).toISOString() : null;
                this.db.prepare("UPDATE checkout_sessions SET checkout_state='active',payment_status='paid' WHERE id=?").run(id);
                this.upsertEntitlement(checkout.user_id, checkout.plan, "active", expires);
                redirect(response, `${this.config.publicUrl}/pricing?checkout=success&session_id=${encodeURIComponent(id)}`);
                return true;
            }
            json(response, 404, { error: "Backend route not found" });
            return true;
        }
        catch (error) {
            console.error("Web3DKit backend error", error);
            json(response, 500, { error: error instanceof Error ? error.message : "Internal backend error" });
            return true;
        }
    }
}
