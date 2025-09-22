import dotenv from "dotenv";

dotenv.config();

type Config = {
  port: number;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  allowedOrigins: string[];
};

const ensure = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable expected to be a number but received '${value}'`);
  }
  return parsed;
};

const config: Config = {
  port: parseNumber(process.env.PORT, 8080),
  supabaseUrl: ensure(process.env.SUPABASE_URL, "SUPABASE_URL"),
  supabaseServiceRoleKey: ensure(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY"),
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export default config;
