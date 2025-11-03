export function log(...args: any[]) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[DEV]", ...args);
  }
}

export function logError(...args: any[]) {
  console.error("[ERROR]", ...args);
}