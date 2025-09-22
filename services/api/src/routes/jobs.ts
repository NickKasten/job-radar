import type { Request, Response } from "express";
import { jobQuerySchema, bigTechQuerySchema } from "../schemas.js";
import { listJobs, listSummaries, listBigTechOpenings, listAvailableDates } from "../services/jobsService.js";
import logger from "../logger.js";

export const getJobsHandler = async (req: Request, res: Response) => {
  const parseResult = jobQuerySchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() });
  }

  try {
    const jobs = await listJobs(parseResult.data);
    return res.json({ jobs });
  } catch (error) {
    logger.error({ error }, "getJobsHandler failed");
    return res.status(500).json({ message: "Failed to load jobs" });
  }
};

export const getSummariesHandler = async (_req: Request, res: Response) => {
  try {
    const summaries = await listSummaries();
    return res.json({ summaries });
  } catch (error) {
    logger.error({ error }, "getSummariesHandler failed");
    return res.status(500).json({ message: "Failed to load summaries" });
  }
};

export const getBigTechHandler = async (req: Request, res: Response) => {
  const parseResult = bigTechQuerySchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ errors: parseResult.error.flatten() });
  }

  try {
    const openings = await listBigTechOpenings(parseResult.data.category);
    return res.json({ openings });
  } catch (error) {
    logger.error({ error }, "getBigTechHandler failed");
    return res.status(500).json({ message: "Failed to load big tech openings" });
  }
};

export const getJobDatesHandler = async (_req: Request, res: Response) => {
  try {
    const dates = await listAvailableDates();
    return res.json({ dates });
  } catch (error) {
    logger.error({ error }, "getJobDatesHandler failed");
    return res.status(500).json({ message: "Failed to load job dates" });
  }
};
