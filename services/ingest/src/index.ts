import { loadEnvConfig } from "./config/env.js";
import { createSupabaseClient } from "./utils/supabase.js";
import { collectJobsForTarget } from "./connectors/index.js";
import { dedupeJobs, normalizeJob } from "./utils/normalize.js";
import { logError, logInfo } from "./utils/logger.js";
import { toScrapeDateKey } from "./utils/date.js";
import { upsertBigTechOpenings, upsertJobs } from "./utils/persist.js";
import { updateDailySummary } from "./utils/summaries.js";
import type { TargetCompanyConfig } from "./types/jobs.js";

const run = async () => {
  const config = await loadEnvConfig();
  const supabase = createSupabaseClient(config);

  const todayKey = toScrapeDateKey();
  const results: Array<{ target: TargetCompanyConfig; count: number; inserted: number; skipped: number }> = [];
  const companySet = new Set<string>();
  let remoteRoles = 0;

  for (const target of config.targets) {
    try {
      const rawJobs = await collectJobsForTarget(target);
      const normalized = dedupeJobs(rawJobs.map((job) => normalizeJob(job, todayKey)));
      normalized.forEach((job) => {
        companySet.add(job.company);
        if (job.remote) remoteRoles += 1;
      });

      const { inserted, skipped } = await upsertJobs(supabase, normalized);

      results.push({ target, count: normalized.length, inserted, skipped });

      if (normalized.length > 0 && target.category) {
        await upsertBigTechOpenings(supabase, normalized, target.category);
      }

      logInfo("Ingested jobs", {
        company: target.company,
        board: target.board,
        fetched: rawJobs.length,
        normalized: normalized.length,
        inserted,
        skipped,
      });
    } catch (error) {
      logError("Failed to ingest company", {
        company: target.company,
        board: target.board,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const totals = results.reduce(
    (acc, result) => ({
      fetched: acc.fetched + result.count,
      inserted: acc.inserted + result.inserted,
      skipped: acc.skipped + result.skipped,
    }),
    { fetched: 0, inserted: 0, skipped: 0 },
  );

  await updateDailySummary(supabase, todayKey, {
    totalJobs: totals.inserted,
    remoteRoles,
    companies: companySet,
  });

  logInfo("Ingestion complete", {
    totals,
    companies: companySet.size,
    remoteRoles,
  });
};

run().catch((error) => {
  logError("Fatal ingestion error", {
    error: error instanceof Error ? error.stack : String(error),
  });
  process.exitCode = 1;
});
