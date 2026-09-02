import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { extname, join } from "node:path";

import { DEFAULT_MIRROR_ROOT } from "../src/server.js";

const RESOURCE_HOSTS = new Set([
  "api.fontshare.com", "cdn.jsdelivr.net", "cdn.tailwindcss.com",
  "cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com",
  "hoirqrkdgbmvpwutwuwj.supabase.co", "images.unsplash.com", "unpkg.com",
  "www.googletagmanager.com",
]);
const extensions: Record<string, string> = {
  "text/css": ".css", "text/javascript": ".js", "application/javascript": ".js",
  "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp",
  "font/woff": ".woff", "font/woff2": ".woff2", "video/mp4": ".mp4",
};

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() && entry.name !== "vendor" ? walk(path) : [path];
  }))).flat();
}

const manifest: Record<string, string> = {};
const pending = new Map<string, Promise<string>>();

async function freeze(rawUrl: string): Promise<string> {
  if (manifest[rawUrl]) return manifest[rawUrl];
  const decodedUrl = rawUrl.replaceAll("&amp;", "&");
  const existing = pending.get(decodedUrl);
  if (existing) return existing;
  const task = (async () => {
    const response = await fetch(decodedUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) throw new Error(`${response.status} ${decodedUrl}`);
    let body = Buffer.from(await response.arrayBuffer());
    const type = response.headers.get("content-type")?.split(";", 1)[0] ?? "";
    const suffix = extensions[type] ?? (extname(new URL(decodedUrl).pathname) || ".bin");
    const name = `${createHash("sha256").update(decodedUrl).digest("hex")}${suffix}`;
    const local = `/vendor/${name}`;
    if (type === "text/css") {
      let css = body.toString("utf8");
      const nested = [...css.matchAll(/url\(\s*["']?(https?:\/\/[^"')\s]+)["']?\s*\)/g)];
      for (const match of nested) css = css.replaceAll(match[1]!, await freeze(match[1]!));
      body = Buffer.from(css);
    }
    await writeFile(join(DEFAULT_MIRROR_ROOT, "vendor", name), body);
    manifest[rawUrl] = local;
    manifest[decodedUrl] = local;
    return local;
  })();
  pending.set(decodedUrl, task);
  return task;
}

await mkdir(join(DEFAULT_MIRROR_ROOT, "vendor"), { recursive: true });
const files = (await walk(DEFAULT_MIRROR_ROOT)).filter((path) => path.endsWith(".html"));
const urls = new Set<string>();
for (const path of files) {
  const html = await readFile(path, "utf8");
  for (const match of html.matchAll(/https?:\/\/[^"'<>\s)]+/g)) {
    const raw = match[0];
    if (raw.includes("${")) continue;
    try {
      const url = new URL(raw.replaceAll("&amp;", "&"));
      const downloadable =
        (url.pathname !== "/" || url.search) &&
        !(url.pathname.endsWith("/") && !url.search) &&
        !(url.hostname === "fonts.googleapis.com" && !url.searchParams.get("family"));
      if (RESOURCE_HOSTS.has(url.hostname) && downloadable) urls.add(raw);
    } catch { /* ignore malformed references */ }
  }
}

let failures = 0;
for (const url of urls) {
  try { await freeze(url); }
  catch (error) { failures += 1; console.warn(String(error)); }
}
await writeFile(
  join(DEFAULT_MIRROR_ROOT, "vendor-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(`Frozen ${Object.keys(manifest).length} URL forms from ${urls.size} external resources.`);
if (failures) throw new Error(`${failures} external resources could not be frozen`);
