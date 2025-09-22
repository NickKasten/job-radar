# Onboarding Checklist

Use this checklist to bring new developers or operators up to speed quickly.

## Accounts & access

- [ ] Supabase project access (dashboard + service role key)
- [ ] Render account (or alternative hosting) with appropriate permissions
- [ ] GitHub repository access
- [ ] Secrets manager access (Render secrets, GitHub Actions secrets, etc.)

## Local environment

- [ ] Install Node.js 20+
- [ ] Install npm (comes with Node) and Supabase CLI (`npm install -g supabase`)
- [ ] Clone repo & run `npm install`
- [ ] Copy `.env.example` files to `.env` and populate Supabase credentials
- [ ] Run `supabase db push` to sync schema locally
- [ ] Start API (`npm run dev:api`) and Expo app (`npm run start --workspace apps/mobile`)
- [ ] Execute ingestion (`npm run ingest:run`) and confirm data appears in the UI

## Documentation tour

- [ ] Read `README.md` for overview and quick-start
- [ ] Review `docs/architecture.md` to understand flow
- [ ] Skim `docs/frontend.md`, `docs/backend.md`, `docs/ingestion.md`
- [ ] Review `AGENTS.md` for automation guidelines if handling deployments or CI

## Tooling

- [ ] Install Expo Go (mobile) or set up iOS/Android simulators if needed
- [ ] Configure linting/formatting in your editor (ESLint, TypeScript)
- [ ] Optional: install Dagger CLI for local pipeline runs (`brew install dagger` or follow official docs)

## First tasks

- [ ] Run smoke tests (`npm run test --workspace services/ingest` once tests exist)
- [ ] Add yourself to CODEOWNERS / review rotation if applicable
- [ ] Pair with an existing maintainer on an ingestion run or deployment

## Knowledge transfer

- [ ] Understand compliance constraints (no unapproved LinkedIn scraping)
- [ ] Know where to update target company configs (`data/big-tech-targets.json`)
- [ ] Review monitoring/alerting setup (`docs/operations.md`)

Keep this checklist up to date. When onboarding someone new, duplicate the checklist and track progress in your project management tool.
