# Operations & Monitoring

Use this guide to keep Job Radar healthy after deployment.

## Daily ingestion monitoring

- **Logs**: Capture stdout/stderr for the ingestion worker. Successful runs end with `"Ingestion complete"`.
- **Supabase checks**: Spot-check `scraped_jobs` for the latest `scraped_for_date`. Ensure counts increase daily.
- **Alerts**: Set up notifications if a cron job fails or misses its schedule.

## API health

- Monitor `/health` endpoint via uptime checks (Pingdom, Render Health, etc.).
- Watch HTTP error rates in Render metrics. Spikes could indicate Supabase connectivity issues.

## Supabase maintenance

- Enable row-level security only if you add public clients (currently service-only).
- Monitor database size and query performance; add indexes if new query patterns emerge.
- Rotate service role keys periodically and update all consumers (API, ingestion, Dagger).

## Updating connectors

1. Modify the relevant file in `services/ingest/src/connectors/`.
2. Run the ingestion locally to verify output.
3. Commit changes and deploy. Monitor the next cron run for success.

## Adding new targets

- Edit `data/big-tech-targets.json`.
- Validate JSON (`jq empty data/big-tech-targets.json`).
- Run ingestion locally to confirm counts.
- Deploy updated config.

## Incident response

1. **Identify scope** – Are all connectors failing or just one?
2. **Inspect logs** – Look for specific error messages (HTTP 4xx/5xx, network timeouts, JSON parse errors).
3. **Mitigate** – Disable problematic targets or connectors temporarily.
4. **Recover** – Re-run ingestion after fixes and ensure summaries update.
5. **Postmortem** – Document cause and mitigation for future reference (append to `docs/operations.md` or create a separate incident log).

## Backups & retention

- Supabase retains data; enable backups via Supabase dashboard.
- For compliance, consider exporting historical data to storage (S3, GCS) periodically.

## Performance tips

- If job volume increases, paginate API responses (`limit` parameter already supported).
- Use Supabase computed views/materialized views for heavy reporting workloads.
- Consider moving ingestion to a queue-based architecture if runs take too long.

## Security checklist

- Keep dependencies up to date (Dependabot, Renovate).
- Review connectors for PII handling (should be none).
- Ensure only trusted services hold the Supabase service key.

Keep this document updated as the system evolves (additional job boards, new alerting, etc.).
