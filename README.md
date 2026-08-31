# Espejo local de ThreeUI

Este directorio contiene el espejo navegable de los recursos públicos de
`threeui.com`, el script usado para crearlo y los informes de descubrimiento.

## Ver el espejo

```bash
python3 -m http.server 8765 \
  --bind 127.0.0.1 \
  --directory threeui-public
```

Después abre `http://127.0.0.1:8765/browse/`.

## Actualizar el espejo

```bash
python3 tools/discover_public_refs.py \
  --complete \
  --mirror-dir threeui-public \
  --max-requests 5000 \
  --delay 0.2 \
  --output threeui-discovery.json
```

El modo completo reutiliza lo descargado, escanea bundles locales para hallar
imports dinámicos y crea la respuesta local de `/api/local-beta-shaders` que
necesita el catálogo estático.

## Reparar nombres antiguos

```bash
python3 tools/discover_public_refs.py \
  --repair-mirror threeui-public \
  --repair-report threeui-discovery.json \
  --repair-only
```

La enumeración opcional respeta `robots.txt`, se limita al mismo origen y no
intenta evadir respuestas `401` o `403`.

## Pruebas

```bash
python3 -m unittest discover -s tests -v
```
