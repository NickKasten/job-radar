import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import dotenv from "dotenv";
import { z } from "zod";
import type { TargetCompanyConfig } from "../types/jobs.js";

dotenv.config();

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  TARGET_COMPANY_CONFIG: z.string().default("../../data/big-tech-targets.json"),
  DEFAULT_TIMEZONE: z.string().default("UTC"),
});

export type EnvConfig = z.infer<typeof envSchema> & {
  targets: TargetCompanyConfig[];
};

let configPromise: Promise<EnvConfig> | null = null;

export const loadEnvConfig = async (): Promise<EnvConfig> => {
  if (!configPromise) {
    configPromise = (async () => {
      const parsed = envSchema.safeParse(process.env);
      if (!parsed.success) {
        throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
      }

      const configPath = resolve(process.cwd(), parsed.data.TARGET_COMPANY_CONFIG);
      const file = await readFile(configPath, "utf-8");
      const targets = JSON.parse(file) as TargetCompanyConfig[];

      return {
        ...parsed.data,
        targets,
      } satisfies EnvConfig;
    })();
  }
  return configPromise;
};
