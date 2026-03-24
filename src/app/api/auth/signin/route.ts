// /app/api/login/route.ts
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import prisma from "@/lib/prisma"; // or your DB client
import { verifyPassword } from "@/lib/bcrypt";

const SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { phoneNumber, password } = await req.json();

  try {
    // 1. Check if phone number exists
    const user = await prisma.user.findUnique({
      where: { phone: phoneNumber },
    });
    if (!user) throw { message: "Phone number not registered", status: 404 };

    // 2. Verify password
    user.passwordHash
      ? null
      : (() => {
          throw { message: "User has no password set", status: 417 };
        })(); // Handle case where user registered via OTP and has no password

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) throw { message: "Incorrect password", status: 401 };

    // 3. Issue tokens
    const accessToken = sign({ userId: user.phone }, SECRET, {
      expiresIn: "1d",
    });

    // 5. Return access token + user info
    const response = NextResponse.json({
      message: "Boldy bro, işiňiz bitdi",
    });
    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 },
    );
  }
}
