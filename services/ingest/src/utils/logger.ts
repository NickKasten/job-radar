/* eslint-disable no-console */
export const logInfo = (message: string, payload?: Record<string, unknown>) => {
  console.log(JSON.stringify({ level: "info", message, ...payload }));
};

export const logError = (message: string, payload?: Record<string, unknown>) => {
  console.error(JSON.stringify({ level: "error", message, ...payload }));
};
