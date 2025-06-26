import { redis } from "@/lib/redis";

interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfter?: number;
}

export async function rateLimit({
  key,
  limit,
  windowInSeconds,
}: {
  key: string; // usually userId or IP
  limit: number;
  windowInSeconds: number;
}): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `ratelimit:${key}:${Math.floor(now / windowInSeconds)}`;

  const tx = redis.multi();
  tx.incr(windowKey);
  tx.expire(windowKey, windowInSeconds);

  const [reqCount] = await tx.exec().then((results) =>
    results?.map((res) => res[1] as number)
  );

  if (reqCount > limit) {
    const ttl = await redis.ttl(windowKey);
    return {
      success: false,
      remaining: 0,
      retryAfter: ttl,
    };
  }

  return {
    success: true,
    remaining: limit - reqCount,
  };
}
