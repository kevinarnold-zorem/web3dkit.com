import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { request } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { after, before, test } from "node:test";

import { createMirrorServer } from "../src/server.js";
import { Web3DKitBackend } from "../src/backend.js";

const fixtureRoot = await mkdtemp(join(tmpdir(), "web3dkit-mirror-"));
const outsideRoot = await mkdtemp(join(tmpdir(), "web3dkit-outside-"));
await mkdir(join(fixtureRoot, "browse"));
await mkdir(join(fixtureRoot, "media"));
await writeFile(join(fixtureRoot, "index.html"), "<h1>Home</h1>");
await writeFile(join(fixtureRoot, "browse", "index.html"), "<h1>Browse</h1>");
await writeFile(join(fixtureRoot, "media", "clip.webm"), Buffer.from("0123456789"));
await writeFile(join(fixtureRoot, "local-beta-shaders"), "[]\n");

const server = createMirrorServer({ mirrorRoot: fixtureRoot });
let baseUrl = "";

before(async () => {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert(address && typeof address !== "string");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  await Promise.all([
    rm(fixtureRoot, { recursive: true, force: true }),
    rm(outsideRoot, { recursive: true, force: true }),
  ]);
});

test("serves directory routes from index.html", async () => {
  const response = await fetch(`${baseUrl}/browse/`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(await response.text(), "<h1>Browse</h1>");
});

test("serves exact byte ranges for video seeking", async () => {
  const response = await fetch(`${baseUrl}/media/clip.webm`, {
    headers: { Range: "bytes=3-6" },
  });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("content-range"), "bytes 3-6/10");
  assert.equal(Buffer.from(await response.arrayBuffer()).toString(), "3456");
});

test("HEAD returns mirror metadata without a body", async () => {
  const response = await fetch(`${baseUrl}/browse/`, { method: "HEAD" });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-length"), "15");
  assert.equal(await response.text(), "");
});

test("rejects encoded traversal before filesystem access", async () => {
  const status = await new Promise<number>((resolve, reject) => {
    const address = server.address();
    assert(address && typeof address !== "string");
    const outgoing = request(
      {
        host: "127.0.0.1",
        port: address.port,
        path: "/%2e%2e/package.json",
      },
      (response) => {
        response.resume();
        resolve(response.statusCode ?? 0);
      },
    );
    outgoing.on("error", reject);
    outgoing.end();
  });
  assert.equal(status, 400);
});

test("does not follow a mirror symlink outside its root", async () => {
  const outside = join(outsideRoot, "outside-web3dkit.txt");
  await writeFile(outside, "private");
  await symlink(outside, join(fixtureRoot, "escape.txt"));

  const response = await fetch(`${baseUrl}/escape.txt`);
  assert.equal(response.status, 404);
});

test("the real mirror homepage remains byte-identical", async () => {
  const realRoot = join(import.meta.dirname, "..", "web3dkit-public");
  const realServer = createMirrorServer({
    mirrorRoot: realRoot,
    rewriteExternalResources: false,
    localizeDescriptions: false,
  });
  await new Promise<void>((resolve) => realServer.listen(0, "127.0.0.1", resolve));
  try {
    const address = realServer.address();
    assert(address && typeof address !== "string");
    const response = await fetch(`http://127.0.0.1:${address.port}/browse/`);
    const expected = await readFile(join(realRoot, "browse", "index.html"));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected);
  } finally {
    await new Promise<void>((resolve) => realServer.close(() => resolve()));
  }
});

test("the TypeScript clone serves frozen external resources locally", async () => {
  const realRoot = join(import.meta.dirname, "..", "web3dkit-public");
  const realServer = createMirrorServer({ mirrorRoot: realRoot });
  await new Promise<void>((resolve) => realServer.listen(0, "127.0.0.1", resolve));
  try {
    const address = realServer.address();
    assert(address && typeof address !== "string");
    const response = await fetch(`http://127.0.0.1:${address.port}/browse/`);
    const html = await response.text();
    assert.match(html, /<html lang="es"/);
    assert.match(html, /Explora componentes Three\.js listos para copiar/);
    assert.match(html, /fondos WebGL/);
    assert.doesNotMatch(html, /Browse copy-ready Three\.js components/);
    assert.match(html, /\/vendor\/[a-f0-9]+\.(?:css|js|jpg|woff2?)/);
    assert.doesNotMatch(html, /https:\/\/fonts\.googleapis\.com\/css2/);
    assert.doesNotMatch(html, /https:\/\/www\.googletagmanager\.com\/gtag\/js/);

    const applicationResponse = await fetch(
      `http://127.0.0.1:${address.port}/assets/index-fOQwe-l-.js`,
    );
    assert.equal(applicationResponse.headers.get("cache-control"), "no-cache");
    const application = await applicationResponse.text();
    assert.match(application, /¿Quién puede unirse\?/);
    assert.match(application, /Comparte Web3DKit con diseñadores y desarrolladores/);
    assert.match(application, /estado de \\"pensando\\" en Canvas 2D/);
    assert.match(application, /MengToSketchbookLandingPage/);
    assert.match(application, /\.\/Sketchbook-lnGryFby\.js/);
    assert.doesNotMatch(application, /MengToCuaderno de bocetosLandingPage/);
    assert.doesNotMatch(application, /Who can join\?/);
  } finally {
    await new Promise<void>((resolve) => realServer.close(() => resolve()));
  }
});

