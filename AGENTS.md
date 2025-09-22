# Automation & Agent Playbook

This document explains how CI/CD pipelines, cron jobs, and other automation agents should interact with Job Radar. Follow these steps to ensure ingestion stays compliant and reliable.

## Required environment

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL (service role access required) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key used for upserts |
| `TARGET_COMPANY_CONFIG` | Path to the JSON file describing boards to monitor (default `data/big-tech-targets.json`) |
| `DEFAULT_TIMEZONE` | Time zone identifier for scheduling/summary purposes (default `UTC`) |

Make sure secrets are injected securely (Render secrets manager, GitHub Actions secrets, etc.). Never commit real keys.

## Dagger ingestion pipeline

Use Dagger for deterministic ingestion runs:

```bash
dagger run npm run dagger:dev
```

Steps performed:
1. Spin up a `node:20-bookworm` container.
2. Sync the repository (excluding `node_modules`, `dist`, etc.).
3. Install workspace dependencies (`npm install --ignore-scripts`).
4. Build `services/ingest`.
5. Execute `node services/ingest/dist/index.js`.

### CI example (GitHub Actions)

```yaml
- uses: dagger/dagger-for-github@v5
  with:
    cmds: dagger run npm run dagger:dev
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
    TARGET_COMPANY_CONFIG: data/big-tech-targets.json
```

If the workflow needs to branch the configuration (e.g., staging vs production), override `TARGET_COMPANY_CONFIG` with an alternate JSON file.

## Render cron job

When using Render, the cron job defined in `render.yaml` runs daily at 13:00 UTC:

```yaml
buildCommand: npm install && npm run build --workspace services/ingest
startCommand: node services/ingest/dist/index.js
```

To switch that cron job to the Dagger pipeline, update the command to:

```yaml
startCommand: dagger run npm run dagger:dev
```

and ensure the environment includes the same secrets. Dagger will download its CLI the first time; cache the binary if possible for faster cold starts.

## Operational guardrails

- **LinkedIn policy**: the `linkedin` connector is a stub. Do not attempt scraping. Integrate only with approved Partner/Talent Solutions feeds.
- **Idempotency**: ingestion uses Supabase `upsert` keyed on `company + url`. Re-running a job on the same day is safe.
- **Rate limiting**: connectors make unauthenticated GET/POST requests. Schedule at most once per day unless you throttle further.
- **Monitoring**: capture stdout/stderr from ingestion runs. A successful run logs `"Ingestion complete"`. Alert on non-zero exits or missing completions.

## Manual run checklist

1. Ensure Supabase credentials are valid.
2. Run `npm install` (if dependencies changed) and `npm run build --workspace services/ingest`.
3. Execute `node services/ingest/dist/index.js`.
4. Verify Supabase tables (`scraped_jobs`, `daily_job_summaries`, `big_tech_openings`) received new rows.

## Updating targets

Edit `data/big-tech-targets.json` to add or adjust companies. After committing changes, agents automatically pick them up (the JSON file is shipped with the repo). Consider validating JSON structure in CI by running:

```bash
jq empty data/big-tech-targets.json
```

## Incident response

If ingestion fails repeatedly:

1. Review logs for the failing connector.
2. Pause scheduled runs if the failure is due to an external rate limit or policy change.
3. Patch or disable the problematic connector (set `board` to `manual` to skip).
4. Manually ingest once issue is resolved; confirm daily summary table updates.

Keep this playbook up to date whenever you change automation behavior, schedules, or infrastructure.
