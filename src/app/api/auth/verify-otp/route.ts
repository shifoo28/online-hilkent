import { NextResponse, NextRequest } from "next/server";
import { sign } from "jsonwebtoken";
import Redis from "ioredis";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma"; // Ensure prisma is initialized if needed for future use
import { hashPassword } from "@/lib/bcrypt";

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";
const redis = new Redis(redisUrl, {
  lazyConnect: true,
  enableReadyCheck: true,
  maxRetriesPerRequest: 0,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});
const SECRET = process.env.JWT_SECRET!;
const defaultAvatar =
  "/images/users/default.webp"; /* You can replace this with an actual default avatar URL */

async function getRedis() {
  if (redis.status !== "ready") {
    await redis.connect();
  }
  return redis;
}

async function verifyOtp(subject: string, inputOtp: string): Promise<boolean> {
  const client = await getRedis();
  const key = `otp:${subject}`;
  const payload = await client.get(key);

  if (!payload) throw new Error("OTP has expired");

  const { otp, password, fullName } = JSON.parse(payload);
  if (!otp) throw new Error("OTP has expired"); // expired or not found
  if (otp !== inputOtp) throw new Error("Invalid OTP");

  // Store all user info by hashing password in DB password before deleting OTP, so we can use it for future authentication
  await storeUserInDB({ phone: parseInt(subject), password, name: fullName });

  // OTP is valid → delete immediately to prevent reuse
  await client.del(key);
  return true;
}

async function storeUserInDB({
  name,
  phone,
  password,
}: {
  phone: number;
  password?: string;
  name?: string;
}) {
  // In a real application, you would hash the password before storing it
  const passwordHash =
    password && password.length > 0 ? await hashPassword(password) : undefined;
  await prisma.user.upsert({
    where: { phone },
    update: { name, passwordHash },
    create: { phone, name, passwordHash, avatar: defaultAvatar },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json();
    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: "phoneNumber and otp are required" },
        { status: 400 },
      );
    }

    await verifyOtp(phoneNumber, otp);

    const accessToken = sign({ userId: phoneNumber }, SECRET, {
      expiresIn: "30d",
    });

    // Set cookie using Next.js helpers
    (await cookies()).set({
      name: "token",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json(
      { success: true, phoneNumber },
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("OTP verification failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "OTP verification failed" },
      { status: 412 },
    );
  }
}
