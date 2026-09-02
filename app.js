import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { backendConfigFromEnv, Web3DKitBackend } from "./dist/src/backend.js";
import { createMirrorServer } from "./dist/src/server.js";

const appRoot = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(appRoot, ".env");
if (existsSync(envPath)) process.loadEnvFile(envPath);

const port = Number(process.env.PORT ?? "3000");
const host = process.env.HOST ?? "127.0.0.1";
const mirrorRoot = resolve(appRoot, process.env.MIRROR_ROOT ?? "web3dkit-public");
const config = backendConfigFromEnv(port, host);
config.mirrorRoot = mirrorRoot;

const backend = new Web3DKitBackend(config);
const server = createMirrorServer({ mirrorRoot, backend });

server.listen(port, host, () => {
  console.log(`Web3DKit production server: ${config.publicUrl}`);
});
