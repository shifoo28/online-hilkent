import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mapPrismaProduct } from "@/lib/products";

// 👇 This line tells Next.js to cache the page and re‑generate it every 60 seconds
export const revalidate = 60; // seconds

// GET /api/products - Get all products with pagination and filters
// GET /api/products?id=1 - Get specific product with reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (productId) {
      const id = parseInt(productId, 10);
      if (Number.isNaN(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
      }

      // Get specific product with reviews
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          _count: {
            select: { reviews: true },
          },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      const baseProduct = mapPrismaProduct(product);

      return NextResponse.json({
        ...baseProduct,
        reviewCount: product._count.reviews,
      });
    }

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "9", 10), 1);
    const category = searchParams.get("category")?.trim();
    const brand = searchParams.get("brand")?.trim();
    const search = searchParams.get("search")?.trim();
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "0");
    const minRating = parseFloat(searchParams.get("minRating") || "0");

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (!Number.isNaN(minPrice) && minPrice > 0) {
      where.price = { ...where.price, gte: minPrice };
    }

    if (!Number.isNaN(maxPrice) && maxPrice > 0) {
      where.price = { ...where.price, lte: maxPrice };
    }

    if (!Number.isNaN(minRating) && minRating > 0) {
      where.rating = { gte: minRating };
    }

    if (brand) {
      where.properties = {
        some: {
          name: "brand",
          value: brand,
        },
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const totalItems = await prisma.product.count({ where });
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    const products = await prisma.product.findMany({
      where,
      include: {
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const mapped = products.map(mapPrismaProduct);

    return NextResponse.json(
      {
        data: mapped,
        page,
        limit,
        totalItems,
        totalPages,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
