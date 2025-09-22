import { supabase } from "../supabase.js";
import type { BigTechOpening, DailySummary, JobRecord } from "../types/job.js";
import logger from "../logger.js";

const JOBS_TABLE = "scraped_jobs";
const SUMMARIES_TABLE = "daily_job_summaries";
const BIG_TECH_TABLE = "big_tech_openings";

export type ListJobsParams = {
  date?: string;
  source?: string;
  company?: string;
  remote?: boolean;
  limit?: number;
};

export const listJobs = async (params: ListJobsParams): Promise<JobRecord[]> => {
  let query = supabase
    .from(JOBS_TABLE)
    .select(
      "id, title, company, location, remote, url, source, tags, scraped_for_date, posted_at, created_at, updated_at, salary_min, salary_max, salary_currency",
    )
    .order("posted_at", { ascending: false, nullsLast: true })
    .order("created_at", { ascending: false });

  if (params.date) {
    query = query.eq("scraped_for_date", params.date);
  }
  if (params.source) {
    query = query.eq("source", params.source);
  }
  if (params.company) {
    query = query.ilike("company", `%${params.company}%`);
  }
  if (typeof params.remote === "boolean") {
    query = query.eq("remote", params.remote);
  }
  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) {
    logger.error({ error }, "Failed to fetch jobs from Supabase");
    throw new Error("Unable to load jobs");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    remote: row.remote,
    url: row.url,
    source: row.source,
    tags: row.tags ?? [],
    scrapedForDate: row.scraped_for_date,
    postedAt: row.posted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    salaryRange: row.salary_currency
      ? {
          min: row.salary_min,
          max: row.salary_max,
          currency: row.salary_currency,
        }
      : null,
  } satisfies JobRecord));
};

export const listSummaries = async (): Promise<DailySummary[]> => {
  const { data, error } = await supabase
    .from(SUMMARIES_TABLE)
    .select("date, total_jobs, new_companies, remote_roles")
    .order("date", { ascending: false });

  if (error) {
    logger.error({ error }, "Failed to fetch summaries");
    throw new Error("Unable to load summaries");
  }

  return (data ?? []).map((row) => ({
    date: row.date,
    totalJobs: row.total_jobs,
    newCompanies: row.new_companies,
    remoteRoles: row.remote_roles,
  } satisfies DailySummary));
};

export const listBigTechOpenings = async (category?: string): Promise<BigTechOpening[]> => {
  let query = supabase
    .from(BIG_TECH_TABLE)
    .select("company, role, location, url, source, updated_at, category")
    .order("company", { ascending: true })
    .order("updated_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    logger.error({ error }, "Failed to fetch big tech openings");
    throw new Error("Unable to load big tech openings");
  }

  return (data ?? []).map((row) => ({
    company: row.company,
    role: row.role,
    location: row.location,
    url: row.url,
    source: row.source,
    updatedAt: row.updated_at,
    category: row.category,
  } satisfies BigTechOpening));
};

export const listAvailableDates = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from(JOBS_TABLE)
    .select("scraped_for_date", { distinct: true })
    .order("scraped_for_date", { ascending: false });

  if (error) {
    logger.error({ error }, "Failed to fetch job dates");
    throw new Error("Unable to load job dates");
  }

  return (data ?? [])
    .map((row) => row.scraped_for_date as string)
    .filter((value): value is string => Boolean(value));
};
