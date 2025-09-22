import type { TargetCompanyConfig, RawJob } from "../types/jobs.js";

const LEVER_API = "https://api.lever.co/v0/postings";

type LeverJob = {
  id: string;
  text: string;
  hostedUrl: string;
  categories: {
    commitment?: string;
    location?: string;
    team?: string;
  };
  createdAt: number;
  updatedAt: number;
  tags?: string[];
};

const fetchLeverJobs = async (boardKey: string): Promise<LeverJob[]> => {
  const response = await fetch(`${LEVER_API}/${boardKey}?mode=json`);
  if (!response.ok) {
    throw new Error(`Lever request failed: ${response.status}`);
  }
  const data = (await response.json()) as LeverJob[];
  return data ?? [];
};

const matchesFilters = (job: LeverJob, filters?: Record<string, unknown>): boolean => {
  if (!filters) return true;
  const titleIncludes = (filters.titleIncludes as string[] | undefined) ?? [];
  if (titleIncludes.length > 0 && !titleIncludes.some((token) => job.text.toLowerCase().includes(token.toLowerCase()))) {
    return false;
  }
  const employmentType = (filters.employmentType as string[] | undefined) ?? [];
  if (employmentType.length > 0) {
    const commitment = job.categories.commitment ?? "";
    if (!employmentType.some((token) => commitment.toLowerCase().includes(token.toLowerCase()))) {
      return false;
    }
  }
  const locationFilters = (filters.locations as string[] | undefined) ?? [];
  if (locationFilters.length > 0) {
    const location = job.categories.location ?? "";
    if (!locationFilters.some((token) => location.toLowerCase().includes(token.toLowerCase()))) {
      return false;
    }
  }
  const tagFilters = (filters.tags as string[] | undefined) ?? [];
  if (tagFilters.length > 0) {
    const tags = job.tags ?? [];
    if (!tagFilters.some((tag) => tags.map((value) => value.toLowerCase()).includes(tag.toLowerCase()))) {
      return false;
    }
  }
  return true;
};

export const collectFromLever = async (target: TargetCompanyConfig): Promise<RawJob[]> => {
  const jobs = await fetchLeverJobs(target.boardKey);

  return jobs
    .filter((job) => matchesFilters(job, target.filters))
    .map((job) => ({
      title: job.text,
      company: target.company,
      location: job.categories.location ?? null,
      remote: /remote/i.test(job.categories.location ?? ""),
      url: job.hostedUrl,
      source: "lever",
      postedAt: new Date(job.createdAt).toISOString(),
      metadata: {
        tags: job.tags ?? [],
        commitment: job.categories.commitment,
        updatedAt: new Date(job.updatedAt).toISOString(),
      },
    } satisfies RawJob));
};
