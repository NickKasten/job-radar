# Ingestion Pipeline

The ingestion worker (`services/ingest/`) fetches new job postings, normalizes them, and persists results to Supabase. It is designed to run daily but can run ad hoc without side effects.

## Workflow summary

1. Load environment configuration via `config/env.ts` (Supabase credentials, target JSON, timezone).
2. Iterate over `TargetCompanyConfig` objects defined in `data/big-tech-targets.json` (board type, filters, metadata).
3. Use the board-specific connector to fetch raw job data:
   - `greenhouse`
   - `lever`
   - `workday`
   - `linkedin` (stub)
4. Normalize and deduplicate jobs (`utils/normalize.ts`).
5. Upsert into Supabase tables (`utils/persist.ts`).
6. Update daily summary metrics (`utils/summaries.ts`).
7. Log structured progress for observability.

## Connectors

Each connector lives in `src/connectors/` and returns an array of `RawJob` objects. They should:

- Respect the filters defined in the target config.
- Populate metadata fields when helpful (`metadata.tags`, `metadata.department`, etc.).
- Avoid hitting rate limits (consider caching or sleep if expanding).

Add new connectors by exporting a `collectFrom<Type>` function and registering it in `connectors/index.ts`.

## Normalization

- `normalizeJob` ensures titles are trimmed, URLs are canonical, tags include source/remote flags, and `scrapedForDate` is applied.
- `dedupeJobs` combines entries by `(company, url)` to prevent duplicates across connectors.

## Persistence

- `upsertJobs` writes to `scraped_jobs` with conflict resolution on `(company, url)`.
- If the target is tagged with `category`, `upsertBigTechOpenings` mirrors the job into `big_tech_openings` to power the watchlist.
- `updateDailySummary` recalculates totals for the current scrape date.

## Running locally

```bash
npm run start --workspace services/ingest
```

This command assumes you built the TypeScript output (`npm run build --workspace services/ingest`). During development you can run `npm run dev --workspace services/ingest` to execute directly with ts-node.

A smoke test (`src/smoke-test.ts`) verifies the target config loads correctly.

## Dagger integration

See `dagger/src/index.ts`. The pipeline:

1. Copies repo into the container.
2. Runs `npm install --ignore-scripts`.
3. Builds the ingest worker.
4. Executes the compiled script.

Pass environment variables to Dagger (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TARGET_COMPANY_CONFIG`, `DEFAULT_TIMEZONE`).

## Configuration (`data/big-tech-targets.json`)

Each entry defines:

```json
{
  "company": "Stripe",
  "board": "greenhouse",
  "boardKey": "stripe",
  "category": "Fintech",
  "filters": {
    "titleIncludes": ["Software Engineer", "New Grad"],
    "employmentType": ["Full-time"]
  }
}
```

- `board` selects the connector.
- `filters` pass through to the connector (see connector files for supported keys).
- `category` is optional; when present the job is surfaced in the big-tech watchlist.

## Operational notes

- Re-running ingestion on the same day is safe (idempotent upserts).
- Monitor logs for `Failed to ingest company` messages to detect connector breakage.
- When adding new boards, consider writing unit tests with recorded fixtures (see `docs/testing.md`).

## Compliance

- LinkedIn connector is intentionally a no-op to avoid policy violations.
- Workday payloads may differ per tenant; adjust the request body as needed.
- Respect robots.txt and rate limits of public feeds. Consider caching or exponential backoff if hitting errors.
