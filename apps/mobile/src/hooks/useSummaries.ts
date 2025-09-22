import { useCallback, useEffect, useState } from "react";
import { api, type SummaryResponse } from "@/api/client";

type State = {
  summaries: SummaryResponse[];
  loading: boolean;
  error: string | null;
};

export const useSummaries = () => {
  const [state, setState] = useState<State>({ summaries: [], loading: true, error: null });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await api.getSummaries();
      setState({ summaries: response.summaries, loading: false, error: null });
    } catch (error) {
      setState({ summaries: [], loading: false, error: error instanceof Error ? error.message : String(error) });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
};
