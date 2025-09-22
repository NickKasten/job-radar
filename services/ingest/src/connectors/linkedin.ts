import type { TargetCompanyConfig, RawJob } from "../types/jobs.js";

/**
 * LinkedIn explicitly prohibits scraping. This connector is a placeholder to demonstrate
 * where you would integrate with an approved LinkedIn Talent Solutions partner API or
 * internal export feed. Replace this implementation with a compliant integration.
 */
export const collectFromLinkedIn = async (_target: TargetCompanyConfig): Promise<RawJob[]> => {
  return [];
};
