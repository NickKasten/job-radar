# Frontend Guide (Expo / React Native)

The mobile/web client lives in `apps/mobile/` and is built with Expo 51 + React Navigation. It targets early-career users with three primary tabs: Daily archive, Sources, and Big Tech watchlist.

## Project structure

```
apps/mobile/
├── App.tsx              # Navigation container and tab setup
├── app.config.ts        # Expo config (uses EXPO_PUBLIC_API_URL)
├── src/
│   ├── api/             # API client wrapper around the Express API
│   ├── components/      # Presentational components (cards, lists)
│   ├── hooks/           # Data-fetching hooks (jobs, summaries, dates, watchlist)
│   ├── screens/         # DailyOverview, DailyDetail, Sources, BigTech
│   └── types/           # Navigation types
└── assets/              # Placeholders for icons, splash screens
```

## Environment variables

Expo reads `EXPO_PUBLIC_API_URL` at build time. For local development, set it to `http://localhost:8080` (or your LAN IP when testing on devices).

```
EXPO_PUBLIC_API_URL=http://localhost:8080
```

## Running locally

```bash
npm run start --workspace apps/mobile
```

Pick the appropriate platform in the Expo dev tools (iOS simulator, Android emulator, or web). For the web build, `npm run web --workspace apps/mobile` outputs a static bundle under `apps/mobile/dist`.

## Data access

All network calls go through `src/api/client.ts`, which wraps `fetch` and exposes typed helpers:

- `getJobs({ date?, limit? })`
- `getSummaries()`
- `getBigTechOpenings()`
- `getJobDates()`

Hooks such as `useJobs`, `useSummaries`, and `useJobDates` compose these requests with loading/error state. Screens consume the hooks and render cards.

## Navigation

- Bottom tab navigation manages the primary tabs.
- The "Daily" tab is a native stack (`DailyStack`) with two screens:
  - `DailyOverview` – lists dates with summaries and links to detail view.
  - `DailyDetail` – renders jobs for a selected date.

Navigation types live in `src/types/navigation.ts` to keep props strongly typed.

## Styling

- Uses React Native `StyleSheet` with Tailwind-inspired color palette.
- Keep styling centralized in component files; prefer re-usable components for cards.

## Building for production

1. Generate icons and splash images under `apps/mobile/assets/`.
2. Update `app.json` metadata (name, slug, projectId).
3. For a web-only deployment (Render static site), run:
   ```bash
   npm run web --workspace apps/mobile -- --clear
   ```
   Deploy the `apps/mobile/dist` folder.

For native builds, follow Expo EAS documentation—this project is EAS-ready but does not include build profiles yet.

## Common pitfalls

- Ensure the API service is reachable from devices (adjust `EXPO_PUBLIC_API_URL` to a LAN IP).
- When adding new API endpoints, update the client typings and hooks.
- Expo caches aggressively; use `--clear` on the web build and restart Metro when introducing config changes.
