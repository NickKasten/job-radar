import { connect } from "@dagger.io/dagger";
import dotenv from "dotenv";

dotenv.config();

const EXCLUDES = ["node_modules", "dist", ".git", "tmp", "coverage"];

const main = async () => {
  await connect(async (client) => {
    const pipeline = client.pipeline("daily-job-ingest");
    const source = client.host().directory(".", { exclude: EXCLUDES });

    const node = pipeline
      .container()
      .from("node:20-bookworm")
      .withDirectory("/usr/src", source)
      .withWorkdir("/usr/src")
      .withEnvVariable("SUPABASE_URL", process.env.SUPABASE_URL ?? "")
      .withEnvVariable("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")
      .withEnvVariable("TARGET_COMPANY_CONFIG", process.env.TARGET_COMPANY_CONFIG ?? "data/big-tech-targets.json")
      .withEnvVariable("DEFAULT_TIMEZONE", process.env.DEFAULT_TIMEZONE ?? "UTC")
      .withExec(["npm", "install", "--ignore-scripts"])
      .withExec(["npm", "run", "build", "--", "--workspace", "services/ingest"])
      .withExec([
        "node",
        "services/ingest/dist/index.js",
      ]);

    const output = await node.stdout();
    process.stdout.write(output);
  });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
