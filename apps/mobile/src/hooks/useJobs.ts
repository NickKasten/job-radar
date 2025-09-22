import { useEffect, useRef, useState, useCallback } from "react";
import { api, type JobResponse } from "@/api/client";

export const useJobs = (initialDate?: string) => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate ?? null);
  const selectedDateRef = useRef<string | null>(initialDate ?? null);

  const load = useCallback(async (date?: string | null) => {
    const targetDate = date ?? selectedDateRef.current;
    setLoading(true);
    setError(null);
    try {
      const response = await api.getJobs({ date: targetDate ?? undefined, limit: 150 });
      setJobs(response.jobs);
      setSelectedDate(targetDate ?? null);
      selectedDateRef.current = targetDate ?? null;
    } catch (err) {
      setJobs([]);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    selectedDateRef.current = initialDate ?? null;
    setSelectedDate(initialDate ?? null);
    void load(initialDate ?? null);
  }, [initialDate, load]);

  return {
    jobs,
    loading,
    error,
    selectedDate,
    reload: () => void load(),
    setDate: (date: string | null) => void load(date),
  };
};
