import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mapPrismaProduct } from "@/lib/products";
import { buildCacheKey, getCachedData, setCachedData } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const revalidate = 180; // seconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limit = Math.max(Number(searchParams.get("limit") ?? "10"), 1);
    const cacheKey = buildCacheKey("products:best-sellers", { limit });
    const cachedBestSellers = await getCachedData<any>(cacheKey);

    if (cachedBestSellers) {
      return NextResponse.json(cachedBestSellers, {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=180, stale-while-revalidate=60",
        },
      });
    }

    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { salesCount: "desc" },
      include: {
        _count: {
          select: { Reviews: true },
        },
        Discounts: true,
        Images: true,
        Translations: true,
        Properties: {
          include: {
            name: {
              include: { propertyNameTranslations: true },
            },
          },
        },
      },
    });

    const mapped = products.map(mapPrismaProduct);
    const payload = { data: mapped };

    await setCachedData(cacheKey, payload, 180);

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=180, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
