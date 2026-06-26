import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

interface ValidateCouponRequest {
  code: string;
  orderSubtotal?: number;
}

function calculateCouponDiscount(
  coupon: { discountType: "PERCENTAGE" | "FIXED"; discount: number },
  orderSubtotal: Decimal,
) {
  if (coupon.discountType === "PERCENTAGE") {
    return orderSubtotal
      .times(coupon.discount)
      .div(100)
      .toDecimalPlaces(2, Decimal.ROUND_DOWN);
  }

  const fixedDiscount = new Decimal(coupon.discount);
  return Decimal.min(orderSubtotal, fixedDiscount).toDecimalPlaces(2, Decimal.ROUND_DOWN);
}

// POST /api/coupons/validate - Validate coupon code
export async function POST(request: NextRequest) {
  try {
    const body: ValidateCouponRequest = await request.json();
    const { code, orderSubtotal = 0 } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required", valid: false },
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

    if (!coupon.isActive) {
      return NextResponse.json(
        { error: "Coupon is not active", valid: false },
        { status: 400 },
      );
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { error: "Coupon has expired", valid: false },
        { status: 400 },
      );
    }

    if (coupon.maxUsageCount !== null && coupon.usageCount >= coupon.maxUsageCount) {
      return NextResponse.json(
        { error: "Coupon usage limit has been reached", valid: false },
        { status: 400 },
      );
    }

    const orderAmount = new Decimal(orderSubtotal);
    const minAmount = new Decimal(coupon.minOrderAmount ?? 0);

    if (orderAmount.lessThan(minAmount)) {
      return NextResponse.json(
        {
          error: `Order must be at least ${minAmount.toFixed(2)} TMT to apply this coupon`,
          valid: false,
        },
        { status: 400 },
      );
    }

    const discountAmount = calculateCouponDiscount(coupon, orderAmount);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discount,
        discountAmount: Number(discountAmount.toNumber()),
        minOrderAmount: coupon.minOrderAmount || undefined,
        maxUsageCount: coupon.maxUsageCount || undefined,
        currentUses: coupon.usageCount,
        expiresAt: coupon.expiryDate?.toISOString() || "",
        isActive: coupon.isActive,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon", valid: false },
      { status: 500 },
    );
  }
}
