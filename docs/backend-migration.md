# Migración del backend de Web3DKit

## Alcance

El backend local conserva los contratos que consume el bundle actual:

- Auth: OTP, verificación, Google OAuth, enlace de identidad, sesión, refresh y logout.
- RPC: `get_my_entitlement`, `get_catalog_popularity`, `get_shader_metrics`.
- Functions: recuperación de compras, checkout, portal, estado de checkout,
  feedback, métricas y pases DesignCode.
- MCP HTTP propio en `/api/mcp`: inicialización, listado y ejecución de
  `search_catalog`, `get_catalog_item`, `get_item_source` y `get_item_prompt`.
- Medios: previews y thumbnails se resuelven desde las copias locales; no se
  consulta el storage del proveedor anterior.

No se importan sesiones ni refresh tokens del proveedor anterior. Cada usuario
debe autenticarse nuevamente; sus identificadores, correo, identidad Google y
entitlements sí se conservan.

## Formato de importación

```json
{
  "users": [
    {
      "id": "uuid-estable",
      "email": "user@example.com",
      "email_confirmed_at": "2026-01-01T00:00:00.000Z",
      "google_sub": "identificador-google-opcional",
      "is_anonymous": false,
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "entitlements": [
    {
      "user_id": "uuid-estable",
      "plan": "yearly",
      "status": "active",
      "expires_at": "2027-01-01T00:00:00.000Z",
      "stripe_customer_id": "cus_..."
    }
  ],
  "purchases": [
    {
      "id": "purchase-id",
      "billing_email": "user@example.com",
      "plan": "lifetime",
      "status": "active",
      "expires_at": null,
      "stripe_customer_id": "cus_...",
      "claimed_user_id": "uuid-estable"
    }
  ],
  "metrics": [
    { "shader_id": "orbital-dust", "views": 120, "copies": 8 }
  ],
  "designcode_passes": [
    {
      "token": "token-original",
      "expires_at": "2027-01-01T00:00:00.000Z",
      "redeemed_by": null
    }
  ]
}
```

El importador es idempotente: actualiza por `id`, `user_id`, `shader_id` o hash
del token. Usa el mismo `AUTH_JWT_SECRET` del servidor para almacenar los pases
como hashes.

## Configuración externa

Google OAuth requiere un cliente propio y este callback autorizado:

```text
https://tu-dominio/api/backend/auth/google/callback
```

El correo se entrega mediante `EMAIL_WEBHOOK_URL`. El webhook recibe un POST
JSON con `to`, `code`, `purpose` y `product`, autorizado opcionalmente con
`EMAIL_WEBHOOK_TOKEN`.

Stripe requiere las variables de `.env.example` y debe enviar eventos a:

```text
https://tu-dominio/api/backend/webhooks/stripe
```

Eventos procesados: `checkout.session.completed`,
`customer.subscription.updated` y `customer.subscription.deleted`.

El cliente MCP se configura con:

```text
https://tu-dominio/api/mcp
```
