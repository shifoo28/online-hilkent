import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
const globalForRedis = globalThis as unknown as { redisClient?: Redis };

const redis =
  globalForRedis.redisClient ||
  new Redis(redisUrl, {
    lazyConnect: true,
    enableReadyCheck: true,
    maxRetriesPerRequest: 0,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redis;
}

export async function getRedisClient(): Promise<Redis | null> {
  try {
    if (redis.status !== "ready") {
      await redis.connect();
    }

    return redis;
  } catch (error) {
    console.warn("Redis unavailable, continuing without cache:", error);
    return null;
  }
}

export function buildCacheKey(prefix: string, params: Record<string, unknown>) {
  const sortedEntries = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .sort(([left], [right]) => left.localeCompare(right));

  const suffix = sortedEntries
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("|");

  return suffix ? `${prefix}:${suffix}` : prefix;
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    console.log('passed');
    
    const client = await getRedisClient();
    if (!client) return null;

    const cachedValue = await client.get(key);
    console.log("Cached List:", cachedValue);
    if (!cachedValue) return null;

    return JSON.parse(cachedValue) as T;
  } catch (error) {
    console.warn(`Redis cache read failed for ${key}:`, error);
    return null;
  }
}

export async function setCachedData<T>(
  key: string,
  value: T,
  ttlSeconds: number,
) {
  try {
    const client = await getRedisClient();
    if (!client) return;

    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    console.warn(`Redis cache write failed for ${key}:`, error);
  }
}
