import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/reviews?productId=1 - Get all reviews for a product
// GET /api/reviews?userId=1 - Get all reviews by a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const userId = searchParams.get("userId");

    if (!productId && !userId) {
      return NextResponse.json(
        { error: "Either productId or userId is required" },
        { status: 400 },
      );
    }

    const where: any = {};
    if (productId) where.productId = productId;
    if (userId) where.userId = userId;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        product: {
          select: {
            id: true,
            Translations: {
              select: {
                name: true,
                locale: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, rating, comment } = body;

    if (!userId || !productId || !rating) {
      return NextResponse.json(
        { error: "userId, productId, and rating are required" },
        { status: 400 },
      );
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "User has already reviewed this product" },
        { status: 400 },
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: userId,
        productId: productId,
        rating: parseInt(rating),
        comment: comment || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        product: {
          select: {
            id: true,
            Translations: {
              select: {
                name: true,
                locale: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
