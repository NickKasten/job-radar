import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import pinoHttp from "pino-http";
import config from "./config.js";
import logger from "./logger.js";
import { healthHandler } from "./routes/health.js";
import { getJobsHandler, getSummariesHandler, getBigTechHandler, getJobDatesHandler } from "./routes/jobs.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes("*") || config.allowedOrigins.includes(origin)) {
        return callback(null, origin ?? "");
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(morgan("tiny"));
app.use(pinoHttp({ logger }));

app.get("/health", healthHandler);
app.get("/jobs", getJobsHandler);
app.get("/jobs/summaries", getSummariesHandler);
app.get("/jobs/big-tech", getBigTechHandler);
app.get("/jobs/dates", getJobDatesHandler);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ message: "Internal server error" });
});

const start = () => {
  app.listen(config.port, () => {
    logger.info(`API listening on port ${config.port}`);
  });
};

if (process.env.NODE_ENV !== "test") {
  start();
}

export default app;
