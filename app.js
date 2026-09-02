import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { backendConfigFromEnv, Web3DKitBackend } from "./dist/src/backend.js";
import { createMirrorServer } from "./dist/src/server.js";

const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) process.loadEnvFile(envPath);

const port = Number(process.env.PORT ?? "3000");
const host = process.env.HOST ?? "127.0.0.1";
const mirrorRoot = resolve(process.env.MIRROR_ROOT ?? "web3dkit-public");
const config = backendConfigFromEnv(port, host);
config.mirrorRoot = mirrorRoot;

const backend = new Web3DKitBackend(config);
const server = createMirrorServer({ mirrorRoot, backend });

server.listen(port, host, () => {
  console.log(`Web3DKit production server: ${config.publicUrl}`);
});

