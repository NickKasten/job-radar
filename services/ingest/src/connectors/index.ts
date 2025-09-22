import { collectFromGreenhouse } from "./greenhouse.js";
import { collectFromLever } from "./lever.js";
import { collectFromWorkday } from "./workday.js";
import { collectFromLinkedIn } from "./linkedin.js";
import type { TargetCompanyConfig, RawJob } from "../types/jobs.js";

export const collectJobsForTarget = async (target: TargetCompanyConfig): Promise<RawJob[]> => {
  switch (target.board) {
    case "greenhouse":
      return collectFromGreenhouse(target);
    case "lever":
      return collectFromLever(target);
    case "workday":
      return collectFromWorkday(target);
    case "linkedin":
      return collectFromLinkedIn(target);
    default:
      return [];
  }
};
