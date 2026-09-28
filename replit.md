# RMS Rulmak Kurumsal ve B2B Platformu

RMS Rulmak için teknik ürün kataloğu, kurumsal içerik ve B2B müşteri ilişkilerini bir araya getiren web platformu.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/rms-rulmak-platform` — public corporate site, catalog, B2B and admin UI
- `artifacts/api-server` — Express API for catalog and inquiry submissions
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/index.ts` — Drizzle database schema
- `artifacts/rms-rulmak-platform/src/index.css` — RMS design tokens and global styles
- `artifacts/rms-rulmak-platform/public/brand` — local RMS logo and icon assets

## Architecture decisions

- The public product experience is a technical catalog and inquiry flow, not an ecommerce checkout.
- Product, category, brand, dashboard, contact and product-request data are served through the shared OpenAPI-first API.
- RMS brand assets are stored locally and reused for light, dark and compact contexts instead of remote hotlinks.
- B2B and admin surfaces are part of the same frontend route tree so the first build can share authentication and navigation patterns.

## Product

- Corporate homepage and company information
- Searchable product catalog with technical product detail pages
- Brand, category and sector discovery
- Contact and product information request forms
- B2B login, registration and dashboard shells
- Admin dashboard shell for the next CRUD/auth phase

## User preferences

- Use RMS Rulmak supplied logo and favicon assets without redesigning them.
- Keep all visible copy in Turkish.
- Do not add ecommerce checkout, cart, payment or online-order behavior.

## Gotchas

- The API server is mounted behind `/api`; use the shared proxy rather than direct service ports.
- Run API codegen after changing `lib/api-spec/openapi.yaml`.
- The frontend requires workflow-provided `PORT` and `BASE_PATH` values.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
