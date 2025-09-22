import { useCallback, useEffect, useState } from "react";
import { api, type BigTechOpeningResponse } from "@/api/client";

type State = {
  openings: BigTechOpeningResponse[];
  loading: boolean;
  error: string | null;
};

export const useBigTechOpenings = () => {
  const [state, setState] = useState<State>({ openings: [], loading: true, error: null });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await api.getBigTechOpenings();
      setState({ openings: response.openings, loading: false, error: null });
    } catch (error) {
      setState({ openings: [], loading: false, error: error instanceof Error ? error.message : String(error) });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
};
