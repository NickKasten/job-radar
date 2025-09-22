import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Job Radar",
  slug: "job-radar",
  scheme: "jobradar",
  version: "1.0.0",
  sdkVersion: "51.0.0",
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080",
  },
};

export default config;
