export type RawJob = {
  title: string;
  company: string;
  location: string | null;
  remote: boolean;
  url: string;
  source: string;
  postedAt: string | null;
  metadata?: Record<string, unknown>;
};

export type NormalizedJob = RawJob & {
  scrapedForDate: string;
  tags: string[];
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
};

export type TargetCompanyConfig = {
  company: string;
  board: string;
  boardKey: string;
  category?: string;
  filters?: Record<string, unknown>;
};

export type CollectResult = {
  source: string;
  company: string;
  count: number;
  inserted: number;
  skipped: number;
};
