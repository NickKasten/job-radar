# Supabase schema

Run migrations with the Supabase CLI:

```bash
supabase db push
```

Tables created:

- `scraped_jobs`: all normalized jobs scraped each day.
- `daily_job_summaries`: aggregate metrics for dashboard views.
- `big_tech_openings`: curated list of openings from large companies.

Triggers ensure `updated_at` stays fresh on updates.
