# Testing & QA Strategy

This project currently ships without automated tests. Use this guide to layer testing over time.

## Priorities

1. **Connector unit tests** – Ensure each job board parser handles expected payloads.
2. **API integration tests** – Verify filtering and response shapes.
3. **End-to-end smoke tests** – Validate ingestion + API + frontend wiring in a staging environment.

## Suggested tooling

- **Test runner**: Vitest or Jest (choose one and add workspace scripts).
- **Mocking HTTP**: msw (Mock Service Worker) or nock for connectors.
- **API tests**: supertest against Express.
- **Type checking**: TypeScript already enforced via `tsconfig`.

## Connector tests

1. Capture sample JSON from each board (store under `services/ingest/test-fixtures/`).
2. Write tests that feed fixtures into the connector and assert normalized output matches expectations (titles, remote flags, URLs).
3. Include negative tests for filter logic (e.g., titles missing "New Grad" should be excluded).

## API tests

- Mock Supabase client using dependency injection or a helper that stubs `supabase.from(...).select(...)`.
- Test query validation (invalid `limit`, remote flag) and success responses.
- Consider a lightweight in-memory Supabase mock (e.g., pg-mem) if you want real SQL behavior.

## End-to-end workflow

- Spin up Supabase locally (`supabase start`).
- Run ingestion (`npm run ingest:run`).
- Hit API endpoints and assert counts/data shape.
- Optionally launch Expo web and snapshot the feed.

## Continuous integration

- Add a GitHub Actions workflow that runs lint + tests on pull requests.
- For connectors hitting third-party APIs, mark tests with `@slow` and gate them behind a flag or recorded fixtures.

## Manual QA checklist

- After adding a new connector, run ingestion locally and confirm new jobs appear in the UI.
- Verify big-tech watchlist updated (if `category` is set).
- Check `/jobs/dates` lists the latest scrape.
- Confirm `daily_job_summaries` totals align with jobs ingested.

Keep this document updated with actual commands and scripts once testing infrastructure is added.
