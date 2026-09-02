from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

from tools.discover_public_refs import PublicDiscovery


class PublicDiscoveryPathTests(unittest.TestCase):
    def make_discovery(self, mirror_dir: Path) -> PublicDiscovery:
        args = SimpleNamespace(
            origin="https://web3dkit.com",
            mirror_dir=mirror_dir,
            max_bytes=10 * 1024 * 1024,
            resume=True,
        )
        return PublicDiscovery(args)

    def test_rejects_encoded_parent_segments(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            discovery = self.make_discovery(Path(directory))
            malicious_url = "https://web3dkit.com/%2e%2e/README.md"

            self.assertIsNone(discovery.normalize(malicious_url))
            self.assertIsNone(discovery.local_path(malicious_url))

    def test_rejects_symlink_that_escapes_mirror(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            mirror = root / "mirror"
            mirror.mkdir()
            (mirror / "escape").symlink_to(root, target_is_directory=True)
            discovery = self.make_discovery(mirror)

            self.assertIsNone(
                discovery.local_path("https://web3dkit.com/escape/outside.txt")
            )

    def test_resume_includes_local_resource_in_results(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            mirror = Path(directory)
            asset = mirror / "assets" / "app.js"
            asset.parent.mkdir()
            asset.write_bytes(b"console.log('cached');\n")
            discovery = self.make_discovery(mirror)
            url = "https://web3dkit.com/assets/app.js"

            result, body = discovery.fetch(url, "test") or (None, b"")

            self.assertIsNotNone(result)
            self.assertEqual(body, asset.read_bytes())
            self.assertEqual(discovery.results, [result])
            self.assertEqual(result.source, "local")


if __name__ == "__main__":
    unittest.main()
