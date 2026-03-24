import { NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL); // defaults to localhost:6379

// Generate random 6-digit OTP
function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function storeOtp(subject: string, info: string) {
  const key = `otp:${subject}`;
  await redis.set(key, info, "EX", 330); // expires in 330 seconds (5 min, 30 sec)
}

export async function POST(req: Request) {
  const { fullName, phoneNumber, password } = await req.json();
  const otp = genOtp();

  storeOtp(phoneNumber, JSON.stringify({ otp, fullName, password }));

  return NextResponse.json(
    { message: "OTP getdi, tutyp alyp biläsiz" },
    { status: 200 },
  );
}
