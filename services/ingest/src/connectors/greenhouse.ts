import type { TargetCompanyConfig, RawJob } from "../types/jobs.js";

const GREENHOUSE_API = "https://boards.greenhouse.io/v1/boards";

type GreenhouseJob = {
  id: number;
  title: string;
  content: string;
  absolute_url: string;
  location?: { name: string };
  metadata?: Array<{ name: string; value: string }>;
  updated_at: string;
  created_at: string;
  departments?: Array<{ name: string }>;
  office?: { name: string };
};

const fetchBoardJobs = async (boardKey: string): Promise<GreenhouseJob[]> => {
  const response = await fetch(`${GREENHOUSE_API}/${boardKey}/jobs?content=true`);
  if (!response.ok) {
    throw new Error(`Greenhouse request failed: ${response.status}`);
  }
  const data = (await response.json()) as { jobs: GreenhouseJob[] };
  return data.jobs ?? [];
};

const matchesFilters = (job: GreenhouseJob, filters?: Record<string, unknown>): boolean => {
  if (!filters) return true;
  const titleIncludes = (filters.titleIncludes as string[] | undefined) ?? [];
  if (titleIncludes.length > 0 && !titleIncludes.some((token) => job.title.toLowerCase().includes(token.toLowerCase()))) {
    return false;
  }
  const locations = (filters.locations as string[] | undefined) ?? [];
  const locationName = job.location?.name ?? job.office?.name ?? "";
  if (locations.length > 0 && !locations.some((token) => locationName.toLowerCase().includes(token.toLowerCase()))) {
    return false;
  }
  const tags = (filters.tags as string[] | undefined) ?? [];
  if (tags.length > 0) {
    const metaValues = job.metadata?.map((item) => item.value.toLowerCase()) ?? [];
    if (!tags.some((tag) => metaValues.includes(tag.toLowerCase()))) {
      return false;
    }
  }
  return true;
};

export const collectFromGreenhouse = async (target: TargetCompanyConfig): Promise<RawJob[]> => {
  const jobs = await fetchBoardJobs(target.boardKey);

  return jobs
    .filter((job) => matchesFilters(job, target.filters))
    .map((job) => ({
      title: job.title,
      company: target.company,
      location: job.location?.name ?? job.office?.name ?? null,
      remote: /remote/i.test(job.location?.name ?? ""),
      url: job.absolute_url,
      source: "greenhouse",
      postedAt: job.created_at,
      metadata: {
        department: job.departments?.map((dept) => dept.name),
        updatedAt: job.updated_at,
        greenhouseId: job.id,
      },
    } satisfies RawJob));
};
