import type { SupabaseClient } from "@supabase/supabase-js";

const SUMMARIES_TABLE = "daily_job_summaries";

export const updateDailySummary = async (
  client: SupabaseClient,
  scrapeDate: string,
  stats: { totalJobs: number; remoteRoles: number; companies: Set<string> },
) => {
  const { error } = await client.from(SUMMARIES_TABLE).upsert(
    {
      date: scrapeDate,
      total_jobs: stats.totalJobs,
      remote_roles: stats.remoteRoles,
      new_companies: stats.companies.size,
      computed_at: new Date().toISOString(),
    },
    { onConflict: "date" },
  );

  if (error) {
    throw error;
  }
};