test("the owned backend supports OTP sessions, entitlements, metrics, and frontend routing", async () => {
  const backendRoot = await mkdtemp(join(tmpdir(), "web3dkit-backend-"));
  await writeFile(
    join(backendRoot, "app.js"),
    'const backend = "https://ublctyddhtbgaersvxxb.supabase.co"; const media = "https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/web3dkit-media"; const key = "sb_publishable_KS0-Xf-R_FOdQYOT03I1_A_MtpPvYE1"; const mcp = "https://web3dkit.com/api/mcp";\n',
  );
  await writeFile(join(backendRoot, "index.html"), "<!doctype html><html><head></head><body></body></html>");
  await writeFile(join(backendRoot, "web3dkit-brand.css"), ".brand-wordmark{display:none}");
  const backend = new Web3DKitBackend({
    databasePath: join(backendRoot, "web3dkit.sqlite"),
    publicUrl: "http://127.0.0.1:9999",
    jwtSecret: "test-secret-that-is-not-used-in-production",
    devExposeOtp: true,
    devCheckout: true,
  });
  const backendServer = createMirrorServer({ mirrorRoot: backendRoot, backend });
  await new Promise<void>((resolve) => backendServer.listen(0, "127.0.0.1", resolve));
  try {
    const address = backendServer.address();
    assert(address && typeof address !== "string");
    const url = `http://127.0.0.1:${address.port}`;
    const otpResponse = await fetch(`${url}/api/backend/auth/v1/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "owner@example.com" }),
    });
    assert.equal(otpResponse.status, 200);
    const otp = await otpResponse.json() as { debug_code: string };
    assert.match(otp.debug_code, /^\d{6}$/);

    const verifyResponse = await fetch(`${url}/api/backend/auth/v1/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "owner@example.com", token: otp.debug_code, type: "email" }),
    });
    assert.equal(verifyResponse.status, 200);
    const session = await verifyResponse.json() as { access_token: string; refresh_token: string; user: { email: string } };
    assert.equal(session.user.email, "owner@example.com");
    const authorization = { Authorization: `Bearer ${session.access_token}` };

    const userResponse = await fetch(`${url}/api/backend/auth/v1/user`, { headers: authorization });
    assert.equal(userResponse.status, 200);
    assert.equal((await userResponse.json() as { email: string }).email, "owner@example.com");

    const entitlementResponse = await fetch(`${url}/api/backend/rest/v1/rpc/get_my_entitlement`, {
      method: "POST",
      headers: { ...authorization, "Content-Type": "application/json" },
      body: "{}",
    });
    assert.deepEqual(await entitlementResponse.json(), { plan: "free", status: "inactive", expires_at: null });

    const database = new DatabaseSync(join(backendRoot, "web3dkit.sqlite"));
    database.prepare("INSERT INTO purchases(id,billing_email,plan,status,expires_at,stripe_customer_id,claimed_user_id) VALUES(?,?,?,?,?,?,?)")
      .run("purchase-1", "owner@example.com", "lifetime", "active", null, "cus_test", null);
    database.close();
    const recoveryResponse = await fetch(`${url}/api/backend/functions/v1/claim-pro-entitlement`, {
      method: "POST",
      headers: { ...authorization, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "recover" }),
    });
    const recovery = await recoveryResponse.json() as { recovered: boolean; entitlement: { plan: string } };
    assert.equal(recovery.recovered, true);
    assert.equal(recovery.entitlement.plan, "lifetime");

    const refreshResponse = await fetch(`${url}/api/backend/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    assert.equal(refreshResponse.status, 200);
    assert.ok((await refreshResponse.json() as { refresh_token?: string }).refresh_token);
    const replayResponse = await fetch(`${url}/api/backend/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    assert.equal(replayResponse.status, 401);

    const metricResponse = await fetch(`${url}/api/backend/functions/v1/shader-metrics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shaderId: "orbital-dust", metric: "view", visitorId: "visitor-1" }),
    });
    assert.deepEqual(await metricResponse.json(), { views: 1, copies: 0, accepted: true });

    const mcpResponse = await fetch(`${url}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
    });
    const mcp = await mcpResponse.json() as { result: { tools: Array<{ name: string }> } };
    assert.deepEqual(mcp.result.tools.map((tool) => tool.name), ["search_catalog", "get_catalog_item", "get_item_source", "get_item_prompt"]);

    const transformed = await fetch(`${url}/app.js`).then((response) => response.text());
    assert.match(transformed, /http:\/\/127\.0\.0\.1:9999\/api\/backend/);
    assert.doesNotMatch(transformed, /ublctyddhtbgaersvxxb\.supabase\.co/);
    assert.doesNotMatch(transformed, /sb_publishable_KS0/);
    assert.match(transformed, /web3dkit_local_public_key/);
    assert.match(transformed, /http:\/\/127\.0\.0\.1:9999\/api\/mcp/);
    assert.doesNotMatch(transformed, /https:\/\/web3dkit\.com\/api\/mcp/);
    const transformedHtml = await fetch(`${url}/`).then((response) => response.text());
    assert.match(transformedHtml, /href="\/web3dkit-brand\.css"/);
  } finally {
    await new Promise<void>((resolve) => backendServer.close(() => resolve()));
    await rm(backendRoot, { recursive: true, force: true });
  }
});
