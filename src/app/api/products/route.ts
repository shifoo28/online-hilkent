import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mapPrismaProduct } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 60; // seconds

// GET /api/products - Get all products with pagination and filters
// GET /api/products?id=1 - Get specific product with Reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const productId = searchParams.get("id");

    if (productId) {
      // Get specific product with Reviews
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          _count: {
            select: {
              Reviews: true,
            },
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

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      const baseProduct = mapPrismaProduct(product);

      return NextResponse.json({
        ...baseProduct,
        reviewCount: product._count.Reviews,
      });
    }

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "9", 10), 1);
    const categoryId = searchParams.get("categoryId")?.trim();
    const category = searchParams.get("category")?.trim();
    const brand = searchParams.get("brand")?.trim();
    const search = searchParams.get("search")?.trim();
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "0");
    const minRating = parseFloat(searchParams.get("minRating") || "0");

    const where: any = {};

    if (categoryId && !Number.isNaN(Number(categoryId))) {
      where.categoryId = Number(categoryId);
    } else if (category) {
      where.Category = {
        name: {
          equals: category,
          mode: "insensitive",
        },
      };
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
      where.Properties = {
        some: {
          name: {
            name: "brand",
          },
          value: brand,
        },
      };
    }

    if (search) {
      where.OR = [
        {
          Translations: {
            some: { name: { contains: search, mode: "insensitive" } },
          },
        },
        {
          Translations: {
            some: { description: { contains: search, mode: "insensitive" } },
          },
        },
        { Category: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const totalItems = await prisma.product.count({ where });
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    const products = await prisma.product.findMany({
      where,
      include: {
        _count: {
          select: {
            Reviews: true,
            Images: true,
            Discounts: true,
            Translations: true,
          },
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
      },
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
