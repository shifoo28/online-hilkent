import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCachedData, setCachedData } from "@/lib/redis";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 300; // seconds

type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: {
    _count: {
      select: {
        products: true;
      };
    };
  };
}>;

export async function GET() {
  try {
    const cacheKey = "categories:all";
    const cachedCategories = await getCachedData<CategoryWithCount[]>(cacheKey);

    if (cachedCategories) {
      return NextResponse.json(cachedCategories, {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
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
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
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
