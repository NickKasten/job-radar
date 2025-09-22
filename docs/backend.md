# Backend & API Guide

The REST API lives under `services/api/` and is built with Express + Supabase. It serves data to the Expo app and can be reused by other clients.

## Tech stack

- Express 4
- Supabase JavaScript client (service-role key)
- Zod for request validation
- Pino + pino-http for structured logging
- Helmet + CORS hardening

## Directory layout

```
services/api/
├── src/
│   ├── config.ts        # Env parsing + configuration
│   ├── index.ts         # Express bootstrap
│   ├── logger.ts        # Pino logger instance
│   ├── supabase.ts      # Supabase client factory
│   ├── routes/
│   │   ├── health.ts
│   │   └── jobs.ts
│   ├── schemas.ts       # Zod request shapes
│   └── services/
│       └── jobsService.ts  # Data access helpers
├── package.json
├── tsconfig.json
└── .env.example
```

## Environment variables

```
PORT=8080
SUPABASE_URL=<your supabase url>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006
```

The API only exposes read endpoints, but uses the service-role key because job ingestion happens via Supabase upserts (and you may expand to admin-only mutations later).

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Simple health check |
| GET | `/jobs` | Query job listings (filters: `date`, `source`, `company`, `remote`, `limit`) |
| GET | `/jobs/summaries` | Aggregate counts per scrape date |
| GET | `/jobs/dates` | Distinct scrape dates (descending) |
| GET | `/jobs/big-tech` | Curated big-tech openings (optional `category` filter) |

All endpoints return JSON payloads with a root object (`{ jobs }`, `{ summaries }`, etc.). Errors are logged and respond with 500 + message.

## Data access layer

`jobsService.ts` encapsulates Supabase queries. That keeps route handlers focused on validation/serialization and makes it easier to reuse the service for future cron jobs or background tasks.

## Local development

```bash
npm run dev:api
```

This launches Nodemon + ts-node with source watching. To build production output, run `npm run build:api` (writes to `dist/`).

## Deployment notes

- The API is stateless; scale horizontally if necessary.
- Set `ALLOWED_ORIGINS` to the frontend host(s) on Render.
- Logs are JSON by default; in development, pino-pretty renders them nicely.

## Extending the API

1. Add validation for new routes in `schemas.ts`.
2. Implement data access in `services/` (reuse Supabase clients).
3. Wire route handlers in `routes/` and register them in `index.ts`.
4. Update docs and front-end client as needed.

## Testing ideas

- Add integration tests that hit Supabase using a transactional test schema (see `docs/testing.md`).
- Use supertest + vitest/jest for route-level verification with mocked Supabase responses.
