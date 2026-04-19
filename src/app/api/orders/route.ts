import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export interface CreateOrderRequest {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  billingDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    town: string;
    country: string;
    postCode?: string;
  };
  shippingDetails?: {
    address: string;
    town: string;
    country: string;
    postCode?: string;
  };
  shippingMethod: "free" | "fedex" | "dhl";
  paymentMethod: "bank" | "cash" | "paypal";
  couponCode?: string;
  notes?: string;
  subtotal: number;
  shippingFee: number;
  discount?: number;
  total: number;
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 },
      );
    }

    if (!body.billingDetails) {
      return NextResponse.json(
        { error: "Billing details are required" },
        { status: 400 },
      );
    }

    // Validate billing details
    const { firstName, lastName, email, phone, address, town, country } =
      body.billingDetails;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !town ||
      !country
    ) {
      return NextResponse.json(
        { error: "Incomplete billing details" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Verify products exist and validate prices
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: body.items.map((item) => item.productId),
        },
      },
    });

    if (products.length !== body.items.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 400 },
      );
    }

    // Validate coupon if provided
    let couponDiscount = 0;
    if (body.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: body.couponCode },
      });

      if (!coupon) {
        return NextResponse.json(
          { error: "Invalid coupon code" },
          { status: 400 },
        );
      }

      if (!coupon.isActive) {
        return NextResponse.json(
          { error: "Coupon is not active" },
          { status: 400 },
        );
      }

      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return NextResponse.json(
          { error: "Coupon has expired" },
          { status: 400 },
        );
      }

      couponDiscount = coupon.discount || 0;
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderId,
        userId: body.userId,
        total: body.total.toString(), // Store as string to avoid floating point issues
        status: "PENDING",
      },
    });

    // Create order items
    const orderItems = body.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price.toString(),
    }));

    await prisma.orderItem.createMany({
      data: orderItems,
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          orderId: order.orderId,
          status: order.status,
          total: order.total,
        },
        message: "Order created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

// GET /api/orders - Get user orders (requires authentication)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        OrderItems: {
          include: {
            product: {
              select: {
                id: true,
                price: true,
                Category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                Images: {
                  select: {
                    url: true,
                    thumbnail: true,
                    altText: true,
                  },
                },
                Translations: {
                  select: {
                    name: true,
                    locale: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
