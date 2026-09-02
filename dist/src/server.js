import { createHash } from "node:crypto";
import { createReadStream, existsSync, realpathSync } from "node:fs";
import { readFile, realpath, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { backendConfigFromEnv, Web3DKitBackend } from "./backend.js";
const SOURCE_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const SOURCE_MIRROR_ROOT = resolve(SOURCE_DIRECTORY, "../web3dkit-public");
export const DEFAULT_MIRROR_ROOT = existsSync(SOURCE_MIRROR_ROOT)
    ? SOURCE_MIRROR_ROOT
    : resolve(SOURCE_DIRECTORY, "../../web3dkit-public");
const CONTENT_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".mp4": "video/mp4",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8",
    ".webm": "video/webm",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".xml": "application/xml; charset=utf-8",
};
function sendText(response, status, message, headers = {}) {
    const body = Buffer.from(`${message}\n`);
    response.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Length": String(body.byteLength),
        ...headers,
    });
    response.end(body);
}
function decodeRequestPath(request) {
    try {
        const rawUrl = request.url ?? "/";
        // WHATWG URL normalization removes encoded dot segments. Inspect the raw
        // request target first so a traversal attempt is rejected, not silently
        // transformed into a different valid mirror route.
        const pathname = /^[a-z][a-z\d+.-]*:\/\//i.test(rawUrl)
            ? new URL(rawUrl).pathname
            : (rawUrl.split(/[?#]/, 1)[0] ?? "/");
        const decoded = decodeURIComponent(pathname);
        if (decoded.includes("\\") || decoded.includes("\0"))
            return null;
        if (decoded.split("/").includes(".."))
            return null;
        return decoded;
    }
    catch {
        return null;
    }
}
async function fileIfPresent(path, mirrorRoot) {
    try {
        const stats = await stat(path);
        if (!stats.isFile())
            return null;
        const realPath = await realpath(path);
        const rootPrefix = mirrorRoot.endsWith(sep) ? mirrorRoot : `${mirrorRoot}${sep}`;
        if (!realPath.startsWith(rootPrefix))
            return null;
        return { path: realPath, stats };
    }
    catch {
        return null;
    }
}
async function resolveMirrorFile(mirrorRoot, pathname) {
    const relativePath = pathname.replace(/^\/+/, "");
    const requested = resolve(mirrorRoot, relativePath || "index.html");
    const rootPrefix = mirrorRoot.endsWith(sep) ? mirrorRoot : `${mirrorRoot}${sep}`;
    if (requested !== mirrorRoot && !requested.startsWith(rootPrefix))
        return null;
    const direct = await fileIfPresent(requested, mirrorRoot);
    if (direct)
        return direct;
    return fileIfPresent(resolve(requested, "index.html"), mirrorRoot);
}
function parseRange(header, size) {
    if (!header)
        return null;
    const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
    if (!match)
        return null;
    const [, rawStart = "", rawEnd = ""] = match;
    if (!rawStart && !rawEnd)
        return null;
    let start;
    let end;
    if (!rawStart) {
        const suffixLength = Number(rawEnd);
        if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0)
            return null;
        start = Math.max(0, size - suffixLength);
        end = size - 1;
    }
    else {
        start = Number(rawStart);
        end = rawEnd ? Number(rawEnd) : size - 1;
    }
    if (!Number.isSafeInteger(start) ||
        !Number.isSafeInteger(end) ||
        start < 0 ||
        end < start ||
        start >= size) {
        return null;
    }
    return { start, end: Math.min(end, size - 1) };
}
function contentType(path) {
    if (path.endsWith(`${sep}api${sep}local-beta-shaders`)) {
        return "application/json; charset=utf-8";
    }
    return CONTENT_TYPES[extname(path).toLowerCase()] ?? "application/octet-stream";
}
function etag(stats) {
    return `W/\"${stats.size.toString(16)}-${Math.trunc(stats.mtimeMs).toString(16)}\"`;
}
function contentEtag(content) {
    return `\"${createHash("sha256").update(content).digest("base64url")}\"`;
}
export function createMirrorRequestHandler(options = {}) {
    const mirrorRoot = realpathSync(resolve(options.mirrorRoot ?? DEFAULT_MIRROR_ROOT));
    const rewriteExternalResources = options.rewriteExternalResources ?? true;
    const localizeDescriptions = options.localizeDescriptions ?? true;
    const backend = options.backend;
    let vendorManifest = null;
    let translationManifest = null;
    const transformedCache = new Map();
    async function transformedText(path) {
        if (!/\.(?:html|js|mjs|json)$/.test(path))
            return null;
        const cached = transformedCache.get(path);
        if (cached)
            return cached;
        const isHtml = path.endsWith(".html");
        if (rewriteExternalResources && isHtml && vendorManifest === null) {
            try {
                vendorManifest = JSON.parse(await readFile(resolve(mirrorRoot, "vendor-manifest.json"), "utf8"));
            }
            catch {
                vendorManifest = {};
            }
        }
        if (localizeDescriptions && translationManifest === null) {
            try {
                translationManifest = JSON.parse(await readFile(resolve(mirrorRoot, "i18n/es-descriptions.json"), "utf8"));
            }
            catch {
                translationManifest = {};
            }
        }
        let text = await readFile(path, "utf8");
        if (backend && isHtml && !text.includes("/web3dkit-brand.css")) {
            text = text.replace(/<\/head>/i, '<link rel="stylesheet" href="/web3dkit-brand.css"></head>');
        }
        if (backend && !isHtml) {
            text = text.replaceAll('"https://ublctyddhtbgaersvxxb.supabase.co"', JSON.stringify(backend.baseUrl));
            // Every preview/thumbnail is included in the mirror. An empty media
            // origin makes the existing client use those local paths directly.
            text = text.replaceAll('"https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/web3dkit-media"', '""');
            text = text.replaceAll('"sb_publishable_KS0-Xf-R_FOdQYOT03I1_A_MtpPvYE1"', '"web3dkit_local_public_key"');
            text = text.replaceAll('"https://web3dkit.com/api/mcp"', JSON.stringify(`${backend.baseUrl.replace(/\/api\/backend$/, "")}/api/mcp`));
        }
        if (rewriteExternalResources && isHtml) {
            for (const [remote, local] of Object.entries(vendorManifest ?? {})) {
                text = text.replaceAll(remote, local);
            }
        }
        if (localizeDescriptions) {
            for (const [english, spanish] of Object.entries(translationManifest ?? {})) {
                if (isHtml) {
                    text = text.replaceAll(english, spanish.replaceAll('"', "&quot;"));
                    continue;
                }
                const escapedEnglish = JSON.stringify(english).slice(1, -1);
                const escapedSpanish = JSON.stringify(spanish).slice(1, -1);
                text = text.replaceAll(`"${escapedEnglish}"`, `"${escapedSpanish}"`);
            }
            if (isHtml)
                text = text.replace(/<html\s+lang="en"/i, '<html lang="es"');
        }
        const transformed = Buffer.from(text);
        transformedCache.set(path, transformed);
        return transformed;
    }
    return async (request, response) => {
        const requestUrl = new URL(request.url ?? "/", "http://localhost");
        if (backend && await backend.handle(request, response, requestUrl))
            return;
        const method = request.method ?? "GET";
        if (method !== "GET" && method !== "HEAD") {
            sendText(response, 405, "Method Not Allowed", { Allow: "GET, HEAD" });
            return;
        }
        const pathname = decodeRequestPath(request);
        if (pathname === null) {
            sendText(response, 400, "Bad Request");
            return;
        }
        const file = await resolveMirrorFile(mirrorRoot, pathname);
        if (!file) {
            sendText(response, 404, "Not Found");
            return;
        }
        const transformed = await transformedText(file.path);
        const fileEtag = transformed ? contentEtag(transformed) : etag(file.stats);
        if (request.headers["if-none-match"] === fileEtag) {
            response.writeHead(304, { ETag: fileEtag });
            response.end();
            return;
        }
        const servedSize = transformed?.byteLength ?? file.stats.size;
        const rangeHeader = transformed ? undefined : request.headers.range;
        const range = parseRange(rangeHeader, servedSize);
        if (rangeHeader && !range) {
            response.writeHead(416, {
                "Content-Range": `bytes */${servedSize}`,
                "Accept-Ranges": "bytes",
            });
            response.end();
            return;
        }
        const status = range ? 206 : 200;
        const contentLength = range ? range.end - range.start + 1 : servedSize;
        const headers = {
            "Accept-Ranges": "bytes",
            "Cache-Control": transformed
                ? "no-cache"
                : "public, max-age=3600",
            "Content-Length": String(contentLength),
            "Content-Type": contentType(file.path),
            ETag: fileEtag,
            "Last-Modified": file.stats.mtime.toUTCString(),
            "X-Content-Type-Options": "nosniff",
        };
        if (range) {
            headers["Content-Range"] = `bytes ${range.start}-${range.end}/${servedSize}`;
        }
        response.writeHead(status, headers);
        if (method === "HEAD") {
            response.end();
            return;
        }
        if (transformed) {
            response.end(transformed);
            return;
        }
        const stream = createReadStream(file.path, range ?? undefined);
        stream.on("error", () => {
            if (!response.headersSent)
                sendText(response, 500, "Internal Server Error");
            else
                response.destroy();
        });
        stream.pipe(response);
    };
}
export function createMirrorServer(options = {}) {
    const handler = createMirrorRequestHandler(options);
    const server = createServer((request, response) => {
        void handler(request, response).catch(() => {
            if (!response.headersSent)
                sendText(response, 500, "Internal Server Error");
            else
                response.destroy();
        });
    });
    if (options.backend)
        server.once("close", () => options.backend?.close());
    return server;
}
function isMainModule() {
    const entry = process.argv[1];
    return entry !== undefined && resolve(entry) === fileURLToPath(import.meta.url);
}
if (isMainModule()) {
    const envPath = resolve(process.cwd(), ".env");
    if (existsSync(envPath))
        process.loadEnvFile(envPath);
    const port = Number(process.env.PORT ?? "8765");
    const host = process.env.HOST ?? "127.0.0.1";
    const mirrorRoot = process.env.MIRROR_ROOT ?? DEFAULT_MIRROR_ROOT;
    const config = backendConfigFromEnv(port, host);
    config.mirrorRoot = resolve(mirrorRoot);
    const backend = new Web3DKitBackend(config);
    const server = createMirrorServer({ mirrorRoot, backend });
    server.listen(port, host, () => {
        console.log(`Web3DKit TypeScript mirror: http://${host}:${port}/browse/`);
        console.log(`Serving resources from: ${mirrorRoot}`);
    });
}
