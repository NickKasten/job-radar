export type JobSource = "greenhouse" | "lever" | "ashby" | "workday" | "linkedin" | "manual" | string;

export type JobRecord = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  remote: boolean;
  url: string;
  source: JobSource;
  tags: string[];
  scrapedForDate: string;
  postedAt: string | null;
  createdAt: string;
  updatedAt: string;
  salaryRange: {
    min: number | null;
    max: number | null;
    currency: string | null;
  } | null;
};

export type DailySummary = {
  date: string;
  totalJobs: number;
  newCompanies: number;
  remoteRoles: number;
};

export type BigTechOpening = {
  company: string;
  role: string;
  location: string | null;
  url: string;
  source: JobSource;
  updatedAt: string;
  category: string | null;
};
