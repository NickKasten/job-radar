# Job Radar

Job Radar is a React Native + Supabase stack that tracks new-grad and entry-level software engineer roles across public job boards and curated big-tech listings. It ships with a Render-friendly deployment model, a Dagger ingestion pipeline, and lightweight operational tooling so you can keep an always-fresh feed for students or early-career engineers.

> ⚖️ **Compliance reminder** – LinkedIn data must come from an approved Talent Solutions integration. The included LinkedIn connector is a placeholder that returns no data until you wire in a compliant source.

## Highlights

- **Daily ingestion** via Node/TypeScript worker orchestrated by Dagger and backed by Supabase Postgres.
- **Express API** that exposes normalized jobs, daily summaries, and a big-tech watchlist.
- **Expo / React Native client** for web and mobile with archive browsing, data-source explanations, and quick links to official job postings.
- **Render-first deployment** with one static site, one web service, and a cron job.

## Project layout

| Path | Purpose |
| --- | --- |
| `apps/mobile/` | Expo React Native app (web + mobile) |
| `services/api/` | Express API that the app (and others) consume |
| `services/ingest/` | Fetches jobs from Greenhouse, Lever, Workday, etc. |
| `dagger/` | Dagger pipeline that runs the ingestion worker in a reproducible container |
| `supabase/` | Database migrations and notes |
| `data/big-tech-targets.json` | List of boards + filters for companies to ingest |
| `docs/` | In-depth guides for architecture, development, deployment, and operations |
| `AGENTS.md` | Playbook for automation agents (CI, scheduled jobs, maintenance bots) |

## Quick start

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Environment variables**
   - Copy `.env.example` to `.env` in each of `services/api`, `services/ingest`, `dagger`, and `apps/mobile`.
   - Fill in `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and point `EXPO_PUBLIC_API_URL` at your local or hosted API.
3. **Apply the database schema**
   ```bash
   supabase db push
   ```
4. **Run everything locally** (in separate shells or via `npm run` scripts):
   ```bash
   npm run dev:api
   npm run start --workspace apps/mobile
   npm run ingest:run
   ```
   - Ingestor populates Supabase.
   - API reads from Supabase and serves JSON.
   - Mobile app calls the API and renders the archive + big-tech watchlist.

## Key scripts

| Script | Description |
| --- | --- |
| `npm run dev:api` | Start the Express API with hot reload |
| `npm run start --workspace services/ingest` | Run the ingestion worker (requires env vars) |
| `npm run dagger:dev` | Execute the ingestion pipeline inside Dagger |
| `npm run mobile:start` / `mobile:web` | Start Expo (native bundler or web build) |

## Deployment on Render

A starter `render.yaml` is included. It provisions:

1. **Static site** for the Expo web bundle (`apps/mobile`).
2. **Web service** for the Express API (`services/api`).
3. **Cron job** for the ingestion worker (`services/ingest`).

Copy Supabase credentials into Render environment variables, and point `EXPO_PUBLIC_API_URL` to the deployed API host. Consider swapping the cron job command with the Dagger pipeline if you want ingestion to run in a container identical to the dev setup (see `docs/deployment.md`).

## Documentation hub

- [Architecture overview](docs/architecture.md)
- [Frontend guide](docs/frontend.md)
- [Backend & API](docs/backend.md)
- [Ingestion pipeline](docs/ingestion.md)
- [Deployment playbook](docs/deployment.md)
- [Operations & monitoring](docs/operations.md)
- [Testing & QA](docs/testing.md)
- [Onboarding checklist](docs/onboarding.md)

Each guide provides deeper instructions for future maintainers and automation agents.

## Next steps

- Add authenticated saved searches and personalized notifications.
- Expand connectors with more public job boards or partner feeds.
- Layer automated tests (unit + integration) and hook them into CI.
- Instrument ingestion runs with monitoring/alerting for failures.

For detailed runbooks and automation notes, see [AGENTS.md](AGENTS.md).
