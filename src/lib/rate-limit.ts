import crypto from "crypto";

/**
 * Lightweight in-memory rate limiter (fixed window).
 *
 * For a single-instance deployment this is sufficient. For multi-instance /
 * serverless deployments swap the Map for a durable store such as
 * @upstash/ratelimit (Redis). The interface stays the same.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

/** Hash an IP address so we never store raw PII. */
export function hashIp(ip: string): string {
  const salt = process.env.AUTH_SECRET ?? "portfolio-salt";
  return crypto.createHash("sha256").update(`${ip}:${salt}`).digest("hex").slice(0, 32);
}

// Occasionally clear stale buckets to avoid unbounded growth.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
  }, 60_000).unref?.();
}
