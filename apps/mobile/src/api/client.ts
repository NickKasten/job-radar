import Constants from "expo-constants";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const API_URL = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ?? "http://localhost:8080";

const request = async <T>(path: string, method: HttpMethod = "GET", init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
};

export const api = {
  getJobs: (params?: { date?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.date) query.append("date", params.date);
    if (params?.limit) query.append("limit", String(params.limit));
    const qs = query.toString();
    return request<{ jobs: JobResponse[] }>(`/jobs${qs ? `?${qs}` : ""}`);
  },
  getSummaries: () => request<{ summaries: SummaryResponse[] }>("/jobs/summaries"),
  getBigTechOpenings: () => request<{ openings: BigTechOpeningResponse[] }>("/jobs/big-tech"),
  getJobDates: () => request<{ dates: string[] }>("/jobs/dates"),
};

export type JobResponse = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  remote: boolean;
  url: string;
  source: string;
  tags: string[];
  scrapedForDate: string;
  postedAt: string | null;
  salaryRange?: {
    min: number | null;
    max: number | null;
    currency: string | null;
  } | null;
};

export type SummaryResponse = {
  date: string;
  totalJobs: number;
  newCompanies: number;
  remoteRoles: number;
};

export type BigTechOpeningResponse = {
  company: string;
  role: string;
  location: string | null;
  url: string;
  source: string;
  updatedAt: string;
  category: string | null;
};
