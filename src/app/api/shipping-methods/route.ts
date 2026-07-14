/**
 * SHIPPING METHODS API ROUTE
 *
 * Provides endpoints to fetch available shipping methods
 * GET /api/shipping-methods - List all active shipping methods
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCachedData, setCachedData } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const revalidate = 60;

/**
 * GET /api/shipping-methods
 *
 * Retrieve all active shipping methods
 * Returns array of shipping methods with id, name, fee, and vehicle type
 *
 * Response:
 * {
 *   success: boolean,
 *   data?: [
 *     {
 *       id: number,
 *       name: string,
 *       fee: string (Decimal as string),
 *       vehicle?: string,
 *       isActive: boolean
 *     }
 *   ],
 *   error?: string
 * }
 */
export async function GET(): Promise<NextResponse> {
  try {
    const cacheKey = "shipping-methods:active";
    const cachedMethods = await getCachedData<any>(cacheKey);

    if (cachedMethods) {
      return NextResponse.json(cachedMethods, { status: 200 });
    }

    const shippingMethods = await prisma.shippingMethod.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        fee: true,
        vehicle: true,
        isActive: true,
      },
      orderBy: {
        fee: "asc",
      },
    });

    // Convert Decimal to string for JSON serialization
    const formattedMethods = shippingMethods.map((method) => ({
      id: method.id,
      name: method.name,
      fee: method.fee.toString(),
      vehicle: method.vehicle,
      isActive: method.isActive,
    }));

    const payload = {
      success: true,
      data: formattedMethods,
      timestamp: new Date().toISOString(),
    };

    await setCachedData(cacheKey, payload, 300);

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("[Shipping Methods API] Error fetching methods:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shipping methods",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
