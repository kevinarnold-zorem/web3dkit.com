# Espejo local de Web3DKit

Este directorio contiene el espejo navegable de los recursos públicos de
`web3dkit.com`, el script usado para crearlo y los informes de descubrimiento.

## Ver el espejo con TypeScript

```bash
npm install
npm run dev
```

Después abre `http://127.0.0.1:8765/browse/`.

## Backend propio

El servidor incluye un backend TypeScript compatible con el subconjunto de
Supabase utilizado por la interfaz. La URL del proyecto Supabase original se
reemplaza al vuelo por `${PUBLIC_URL}/api/backend`; no se envían credenciales,
sesiones, OTP, entitlements ni métricas al backend del espejo.

La persistencia utiliza SQLite en `data/web3dkit.sqlite`. Copia
`.env.example` a `.env` o exporta sus variables antes de iniciar el servidor.
En producción son obligatorios `AUTH_JWT_SECRET` y `EMAIL_WEBHOOK_URL`.

Flujos disponibles:

- inicio de sesión por OTP y Google OAuth;
- sesiones firmadas y renovación mediante refresh token;
- entitlements Free, Yearly, Lifetime y Complimentary;
- recuperación y transferencia de compras;
- métricas, feedback y pases DesignCode;
- Stripe Checkout, Billing Portal y webhook, cuando se configuran sus claves;
- servidor MCP propio para consultar el catálogo y sus fuentes;
- previews y thumbnails servidos exclusivamente desde las copias locales;
- checkout local de prueba con `BACKEND_DEV_CHECKOUT=true`.

El callback que debe registrarse en Google es:

```text
${PUBLIC_URL}/api/backend/auth/google/callback
```

Para importar un export del backend anterior:

```bash
npm run backend:import -- /ruta/absoluta/web3dkit-backend-export.json
```

El formato y el procedimiento completo están en
[`docs/backend-migration.md`](docs/backend-migration.md).

El servidor TypeScript entrega directamente los archivos de `web3dkit-public`,
incluye soporte para `Range` en video, `HEAD`, ETags, MIME types y rutas basadas
en `index.html`. De esta forma el clon conserva los mismos bytes y recursos del
espejo original. Las fuentes, imágenes y librerías visuales de terceros están
congeladas en `web3dkit-public/vendor`; el servidor sustituye sus URLs al vuelo
sin modificar los archivos originales del espejo.

Para regenerar esos recursos externos:

```bash
npm run vendor
```

## Servidor simple alternativo

```bash
python3 -m http.server 8765 \
  --bind 127.0.0.1 \
  --directory web3dkit-public
```

Después abre `http://127.0.0.1:8765/browse/`.

## Despliegue en cPanel

El repositorio incluye `app.js`, el wrapper de Passenger y `dist/src` ya
compilado. `.cpanel.yml` reinicia la aplicación después de cada despliegue sin
crear un directorio `node_modules`. Requiere Node.js 22 o posterior.

En **Git Version Control**, clona este repositorio y selecciona `main`. Después,
en **Application Manager**, registra la carpeta clonada como aplicación Node.js
de producción. Usa `app_wrapper.cjs` como startup file en CloudLinux/LiteSpeed;
en Passenger estándar también puede usarse este wrapper.

Si LiteSpeed registra `execve():/usr/bin/node: No such file or directory`, la
ruta del intérprete configurada en cPanel es incorrecta. Obtén la ruta real con
`node -p 'process.execPath'` y configúrala como **Node.js binary** o directiva
`PassengerNodejs` de la aplicación. En instalaciones EasyApache 4 suele ser
`/opt/cpanel/ea-nodejs22/bin/node`; Node.js Selector crea una ruta dentro de
`/home/USUARIO/nodevenv/`.

Variables mínimas:

```text
NODE_ENV=production
PUBLIC_URL=https://tu-dominio
AUTH_JWT_SECRET=una-clave-aleatoria-de-al-menos-32-caracteres
BACKEND_DATABASE_PATH=/home/USUARIO/web3dkit-data/web3dkit.sqlite
```

Las credenciales opcionales de correo, Google y Stripe están documentadas en
`.env.example`. En el primer despliegue usa **Update from Remote** y después
**Deploy HEAD Commit**. Los despliegues posteriores actualizan el código
compilado y reinician Passenger. CloudLinux NodeJS Selector administra su propio
entorno virtual y el enlace simbólico `node_modules`; no debe ejecutarse
`npm ci` desde `.cpanel.yml`.

## Actualizar el espejo

```bash
python3 tools/discover_public_refs.py \
  --complete \
  --mirror-dir web3dkit-public \
  --max-requests 5000 \
  --delay 0.2 \
  --output web3dkit-discovery.json
```

El modo completo reutiliza lo descargado, escanea bundles locales para hallar
imports dinámicos y crea la respuesta local de `/api/local-beta-shaders` que
necesita el catálogo estático.

## Reparar nombres antiguos

```bash
python3 tools/discover_public_refs.py \
  --repair-mirror web3dkit-public \
  --repair-report web3dkit-discovery.json \
  --repair-only
```

La enumeración opcional respeta `robots.txt`, se limita al mismo origen y no
intenta evadir respuestas `401` o `403`.

## Pruebas

```bash
python3 -m unittest discover -s tests -v
npm test
npm run build
npm run verify
```
