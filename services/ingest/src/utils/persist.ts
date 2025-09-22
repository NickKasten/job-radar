import type { SupabaseClient } from "@supabase/supabase-js";
import type { NormalizedJob } from "../types/jobs.js";

const JOBS_TABLE = "scraped_jobs";
const BIG_TECH_TABLE = "big_tech_openings";

export const upsertJobs = async (client: SupabaseClient, jobs: NormalizedJob[]) => {
  if (jobs.length === 0) return { inserted: 0, skipped: 0 };

  const payload = jobs.map((job) => ({
    title: job.title,
    company: job.company,
    location: job.location,
    remote: job.remote,
    url: job.url,
    source: job.source,
    tags: job.tags,
    salary_min: job.salaryMin ?? null,
    salary_max: job.salaryMax ?? null,
    salary_currency: job.salaryCurrency ?? null,
    scraped_for_date: job.scrapedForDate,
    posted_at: job.postedAt,
    metadata: job.metadata ?? {},
  }));

  const { error, data } = await client
    .from(JOBS_TABLE)
    .upsert(payload, { onConflict: "company,url" })
    .select();

  if (error) {
    throw error;
  }

  return {
    inserted: data?.length ?? 0,
    skipped: jobs.length - (data?.length ?? 0),
  };
};

export const upsertBigTechOpenings = async (client: SupabaseClient, jobs: NormalizedJob[], category?: string) => {
  if (jobs.length === 0) return { inserted: 0 };

  const payload = jobs.map((job) => ({
    company: job.company,
    role: job.title,
    location: job.location,
    url: job.url,
    source: job.source,
    category: category ?? null,
    tags: job.tags,
    updated_at: new Date().toISOString(),
  }));

  const { error, data } = await client
    .from(BIG_TECH_TABLE)
    .upsert(payload, { onConflict: "company,url" })
    .select();

  if (error) {
    throw error;
  }

  return {
    inserted: data?.length ?? 0,
  };
};
