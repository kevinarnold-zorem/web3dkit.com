import { createHmac } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { Web3DKitBackend } from "../src/backend.js";

interface ImportData {
  users?: Array<{
    id: string;
    email?: string | null;
    email_confirmed_at?: string | null;
    google_sub?: string | null;
    is_anonymous?: boolean;
    created_at?: string;
  }>;
  entitlements?: Array<{
    user_id: string;
    plan: "free" | "yearly" | "lifetime";
    status: string;
    expires_at?: string | null;
    stripe_customer_id?: string | null;
  }>;
  purchases?: Array<{
    id: string;
    billing_email: string;
    plan: "yearly" | "lifetime";
    status: string;
    expires_at?: string | null;
    stripe_customer_id?: string | null;
    claimed_user_id?: string | null;
  }>;
  metrics?: Array<{ shader_id: string; views?: number; copies?: number }>;
  designcode_passes?: Array<{ token: string; expires_at: string; redeemed_by?: string | null }>;
}

const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) process.loadEnvFile(envPath);

const sourcePath = process.argv[2] ? resolve(process.argv[2]) : null;
if (!sourcePath) throw new Error("Usage: npm run backend:import -- /absolute/path/export.json");
const databasePath = resolve(process.env.BACKEND_DATABASE_PATH ?? "data/web3dkit.sqlite");
const secret = process.env.AUTH_JWT_SECRET ?? "web3dkit-local-development-secret-change-me";
await mkdir(dirname(databasePath), { recursive: true });
const input = JSON.parse(await readFile(sourcePath, "utf8")) as ImportData;
const bootstrap = new Web3DKitBackend({
  databasePath,
  publicUrl: process.env.PUBLIC_URL ?? "http://127.0.0.1:8765",
  jwtSecret: secret,
  devExposeOtp: false,
  devCheckout: false,
});
bootstrap.close();
const db = new DatabaseSync(databasePath);
db.exec("PRAGMA foreign_keys=ON; BEGIN IMMEDIATE;");
try {
  const user = db.prepare(`INSERT INTO users(id,email,email_confirmed_at,google_sub,is_anonymous,created_at)
    VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,email_confirmed_at=excluded.email_confirmed_at,
    google_sub=excluded.google_sub,is_anonymous=excluded.is_anonymous`);
  for (const row of input.users ?? []) user.run(row.id, row.email ?? null, row.email_confirmed_at ?? null, row.google_sub ?? null, row.is_anonymous ? 1 : 0, row.created_at ?? new Date().toISOString());

  const entitlement = db.prepare(`INSERT INTO entitlements(user_id,plan,status,expires_at,stripe_customer_id) VALUES(?,?,?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET plan=excluded.plan,status=excluded.status,expires_at=excluded.expires_at,stripe_customer_id=excluded.stripe_customer_id`);
  for (const row of input.entitlements ?? []) entitlement.run(row.user_id, row.plan, row.status, row.expires_at ?? null, row.stripe_customer_id ?? null);

  const purchase = db.prepare(`INSERT INTO purchases(id,billing_email,plan,status,expires_at,stripe_customer_id,claimed_user_id) VALUES(?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET billing_email=excluded.billing_email,plan=excluded.plan,status=excluded.status,
    expires_at=excluded.expires_at,stripe_customer_id=excluded.stripe_customer_id,claimed_user_id=excluded.claimed_user_id`);
  for (const row of input.purchases ?? []) purchase.run(row.id, row.billing_email.toLowerCase(), row.plan, row.status, row.expires_at ?? null, row.stripe_customer_id ?? null, row.claimed_user_id ?? null);

  const metric = db.prepare(`INSERT INTO shader_metrics(shader_id,views,copies) VALUES(?,?,?)
    ON CONFLICT(shader_id) DO UPDATE SET views=excluded.views,copies=excluded.copies`);
  for (const row of input.metrics ?? []) metric.run(row.shader_id, Math.max(0, Math.floor(row.views ?? 0)), Math.max(0, Math.floor(row.copies ?? 0)));

  const pass = db.prepare(`INSERT INTO designcode_passes(token_hash,expires_at,redeemed_by) VALUES(?,?,?)
    ON CONFLICT(token_hash) DO UPDATE SET expires_at=excluded.expires_at,redeemed_by=excluded.redeemed_by`);
  for (const row of input.designcode_passes ?? []) pass.run(createHmac("sha256", secret).update(row.token).digest("base64url"), row.expires_at, row.redeemed_by ?? null);
  db.exec("COMMIT;");
} catch (error) {
  db.exec("ROLLBACK;");
  db.close();
  throw error;
}
db.close();
console.log(JSON.stringify({
  databasePath,
  users: input.users?.length ?? 0,
  entitlements: input.entitlements?.length ?? 0,
  purchases: input.purchases?.length ?? 0,
  metrics: input.metrics?.length ?? 0,
  designcodePasses: input.designcode_passes?.length ?? 0,
}, null, 2));
