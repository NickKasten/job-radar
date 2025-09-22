# Job Radar mobile app

- Expo + React Native with bottom tab navigation
- Daily archive tab lists every scrape run; tap a date to see the captured roles for that day.
- Reads data from the Express API (`services/api`) deployed on Render
- Configure `EXPO_PUBLIC_API_URL` to point to your Render web service URL

Run locally:

```bash
npm install
npm run start --workspace apps/mobile
```
