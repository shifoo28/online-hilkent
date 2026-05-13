import { NextResponse } from "next/server";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
const redis = new Redis(redisUrl, {
  lazyConnect: true,
  enableReadyCheck: true,
  maxRetriesPerRequest: 0,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

async function getRedis() {
  if (redis.status !== "ready") {
    await redis.connect();
  }
  return redis;
}

// Generate random 6-digit OTP
function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function storeOtp(subject: string, info: string) {
  const client = await getRedis();
  const key = `otp:${subject}`;
  await client.set(key, info, "EX", 3600); // expires in 1 hour
}

export async function POST(req: Request) {
  try {
    const { fullName, phoneNumber, password } = await req.json();
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "phoneNumber is required" },
        { status: 400 },
      );
    }

    const otp = genOtp();
    await storeOtp(phoneNumber, JSON.stringify({ otp, fullName, password }));

    return NextResponse.json(
      { message: "OTP getdi, tutyp alyp biläsiz" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error storing OTP:", error);
    return NextResponse.json(
      { error: "Unable to process OTP at this time" },
      { status: 503 },
    );
  }
}
