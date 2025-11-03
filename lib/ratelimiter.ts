type RecordItem = { count: number; resetAt: number };
const store = new Map<string, RecordItem>();
const WINDOW_MS = 60_000;    //1 minute
const LIMIT = 5;    //5 requests/minute per IP

export function allowRequest(key: string) {
  const now = Date.now();
  const rec = store.get(key);

  if (!rec || rec.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (rec.count < LIMIT) {
    rec.count += 1;
    return { allowed: true };
  }
  
  return { allowed: false, retryAfter: rec.resetAt - now };
}