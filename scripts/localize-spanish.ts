import { execFile } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

import { DEFAULT_MIRROR_ROOT } from "../src/server.js";

const outputPath = join(DEFAULT_MIRROR_ROOT, "i18n", "es-descriptions.json");
const assetRoot = join(DEFAULT_MIRROR_ROOT, "assets");
const execFileAsync = promisify(execFile);

async function filesUnder(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }))).flat();
}

function decodeLiteral(raw: string): string | null {
  try { return JSON.parse(`"${raw}"`) as string; }
  catch { return null; }
}

const descriptions = new Set<string>();
const descriptiveKeys = new Set([
  "answer",
  "asset",
  "description",
  "interaction",
  "origin",
  "passes",
  "question",
]);
const protectedNames = new Set<string>([
  "Web3DKit", "Three.js", "WebGL", "WebGPU", "GLSL", "React", "ShaderMaterial",
  "JavaScript", "TypeScript", "HTML", "CSS", "DOM", "GPU", "CTA", "MCP",
]);

const assetFiles = (await readdir(assetRoot))
  .filter((name) => /^index-.*\.js$/.test(name))
  .map((name) => join(assetRoot, name));
for (const path of assetFiles) {
  const source = await readFile(path, "utf8");
  for (const match of source.matchAll(/([A-Za-z_$][\w$]*):"((?:\\.|[^"\\])*)"/g)) {
    const key = match[1] ?? "";
    const decoded = decodeLiteral(match[2] ?? "");
    const isLongVisibleCopy = key === "children" && (decoded?.length ?? 0) >= 40;
    if (decoded && decoded.length > 2 && (descriptiveKeys.has(key) || isLongVisibleCopy)) {
      descriptions.add(decoded);
    }
  }
}

for (const path of (await filesUnder(DEFAULT_MIRROR_ROOT)).filter((file) => file.endsWith(".html"))) {
  const html = await readFile(path, "utf8");
  for (const match of html.matchAll(/<meta\s+name="description"\s+content="([^"]+)"/gi)) {
    const raw = match[1];
    if (raw && raw.length > 2) descriptions.add(raw);
  }
}

let translations: Record<string, string> = {};
try { translations = JSON.parse(await readFile(outputPath, "utf8")) as Record<string, string>; }
catch { /* first localization run */ }
if (process.argv.includes("--refresh")) translations = {};

function protect(text: string): { text: string; values: string[] } {
  const values: string[] = [];
  let protectedText = text;
  for (const name of [...protectedNames].sort((a, b) => b.length - a.length)) {
    if (!protectedText.includes(name)) continue;
    const token = `ZXQKEEP${values.length}QXZ`;
    protectedText = protectedText.replaceAll(name, token);
    values.push(name);
  }
  return { text: protectedText.replaceAll("&amp;", "&"), values };
}

function restore(text: string, values: string[]): string {
  let restored = text;
  values.forEach((value, index) => {
    restored = restored.replaceAll(`ZXQKEEP${index}QXZ`, value);
  });
  return restored;
}

async function translateBatch(sources: string[]): Promise<string[]> {
  const guarded = sources.map(protect);
  const prompt = [
    "Actúa exclusivamente como motor de traducción de inglés a español.",
    "No uses herramientas, no leas ni modifiques archivos y no expliques tu respuesta.",
    "Traduce solo el texto descriptivo de cada elemento del array.",
    "Conserva exactamente, sin traducir ni alterar, todos los tokens ZXQKEEP<n>QXZ, nombres propios, nombres de proyectos, tags y referencias técnicas.",
    "Devuelve exactamente una línea por elemento, sin encabezado, bloques Markdown ni explicaciones.",
    "Cada línea debe usar el formato NUMERO<TAB>TRADUCCION. No agregues saltos de línea dentro de una traducción.",
    "Conserva el número inicial de cada entrada y el mismo orden.",
    ...guarded.map((item, index) => `${index}\t${item.text.replaceAll("\n", " ")}`),
  ].join("\n");
  const { stdout } = await execFileAsync(
    "copilot",
    [
      "-p", prompt,
      "--silent",
      "--no-color",
      "--no-auto-update",
      "--no-remote",
      "--no-custom-instructions",
      "--disable-builtin-mcps",
      "--allow-all-tools",
    ],
    { cwd: process.cwd(), maxBuffer: 20 * 1024 * 1024, timeout: 10 * 60 * 1000 },
  );
  const translated = new Map<number, string>();
  for (const line of stdout.split(/\r?\n/)) {
    const match = line.match(/^(\d+)\t(.+)$/);
    if (match) translated.set(Number(match[1]), match[2] ?? "");
  }
  if (translated.size !== sources.length || [...translated.keys()].some((index) => index < 0 || index >= sources.length)) {
    throw new Error(`Copilot returned ${translated.size} translations for a batch of ${sources.length}`);
  }
  return guarded.map((item, index) => restore(translated.get(index) ?? sources[index] ?? "", item.values));
}

await mkdir(join(DEFAULT_MIRROR_ROOT, "i18n"), { recursive: true });
const pending = [...descriptions].filter((description) => !translations[description]);
let completed = 0;
const totalPending = pending.length;
while (pending.length) {
  const batch = pending.splice(0, 80);
  const translated = await translateBatch(batch);
  batch.forEach((source, index) => {
    translations[source] = translated[index] ?? source;
  });
  completed += batch.length;
  await writeFile(outputPath, `${JSON.stringify(translations, null, 2)}\n`);
  console.log(`Translated ${completed} of ${totalPending} pending descriptions with Copilot CLI.`);
}
await writeFile(outputPath, `${JSON.stringify(translations, null, 2)}\n`);
console.log(`Spanish descriptions ready: ${Object.keys(translations).length}.`);
