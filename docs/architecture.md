# Architecture Overview

Job Radar is organized as a small constellation of Node/TypeScript services backed by Supabase. The system is optimized for daily ingestion of public job postings and serving them via a React Native client.

## High-level flow

1. **Ingestion worker (`services/ingest`)** pulls job listings from configured boards (Greenhouse, Lever, Workday, etc.), normalizes them, and upserts into Supabase.
2. **Supabase Postgres** stores three core tables: `scraped_jobs`, `daily_job_summaries`, and `big_tech_openings`.
3. **Express API (`services/api`)** exposes REST endpoints that read from Supabase.
4. **Expo / React Native client (`apps/mobile`)** consumes the API to show daily archives, stats, and curated watchlists.
5. **Automation layer (Dagger, Render cron, CI)** schedules ingestion and keeps data fresh.

```
+----------------------+       +-------------------+       +--------------------+
|  Ingestion Worker    |  -->  |  Supabase Postgres|  -->  |  Express API       |
|  (services/ingest)   |       |  (scraped jobs)   |       |  (services/api)    |
+----------------------+       +-------------------+       +--------------------+
                                                            |
                                                            v
                                             +---------------------------+
                                             | Expo / React Native Client|
                                             | (apps/mobile)            |
                                             +---------------------------+
```

## Environments

- **Local development**: Run the ingestion worker, API, and Expo app using `npm workspaces`. Supabase can be remote or via the Supabase CLI emulator.
- **Production**: Deploy to Render (static site + web service + cron job) and host Supabase in a managed project.

## Data model summary

| Table | Purpose |
| --- | --- |
| `scraped_jobs` | Normalized job listings. Unique on `(company, url)` to avoid duplicates. |
| `daily_job_summaries` | Aggregated counts per ingestion date. |
| `big_tech_openings` | Curated watchlist for marquee companies. |

See [`supabase/migrations/0001_create_tables.sql`](../supabase/migrations/0001_create_tables.sql) for full schema details.

## Connectors

- **Greenhouse** – uses public board JSON API (`/v1/boards/<key>/jobs`).
- **Lever** – fetches from `api.lever.co/v0/postings/<key>`.
- **Workday** – posts to `wd5.myworkdayjobs.com/wday/cxs/<tenant>/External/jobs` with keyword filters.
- **LinkedIn** – intentionally a stub; integrate only through official APIs.

Connectors emit `RawJob` objects that are normalized into a unified shape before persistence.

## Key design choices

- **Supabase service role** is used server-side only (ingestion + API). The mobile app does not talk directly to Supabase.
- **Daily archive**: each ingest run stamps `scraped_for_date` so the UI can offer a calendar-like history.
- **Dagger** ensures ingestion runs in an identical environment locally, in CI, and on scheduled jobs.
- **Render** was chosen for simplicity—swap with your preferred platform by adapting deployment docs.

Refer to other documents in the `docs/` directory for deep dives on specific layers.
