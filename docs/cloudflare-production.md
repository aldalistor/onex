# ONEX Cloudflare production setup

## Completed

The Cloudflare account contains the `onex-production` D1 database (`72195b2f-df9e-49b0-81f5-cbf31daa829f`) in the EU jurisdiction, and the `onex-workbench` Worker has an `ONEX_DB` binding. The initial D1 schema and control data were applied idempotently and recorded in `_onex_migration_log`.

The Worker exposes `GET /__health`, which queries D1 and returns the initialized table list. It also applies baseline security headers to proxied Workbench responses.

## Reproducible deployment

From the repository root:

```bash
npx wrangler d1 migrations apply onex-production --remote --config cloudflare/wrangler.jsonc
npx wrangler deploy --config cloudflare/wrangler.jsonc
```

The Worker preview URL is `https://onex-workbench.raghabatstore.workers.dev/` and the health URL is `/__health`.

## Remaining production work

The existing Node server uses `drizzle-orm/mysql2` and therefore does not automatically use D1. The production backend must either remain on managed MySQL, or be migrated to a Workers-compatible D1 adapter. Until that adapter is implemented, D1 is provisioned and connected to the Worker layer but is not the source of truth for the Node API.

No custom Cloudflare Zone is currently present in the account. A custom domain can be added after a Zone is attached and DNS is delegated to Cloudflare.
