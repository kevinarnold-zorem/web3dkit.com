#!/usr/bin/env python3
"""Discover public, same-origin web resources from references and a wordlist.

The crawler starts with robots.txt, sitemap.xml, and user-provided seeds. It
extracts links and asset paths from public HTML, CSS, JavaScript, XML, and JSON.
An optional, deliberately bounded wordlist mode probes conventional public
paths. It never crosses origins, authenticates, retries 401/403 responses, or
attempts to bypass access controls.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
from collections import deque
from dataclasses import asdict, dataclass
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from typing import Iterable


DEFAULT_ORIGIN = "https://web3dkit.com"
DEFAULT_USER_AGENT = "PublicReferenceDiscovery/1.0"
TEXT_LIMIT = 8 * 1024 * 1024
URL_ATTRIBUTES = {"href", "src", "poster", "data-src", "data-href"}
TEXT_TYPES = (
    "text/",
    "application/json",
    "application/javascript",
    "application/xml",
    "image/svg+xml",
)
PATH_PATTERN = re.compile(
    r"(?P<quote>['\"])(?P<path>(?:https?://|/|\.\.?/)[^'\"<>\s]+)(?P=quote)"
)
CSS_URL_PATTERN = re.compile(r"url\(\s*(['\"]?)([^)'\"\s]+)\1\s*\)", re.I)
SITEMAP_PATTERN = re.compile(r"<loc>\s*([^<]+?)\s*</loc>", re.I)
CANONICAL_PATTERN = re.compile(
    r"<link\s+[^>]*rel=['\"]canonical['\"][^>]*href=['\"]([^'\"]+)", re.I
)
BUNDLE_ASSET_PATTERN = re.compile(
    r"['\"](assets/[A-Za-z0-9@._~!$&'()+,;=/-]+)['\"]"
)
PRIORITY_SUFFIXES = {
    ".css", ".js", ".json", ".mjs", ".wasm", ".woff", ".woff2",
}


@dataclass(frozen=True)
class Result:
    url: str
    status: int
    content_type: str
    bytes: int
    sha256: str
    source: str


class ReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.references: set[str] = set()
        self.css_fragments: list[str] = []
        self.in_style = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "style":
            self.in_style = True
        for name, value in attrs:
            if name.lower() in URL_ATTRIBUTES and value:
                self.references.add(value.strip())
            if name.lower() == "style" and value:
                self.css_fragments.append(value)
            if name.lower() == "srcset" and value:
                for candidate in value.split(","):
                    url = candidate.strip().split(" ", 1)[0]
                    if url:
                        self.references.add(url)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "style":
            self.in_style = False

    def handle_data(self, data: str) -> None:
        if self.in_style:
            self.css_fragments.append(data)


class SameOriginRedirectHandler(urllib.request.HTTPRedirectHandler):
    def __init__(self, origin_parts: urllib.parse.SplitResult) -> None:
        super().__init__()
        self.origin_parts = origin_parts

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # type: ignore[no-untyped-def]
        parts = urllib.parse.urlsplit(urllib.parse.urljoin(req.full_url, newurl))
        if (parts.scheme, parts.netloc) != (
            self.origin_parts.scheme,
            self.origin_parts.netloc,
        ):
            raise urllib.error.HTTPError(
                req.full_url,
                code,
                f"redirección rechazada fuera del origen: {newurl}",
                headers,
                fp,
            )
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class PublicDiscovery:
    def __init__(self, args: argparse.Namespace) -> None:
        self.args = args
        self.origin = args.origin.rstrip("/")
        self.origin_parts = urllib.parse.urlsplit(self.origin)
        self.queue: deque[tuple[str, str]] = deque()
        self.queued: set[str] = set()
        self.visited: set[str] = set()
        self.results: list[Result] = []
        self.failures: list[dict[str, object]] = []
        self.request_count = 0
        self.robot_parser = urllib.robotparser.RobotFileParser()
        self.robot_parser.set_url(f"{self.origin}/robots.txt")
        self.opener = urllib.request.build_opener(
            SameOriginRedirectHandler(self.origin_parts)
        )

    def normalize(self, value: str, base: str | None = None) -> str | None:
        value = value.strip()
        if not value or value.startswith(("#", "data:", "blob:", "mailto:", "tel:", "javascript:")):
            return None
        if value.startswith("//") or len(value) > 2048:
            return None
        if value == "/&" or any(character in value for character in "<>"):
            return None
        if re.search(r"[A-Za-z0-9+/]{80,}={0,2}", value):
            return None
        # A backslash is never a valid separator in the URL paths this tool
        # mirrors. Seeing one here normally means a regex consumed the escape
        # before a quote in raw JSON (for example: `sourceUrl=\"/...html\"`).
        if "\\" in value:
            return None
        if "${" in value or any(token in value for token in ("=>", "?.", ",window", ".fetchData")):
            return None
        if value.startswith(("./", "../")):
            candidate_path = urllib.parse.urlsplit(value.split("?", 1)[0]).path
            suffix = Path(candidate_path).suffix.lower()
            # Extensionless relative imports in packaged source describe the
            # original TypeScript module graph, not deployable web resources.
            if not suffix:
                return None
        absolute = urllib.parse.urljoin(base or f"{self.origin}/", value)
        parts = urllib.parse.urlsplit(absolute)
        if parts.scheme not in {"http", "https"}:
            return None
        if (parts.scheme, parts.netloc) != (self.origin_parts.scheme, self.origin_parts.netloc):
            return None
        decoded_path = urllib.parse.unquote(parts.path or "/")
        # URL-encoded dot segments (for example ``%2e%2e``) must be checked
        # after decoding. Otherwise local_path() could resolve them outside the
        # configured mirror directory when saving a response.
        if "\\" in decoded_path or ".." in PurePosixPath(decoded_path).parts:
            return None
        clean_path = urllib.parse.quote(decoded_path, safe="/%:@-._~!$&'()*+,;=")
        return urllib.parse.urlunsplit((parts.scheme, parts.netloc, clean_path, parts.query, ""))

    def enqueue(
        self,
        value: str,
        source: str,
        base: str | None = None,
        priority: bool = False,
    ) -> None:
        url = self.normalize(value, base)
        if url and url not in self.queued and url not in self.visited:
            self.queued.add(url)
            if priority:
                self.queue.appendleft((url, source))
            else:
                self.queue.append((url, source))

    def priority_reference(self, value: str, base: str) -> bool:
        url = self.normalize(value, base)
        if not url:
            return False
        path = urllib.parse.urlsplit(url).path
        return path.startswith(("/assets/", "/source-code/")) or Path(path).suffix.lower() in PRIORITY_SUFFIXES

    def local_path(self, url: str) -> Path | None:
        if not self.args.mirror_dir:
            return None
        parts = urllib.parse.urlsplit(url)
        decoded_path = urllib.parse.unquote(parts.path)
        path = PurePosixPath(decoded_path.lstrip("/"))
        if "\\" in decoded_path or ".." in path.parts:
            return None
        if not path.parts:
            path = PurePosixPath("index.html")
        elif path.suffix == "":
            path /= "index.html"
        mirror_root = self.args.mirror_dir.resolve()
        destination = self.args.mirror_dir.joinpath(*path.parts)
        try:
            destination.resolve().relative_to(mirror_root)
        except ValueError:
            # Defense in depth for symlinks inside an existing mirror that
            # point outside its root.
            return None
        return destination

    def setup_robots(self) -> None:
        try:
            self.robot_parser.read()
        except OSError as error:
            print(f"[AVISO] No se pudo leer robots.txt: {error}", file=sys.stderr)

    def allowed(self, url: str) -> bool:
        return self.robot_parser.can_fetch(self.args.user_agent, url)

    def fetch(self, url: str, source: str) -> tuple[Result, bytes] | None:
        local_path = self.local_path(url)
        if self.args.resume and local_path and local_path.is_file():
            size = local_path.stat().st_size
            body = local_path.read_bytes() if size <= self.args.max_bytes else b""
            content_type = mimetypes.guess_type(local_path.name)[0] or "application/octet-stream"
            digest = hashlib.sha256(body).hexdigest() if body else ""
            result = Result(url, 200, content_type, size, digest, "local")
            self.results.append(result)
            return result, body
        if self.request_count >= self.args.max_requests:
            return None
        if not self.allowed(url):
            self.failures.append({"url": url, "status": 0, "reason": "robots.txt"})
            print(f"[ROBOTS] {url}")
            return None

        if self.request_count:
            time.sleep(self.args.delay)
        request = urllib.request.Request(
            url,
            headers={"User-Agent": self.args.user_agent, "Accept": "*/*"},
        )
        self.request_count += 1
        try:
            with self.opener.open(request, timeout=self.args.timeout) as response:
                final_url = self.normalize(response.geturl())
                if final_url is None:
                    raise ValueError(f"redirección fuera del origen: {response.geturl()}")
                content_type = response.headers.get_content_type()
                declared = response.headers.get("Content-Length")
                if declared and int(declared) > self.args.max_bytes:
                    body = b""
                    size = int(declared)
                    digest = ""
                else:
                    body = response.read(self.args.max_bytes + 1)
                    if len(body) > self.args.max_bytes:
                        body = b""
                        size = self.args.max_bytes + 1
                        digest = ""
                    else:
                        size = len(body)
                        digest = hashlib.sha256(body).hexdigest()
                soft_not_found = self.soft_not_found(url, final_url, content_type, body)
                if soft_not_found:
                    self.failures.append(
                        {"url": url, "status": response.status, "reason": soft_not_found}
                    )
                    print(f"[SOFT 404] {url} -> {soft_not_found}")
                    return None
                result = Result(final_url, response.status, content_type, size, digest, source)
                self.results.append(result)
                print(f"[PUBLICO {response.status}] {final_url} ({content_type}, {size} bytes)")
                if body and self.args.mirror_dir:
                    self.save_body(final_url, body)
                return result, body
        except urllib.error.HTTPError as error:
            reason = "acceso protegido" if error.code in {401, 403} else str(error.reason)
            self.failures.append({"url": url, "status": error.code, "reason": reason})
            print(f"[HTTP {error.code}] {url}")
        except (urllib.error.URLError, OSError, ValueError) as error:
            self.failures.append({"url": url, "status": 0, "reason": str(error)})
            print(f"[ERROR] {url}: {error}", file=sys.stderr)
        return None

    def soft_not_found(
        self, requested_url: str, final_url: str, content_type: str, body: bytes
    ) -> str | None:
        """Recognize SPA fallbacks that respond 200 for an unknown route."""
        requested_path = urllib.parse.urlsplit(requested_url).path
        if requested_path.endswith(".json") and content_type != "application/json":
            return f"se esperaba application/json, llegó {content_type}"
        if not content_type.startswith("text/html") or not body:
            return None
        text = body.decode("utf-8", errors="replace")
        canonical_match = CANONICAL_PATTERN.search(text)
        if not canonical_match:
            return None
        canonical = self.normalize(canonical_match.group(1), final_url)
        final_path = urllib.parse.urlsplit(final_url).path
        canonical_path = urllib.parse.urlsplit(canonical).path if canonical else ""
        # Web3DKit intentionally serves its browse catalogue at `/` while
        # declaring `/browse` canonical. That one alias is a real homepage,
        # not the generic SPA fallback used for unknown paths.
        if final_path == "/" and canonical_path == "/browse":
            return None
        if canonical and canonical_path != final_path:
            return f"fallback canónico a {canonical}"
        return None

    def save_body(self, url: str, body: bytes) -> None:
        destination = self.local_path(url)
        if destination is None:
            return
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(body)

    def extract(self, url: str, content_type: str, body: bytes) -> Iterable[str]:
        if not body or len(body) > TEXT_LIMIT or not content_type.startswith(TEXT_TYPES):
            return []
        text = body.decode("utf-8", errors="replace")
        references: set[str] = set()
        searchable_texts = [text]
        if content_type == "application/json":
            # Decode JSON before scanning strings so escaped quotes and slashes
            # cannot leak their backslashes into local filenames.
            try:
                document = json.loads(text)
            except json.JSONDecodeError:
                searchable_texts = []
            else:
                searchable_texts = list(iter_json_strings(document))
        if content_type.startswith("text/html"):
            parser = ReferenceParser()
            parser.feed(text)
            references.update(parser.references)
            for css in parser.css_fragments:
                references.update(match.group(2) for match in CSS_URL_PATTERN.finditer(css))
        for searchable in searchable_texts:
            if searchable.startswith(("http://", "https://", "/", "./", "../")):
                references.add(searchable)
            references.update(match.group("path") for match in PATH_PATTERN.finditer(searchable))
            # In JavaScript, `url(...)` is commonly an ordinary function call;
            # applying the CSS grammar there turns variables into fake paths.
            if content_type.startswith("text/css"):
                references.update(match.group(2) for match in CSS_URL_PATTERN.finditer(searchable))
            references.update(match.group(1).strip() for match in SITEMAP_PATTERN.finditer(searchable))
            references.update("/" + match.group(1) for match in BUNDLE_ASSET_PATTERN.finditer(searchable))
        return references

    def scan_existing_mirror(self) -> None:
        """Seed the frontier from already downloaded text files and bundles."""
        root = self.args.mirror_dir
        if not root or not root.is_dir():
            return
        scanned = 0
        discovered = 0
        for local_path in sorted(root.rglob("*")):
            if not local_path.is_file() or local_path.stat().st_size > TEXT_LIMIT:
                continue
            relative = local_path.relative_to(root)
            if relative.name == "index.html":
                route = "/" + relative.parent.as_posix().strip("/")
                if route != "/":
                    route += "/"
            else:
                route = "/" + relative.as_posix()
            source_url = urllib.parse.urljoin(self.origin + "/", route.lstrip("/"))
            content_type = mimetypes.guess_type(local_path.name)[0] or "application/octet-stream"
            body = local_path.read_bytes()
            refs = list(self.extract(source_url, content_type, body))
            if refs:
                scanned += 1
            for reference in refs:
                before = len(self.queued)
                self.enqueue(
                    reference,
                    source_url,
                    source_url,
                    priority=self.priority_reference(reference, source_url),
                )
                discovered += int(len(self.queued) > before)
        print(f"[ESCANEO LOCAL] {scanned} archivos con referencias, {discovered} URLs nuevas")

    def add_bruteforce_candidates(self) -> None:
        words: set[str] = set()
        for path in self.args.wordlist:
            for raw in path.read_text(encoding="utf-8").splitlines():
                word = raw.strip().strip("/")
                if word and not word.startswith("#"):
                    words.add(word)

        if self.args.derive_words:
            for result in self.results:
                for part in PurePosixPath(urllib.parse.urlsplit(result.url).path).parts:
                    stem = PurePosixPath(part).stem.lower()
                    if re.fullmatch(r"[a-z0-9][a-z0-9-]{2,80}", stem):
                        words.add(stem)

        templates = self.args.template or [
            "/source-code/{word}.json",
            "/landing-pages/{word}.html",
            "/three-js/{word}",
            "/hero/{word}",
            "/backgrounds/{word}",
        ]
        for word in sorted(words):
            safe_word = word if "/" not in word else urllib.parse.quote(word, safe="/-._~")
            for template in templates:
                self.enqueue(template.format(word=safe_word), "wordlist")

    def crawl(self) -> None:
        self.setup_robots()
        self.enqueue("/robots.txt", "seed")
        self.enqueue("/sitemap.xml", "seed")
        if self.args.complete:
            self.enqueue("/", "complete")
        for seed in self.args.seed:
            self.enqueue(seed, "seed")
        # Explicit wordlists run before the potentially very large sitemap
        # frontier. Derived words are added in a second phase below.
        if self.args.bruteforce and self.args.wordlist:
            self.add_bruteforce_candidates()
        if self.args.scan_mirror:
            self.scan_existing_mirror()

        while self.queue and self.request_count < self.args.max_requests:
            url, source = self.queue.popleft()
            self.queued.discard(url)
            if url in self.visited:
                continue
            self.visited.add(url)
            fetched = self.fetch(url, source)
            if not fetched:
                continue
            result, body = fetched
            if self.args.crawl:
                for reference in self.extract(result.url, result.content_type, body):
                    self.enqueue(
                        reference,
                        result.url,
                        result.url,
                        priority=self.priority_reference(reference, result.url),
                    )

        if self.args.bruteforce and self.request_count < self.args.max_requests:
            self.add_bruteforce_candidates()
            while self.queue and self.request_count < self.args.max_requests:
                url, source = self.queue.popleft()
                self.queued.discard(url)
                if url in self.visited:
                    continue
                self.visited.add(url)
                self.fetch(url, source)

        if self.args.complete and self.args.mirror_dir:
            self.prepare_local_runtime()

    def prepare_local_runtime(self) -> None:
        """Create local-only responses expected by the static catalogue app."""
        endpoint = self.args.mirror_dir / "api" / "local-beta-shaders"
        endpoint.parent.mkdir(parents=True, exist_ok=True)
        endpoint.write_text("[]\n", encoding="utf-8")
        print(f"[RUNTIME LOCAL] {endpoint} -> []")

    def write_report(self) -> None:
        self.args.output.parent.mkdir(parents=True, exist_ok=True)
        mirror_files = 0
        mirror_bytes = 0
        if self.args.mirror_dir and self.args.mirror_dir.is_dir():
            for path in self.args.mirror_dir.rglob("*"):
                if path.is_file():
                    mirror_files += 1
                    mirror_bytes += path.stat().st_size
        report = {
            "origin": self.origin,
            "requests": self.request_count,
            "complete": not self.queue,
            "requestLimitReached": bool(self.queue) and self.request_count >= self.args.max_requests,
            "pending": len(self.queue),
            "visited": len(self.visited),
            "mirror": {"files": mirror_files, "bytes": mirror_bytes},
            "public": [asdict(item) for item in self.results],
            "failures": self.failures,
        }
        self.args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        url_file = self.args.output.with_suffix(".urls.txt")
        url_file.write_text("\n".join(sorted({item.url for item in self.results})) + "\n", encoding="utf-8")
        print(f"\nReporte: {self.args.output}")
        print(f"URLs públicas: {url_file}")
        print(
            "Estado: "
            + ("completo" if report["complete"] else f"incompleto, {report['pending']} pendientes")
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Descubre referencias web públicas del mismo origen y, opcionalmente, prueba una wordlist acotada."
    )
    parser.add_argument("--origin", default=DEFAULT_ORIGIN, help="Origen HTTPS permitido")
    parser.add_argument("--seed", action="append", default=[], help="URL o ruta inicial; se puede repetir")
    parser.add_argument("--output", type=Path, default=Path("web3dkit-discovery.json"))
    parser.add_argument("--mirror-dir", type=Path, help="Guarda byte por byte las respuestas públicas")
    parser.add_argument(
        "--complete",
        action="store_true",
        help="Espejo completo: incluye /, reanuda archivos locales, escanea bundles y prepara el runtime estático",
    )
    parser.add_argument("--resume", action=argparse.BooleanOptionalAction, default=False)
    parser.add_argument("--scan-mirror", action=argparse.BooleanOptionalAction, default=False)
    parser.add_argument(
        "--repair-mirror",
        type=Path,
        help="Corrige nombres existentes que contienen backslashes; no descarga nada con --repair-only",
    )
    parser.add_argument(
        "--repair-report",
        type=Path,
        help="Corrige URLs antiguas terminadas en %%5C y regenera el archivo .urls.txt",
    )
    parser.add_argument("--repair-only", action="store_true")
    parser.add_argument("--crawl", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--bruteforce", action="store_true", help="Activa pruebas de rutas basadas en wordlists")
    parser.add_argument("--wordlist", type=Path, action="append", default=[], help="Archivo de palabras; se puede repetir")
    parser.add_argument("--derive-words", action=argparse.BooleanOptionalAction, default=True)
    parser.add_argument("--template", action="append", default=[], help="Plantilla con {word}; se puede repetir")
    parser.add_argument("--max-requests", type=int, default=500)
    parser.add_argument("--delay", type=float, default=0.35, help="Pausa mínima entre peticiones")
    parser.add_argument("--timeout", type=float, default=20.0)
    parser.add_argument("--max-bytes", type=int, default=10 * 1024 * 1024)
    parser.add_argument("--user-agent", default=DEFAULT_USER_AGENT)
    args = parser.parse_args()

    if args.complete:
        if not args.mirror_dir:
            parser.error("--complete requiere --mirror-dir")
        args.resume = True
        args.scan_mirror = True
        if args.max_requests == 500:
            args.max_requests = 5000

    parts = urllib.parse.urlsplit(args.origin)
    if parts.scheme != "https" or not parts.netloc or parts.path not in {"", "/"}:
        parser.error("--origin debe ser un origen HTTPS sin ruta, por ejemplo https://web3dkit.com")
    if args.bruteforce and not args.wordlist and not args.derive_words:
        parser.error("--bruteforce requiere --wordlist o --derive-words")
    if args.max_requests < 1 or args.max_requests > 10_000:
        parser.error("--max-requests debe estar entre 1 y 10000")
    if args.delay < 0.1:
        parser.error("--delay debe ser al menos 0.1 segundos")
    for path in args.wordlist:
        if not path.is_file():
            parser.error(f"wordlist inexistente: {path}")
    return args


def iter_json_strings(value: object) -> Iterable[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for key, item in value.items():
            yield from iter_json_strings(key)
            yield from iter_json_strings(item)
    elif isinstance(value, list):
        for item in value:
            yield from iter_json_strings(item)


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def repair_mirror(root: Path) -> tuple[int, int]:
    """Rename malformed paths safely and remove only byte-identical duplicates."""
    if not root.is_dir():
        raise SystemExit(f"No existe el mirror: {root}")
    renamed = 0
    duplicates = 0
    for source in sorted(root.rglob("*")):
        if not source.is_file() or "\\" not in source.name:
            continue
        destination = source.with_name(source.name.replace("\\", ""))
        if destination.exists():
            if file_sha256(source) == file_sha256(destination):
                source.unlink()
                duplicates += 1
                print(f"[DUPLICADO ELIMINADO] {source}")
                continue
            conflict = destination.with_name(destination.name + ".backslash-conflict")
            counter = 1
            while conflict.exists():
                conflict = destination.with_name(
                    destination.name + f".backslash-conflict-{counter}"
                )
                counter += 1
            source.replace(conflict)
            renamed += 1
            print(f"[CONFLICTO PRESERVADO] {source} -> {conflict}")
            continue
        source.replace(destination)
        renamed += 1
        print(f"[RENOMBRADO] {source} -> {destination}")
    print(f"Reparación terminada: {renamed} renombrados, {duplicates} duplicados idénticos eliminados")
    return renamed, duplicates


def remove_encoded_trailing_backslash(value: object) -> object:
    if isinstance(value, str):
        return re.sub(r"(?i)%5c$", "", value)
    return value


def repair_report(path: Path) -> tuple[int, int]:
    if not path.is_file():
        raise SystemExit(f"No existe el reporte: {path}")
    report = json.loads(path.read_text(encoding="utf-8"))
    changed = 0
    deduplicated = 0
    public_by_url: dict[str, dict[str, object]] = {}
    for item in report.get("public", []):
        original_url = item.get("url")
        original_source = item.get("source")
        item["url"] = remove_encoded_trailing_backslash(original_url)
        item["source"] = remove_encoded_trailing_backslash(original_source)
        changed += int(item["url"] != original_url) + int(item["source"] != original_source)
        url = str(item["url"])
        if url in public_by_url:
            deduplicated += 1
        else:
            public_by_url[url] = item
    report["public"] = list(public_by_url.values())
    for item in report.get("failures", []):
        original_url = item.get("url")
        item["url"] = remove_encoded_trailing_backslash(original_url)
        changed += int(item["url"] != original_url)
    path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    url_file = path.with_suffix(".urls.txt")
    url_file.write_text("\n".join(sorted(public_by_url)) + "\n", encoding="utf-8")
    print(f"Reporte reparado: {changed} campos corregidos, {deduplicated} resultados duplicados eliminados")
    return changed, deduplicated


def main() -> None:
    args = parse_args()
    if args.repair_only and not (args.repair_mirror or args.repair_report):
        raise SystemExit("--repair-only requiere --repair-mirror o --repair-report")
    if args.repair_mirror:
        repair_mirror(args.repair_mirror)
    if args.repair_report:
        repair_report(args.repair_report)
    if args.repair_only:
        return
    discovery = PublicDiscovery(args)
    discovery.crawl()
    discovery.write_report()


if __name__ == "__main__":
    main()
