import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import type { Server } from "node:http";
import { join, relative } from "node:path";

import { createMirrorServer, DEFAULT_MIRROR_ROOT } from "../src/server.js";

async function filesUnder(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    }),
  );
  return nested.flat();
}

function listen(server: Server): Promise<number> {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      assert(address && typeof address !== "string");
      resolve(address.port);
    });
  });
}

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

const files = await filesUnder(DEFAULT_MIRROR_ROOT);
const server = createMirrorServer({
  rewriteExternalResources: false,
  localizeDescriptions: false,
});
const port = await listen(server);
const representative = [
  "browse/index.html",
  "assets/index-fOQwe-l-.js",
  "assets/index-x9bNS8sK.css",
  "previews/web3dkit-rings-hero.webm",
  "thumbnails/web3dkit-intro.jpg",
  "api/local-beta-shaders",
];

try {
  for (const localPath of representative) {
    const expected = await readFile(join(DEFAULT_MIRROR_ROOT, localPath));
    const response = await fetch(`http://127.0.0.1:${port}/${localPath}`);
    assert.equal(response.status, 200, localPath);
    const actual = Buffer.from(await response.arrayBuffer());
    assert.equal(sha256(actual), sha256(expected), localPath);
  }
  console.log(
    `Verified ${representative.length} representative resources; ${files.length} mirror files are available.`,
  );
  console.log(`Mirror root: ${relative(process.cwd(), DEFAULT_MIRROR_ROOT)}`);
} finally {
  await new Promise<void>((resolve) => server.close(() => resolve()));
}
