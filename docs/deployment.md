# Deployment Playbook

This guide covers deploying Job Radar to Render and alternative hosting options.

## Render setup

### 1. Supabase
- Create a Supabase project.
- Run the migration:
  ```bash
  supabase db push
  ```
- Note the `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (store securely).

### 2. Render services

Use `render.yaml` as a starting point. It defines three services:

1. **Static site (`job-radar-web`)**
   - Build command: `npm install && npm run web --workspace apps/mobile -- --clear`
   - Publish directory: `apps/mobile/dist`
   - Set `EXPO_PUBLIC_API_URL` to the API host URL.

2. **Web service (`job-radar-api`)**
   - Build command: `npm install && npm run build:api`
   - Start command: `npm run start:api`
   - Environment vars: `NODE_VERSION=20`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ALLOWED_ORIGINS` (include the static site URL).

3. **Cron job (`job-radar-ingest`)**
   - Schedule: `0 13 * * *` (daily 13:00 UTC).
   - Build command: `npm install && npm run build --workspace services/ingest`
   - Start command: `node services/ingest/dist/index.js`
   - Environment vars: same Supabase secrets, plus `TARGET_COMPANY_CONFIG`, `DEFAULT_TIMEZONE`.

Deploy the cron job last to avoid triggering ingestion before Supabase is populated.

### Switching cron to Dagger

If you prefer the Dagger pipeline:

```yaml
startCommand: dagger run npm run dagger:dev
```

Provide the same environment variables. Ensure Dagger CLI can be downloaded (Render allows outbound network during builds).

## Alternative hosting

### API & Ingestion on Fly.io / Heroku

- Package the services with Docker. Use multi-stage builds to share dependencies.
- For ingestion, schedule via platform-specific cron (Fly Machines, Heroku Scheduler).

### Expo Web on Vercel

- Build the static bundle locally or in CI.
- Upload `apps/mobile/dist` to Vercel.
- Configure `EXPO_PUBLIC_API_URL` as an environment variable in the build command.

## CI/CD suggestions

- Trigger ingestion manually via GitHub Actions using the Dagger pipeline after merging to main.
- Run lint/tests (`npm run lint --workspace`) before deployment.
- Use Render Deploy Hooks to rebuild the API/static site on new commits.

## Secrets management

- Store Supabase credentials in platform-specific secret stores.
- Rotate keys periodically; update the cron job, API, and Dagger agents simultaneously.
- Never expose the service role key in client-side code.

## Post-deploy checklist

1. Check `/health` on the API.
2. Run a manual ingestion (`dagger run npm run dagger:dev`) and confirm Supabase tables updated.
3. Load the web app and verify data appears for the last ingest date.
4. Review Render logs for errors.

Refer to `docs/operations.md` for ongoing maintenance tasks.
