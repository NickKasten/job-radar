import { format } from "node:util";
import type { RawJob, NormalizedJob } from "../types/jobs.js";

const normalizeTitle = (title: string): string => title.trim();

const normalizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    parsed.searchParams.sort();
    return parsed.toString();
  } catch (_error) {
    return url;
  }
};

export const normalizeJob = (job: RawJob, scrapeDate: string): NormalizedJob => ({
  ...job,
  title: normalizeTitle(job.title),
  url: normalizeUrl(job.url),
  scrapedForDate: scrapeDate,
  tags: Array.from(
    new Set([
      job.remote ? "Remote" : null,
      job.source,
      ...((job.metadata?.tags as string[] | undefined) ?? []),
    ].filter(Boolean) as string[]),
  ),
});

export const dedupeJobs = (jobs: NormalizedJob[]): NormalizedJob[] => {
  const byKey = new Map<string, NormalizedJob>();
  jobs.forEach((job) => {
    const key = format("%s::%s", job.company.toLowerCase(), job.url.toLowerCase());
    if (!byKey.has(key)) {
      byKey.set(key, job);
    }
  });
  return Array.from(byKey.values());
};
