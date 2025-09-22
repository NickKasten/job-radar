create table if not exists public.scraped_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text,
  remote boolean default false not null,
  url text not null,
  source text not null,
  tags text[] default array[]::text[],
  salary_min numeric,
  salary_max numeric,
  salary_currency text,
  scraped_for_date date not null,
  posted_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null,
  constraint scraped_jobs_unique_company_url unique (company, url)
);

create index if not exists idx_scraped_jobs_date on public.scraped_jobs (scraped_for_date desc);
create index if not exists idx_scraped_jobs_source on public.scraped_jobs (source);
create index if not exists idx_scraped_jobs_company on public.scraped_jobs (company);

create table if not exists public.daily_job_summaries (
  date date primary key,
  total_jobs integer not null,
  new_companies integer not null,
  remote_roles integer not null,
  computed_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.big_tech_openings (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  url text not null,
  source text not null,
  category text,
  tags text[] default array[]::text[],
  updated_at timestamptz default timezone('utc', now()) not null,
  created_at timestamptz default timezone('utc', now()) not null,
  constraint big_tech_openings_unique_company_url unique (company, url)
);

create index if not exists idx_big_tech_company on public.big_tech_openings (company);
create index if not exists idx_big_tech_category on public.big_tech_openings (category);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger trg_scraped_jobs_updated
before update on public.scraped_jobs
for each row
execute function public.touch_updated_at();

create trigger trg_big_tech_openings_updated
before update on public.big_tech_openings
for each row
execute function public.touch_updated_at();
