import { createClient } from "@supabase/supabase-js";
import type { EnvConfig } from "../config/env.js";

export const createSupabaseClient = (config: EnvConfig) =>
  createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
