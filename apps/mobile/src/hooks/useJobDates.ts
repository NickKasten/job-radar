import { useCallback, useEffect, useState } from "react";
import { api } from "@/api/client";

type State = {
  dates: string[];
  loading: boolean;
  error: string | null;
};

export const useJobDates = () => {
  const [state, setState] = useState<State>({ dates: [], loading: true, error: null });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await api.getJobDates();
      setState({ dates: response.dates, loading: false, error: null });
    } catch (error) {
      setState({ dates: [], loading: false, error: error instanceof Error ? error.message : String(error) });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
};
