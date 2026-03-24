import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Öz hahşyňyz bilän Sizi aramyzdan çykardyk",
  });

  response.cookies.set("token", "", { maxAge: 0, path: "/" });

  return response;
}
