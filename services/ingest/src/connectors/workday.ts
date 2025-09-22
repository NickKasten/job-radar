import type { TargetCompanyConfig, RawJob } from "../types/jobs.js";

/**
 * Workday exposes a public job feed JSON endpoint per tenant under /wday/cxs.
 * The exact schema varies slightly per company. This connector implements a light-weight
 * fetcher that targets the common v1 API. You may need to adjust the request payloads
 * per company if they deviate from the defaults.
 */

const DEFAULT_BODY = {
  appliedFacets: {
    "jobFamily": [],
    "locationCountry": [],
    "jobSubFamily": [],
  },
  limit: 50,
  offset: 0,
  searchText: "",
};

type WorkdayJob = {
  jobPostingInfo: {
    title: string;
    city?: string;
    country?: string;
    state?: string;
    jobDescription: string;
    formattedPostingDate: string;
    jobPostingId: string;
    externalUrl: string;
  };
};

const workdayUrl = (boardKey: string) =>
  `https://wd5.myworkdayjobs.com/wday/cxs/${boardKey}/External/jobs`;

const locationFromJob = (job: WorkdayJob): string | null => {
  const { city, state, country } = job.jobPostingInfo;
  const parts = [city, state, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
};

const fetchWorkdayJobs = async (target: TargetCompanyConfig): Promise<WorkdayJob[]> => {
  const response = await fetch(workdayUrl(target.boardKey), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...DEFAULT_BODY,
      searchText: (target.filters?.keywords as string[] | undefined)?.join(" ") ?? "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Workday request failed: ${response.status}`);
  }

  const data = (await response.json()) as { jobPostings: WorkdayJob[] };
  return data.jobPostings ?? [];
};

const matchesFilters = (job: WorkdayJob, filters?: Record<string, unknown>) => {
  if (!filters) return true;
  const titleIncludes = (filters.titleIncludes as string[] | undefined) ?? [];
  if (titleIncludes.length > 0 && !titleIncludes.some((token) => job.jobPostingInfo.title.toLowerCase().includes(token.toLowerCase()))) {
    return false;
  }
  const jobFamily = (filters.jobFamily as string[] | undefined) ?? [];
  if (jobFamily.length > 0) {
    const description = job.jobPostingInfo.jobDescription.toLowerCase();
    if (!jobFamily.some((token) => description.includes(token.toLowerCase()))) {
      return false;
    }
  }
  return true;
};

export const collectFromWorkday = async (target: TargetCompanyConfig): Promise<RawJob[]> => {
  const jobs = await fetchWorkdayJobs(target);

  return jobs
    .filter((job) => matchesFilters(job, target.filters))
    .map((job) => ({
      title: job.jobPostingInfo.title,
      company: target.company,
      location: locationFromJob(job),
      remote: /remote|anywhere/i.test(job.jobPostingInfo.jobDescription),
      url: job.jobPostingInfo.externalUrl,
      source: "workday",
      postedAt: job.jobPostingInfo.formattedPostingDate,
      metadata: {
        jobPostingId: job.jobPostingInfo.jobPostingId,
      },
    } satisfies RawJob));
};
