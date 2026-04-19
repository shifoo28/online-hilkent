import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/coupons/validate - Validate coupon code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 },
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code", valid: false },
        { status: 400 },
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: "Coupon is not active", valid: false },
        { status: 400 },
      );
    }

    // Check if coupon has expired
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { error: "Coupon has expired", valid: false },
        { status: 400 },
      );
    }

    // Check minimum order amount if applicable
    const minAmount = coupon.minOrderAmount || 0;

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        minOrderAmount: minAmount,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 },
    );
  }
}
