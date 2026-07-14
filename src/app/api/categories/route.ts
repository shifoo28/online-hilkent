import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCachedData, setCachedData } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const revalidate = 60; // seconds

export async function GET() {
  try {
    const cacheKey = "categories:all";
    const cachedCategories = await getCachedData<any[]>(cacheKey);

    if (cachedCategories) {
      return NextResponse.json(cachedCategories, {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
        },
      });
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    await setCachedData(cacheKey, categories, 300);

    return NextResponse.json(categories, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
