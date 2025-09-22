import { loadEnvConfig } from "./config/env.js";

const main = async () => {
  const config = await loadEnvConfig();
  console.log(JSON.stringify({
    targets: config.targets.length,
    first: config.targets[0]?.company ?? null,
  }));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
