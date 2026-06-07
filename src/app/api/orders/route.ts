import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";
import { CheckoutFormData } from "@/hooks/useCheckoutForm";
import { generateOrderId } from "@/lib/generateId";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Order creation request body interface
 */
interface CreateOrderRequest {
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
  };
  shippingAddress?: string; // Optional: if differs from billing
  shippingMethodId: number;
  shippingFee: number;
  shippingMethod: string; // Display name
  paymentMethod: CheckoutFormData["paymentMethod"];
  couponCode?: string;
  note?: string;
  subtotal: number;
  discountAmount: number;
  total: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    const requiredFields = [
      "items",
      "billingDetails",
      "shippingMethodId",
      "shippingFee",
      "subtotal",
      "total",
      "paymentMethod",
    ];

    for (const field of requiredFields) {
      if (!body[field as keyof CreateOrderRequest]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 },
        );
      }
    }

    const validPaymentMethods = Object.values(PaymentMethod);
    if (!validPaymentMethods.includes(body.paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          error: "Selected payment method is not valid",
        },
        { status: 400 },
      );
    }

    // Validate items array
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order must contain at least one item",
        },
        { status: 400 },
      );
    }

    // Check ordered items which are not in the database and return all missing product IDs
    const missingProductIds: string[] = [];
    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        missingProductIds.push(item.productId);
      }
    }

    if (missingProductIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `The following products were not found: ${missingProductIds.join(", ")}`,
        },
        { status: 404 },
      );
    }

    // Validate shipping method exists and is active
    const shippingMethod = await prisma.shippingMethod.findUnique({
      where: { id: body.shippingMethodId },
    });

    if (!shippingMethod || !shippingMethod.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Selected shipping method is not available",
        },
        { status: 400 },
      );
    }

    // Validate shipping fee matches database
    const dbShippingFee = Number(shippingMethod.fee);
    if (Math.abs(dbShippingFee - body.shippingFee) > 0.01) {
      console.warn(
        `[Orders API] Shipping fee mismatch: DB=${dbShippingFee}, Request=${body.shippingFee}`,
      );
      // Continue anyway, but use DB value
      body.shippingFee = dbShippingFee;
    }

    // Get or create user by phone
    let user = await prisma.user.findUnique({
      where: {
        phone: parseInt(body.billingDetails.phone.replace(/\D/g, "")) || 0,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: body.billingDetails.email,
          name: `${body.billingDetails.firstName} ${body.billingDetails.lastName}`,
          phone: parseInt(body.billingDetails.phone.replace(/\D/g, "")) || 0,
        },
      });
    }

    // Calculate and verify total (security: always recalculate server-side)
    const calculatedTotal = new Decimal(body.subtotal)
      .plus(new Decimal(body.shippingFee))
      .minus(new Decimal(body.discountAmount));

    const requestTotal = new Decimal(body.total);
    if (!calculatedTotal.equals(requestTotal)) {
      console.warn(
        `[Orders API] Total mismatch: Calculated=${calculatedTotal}, Request=${requestTotal}`,
      );
      // Use calculated value for security
      body.total = Number(calculatedTotal);
    }

    // Create order with shipping information
    const order = await prisma.order.create({
      data: {
        // .toString(36) → converts that number into a base‑36 string (digits 0–9 + letters a–z).
        // .substr(2, 6) → chops off the leading "0." and takes the next 6 characters.
        orderId: generateOrderId(36, 6),
        status: "PENDING",
        subtotal: new Decimal(body.subtotal),
        billingAddress: body.billingDetails.address,
        shippingAddress: body.shippingAddress ?? null,
        // Store shipping fee and method for historical accuracy, even if they change later
        shippingFee: new Decimal(body.shippingFee),
        discountAmount: new Decimal(body.discountAmount),
        total: new Decimal(calculatedTotal),
        note: { create: { content: body.note } },
        paymentMethod: body.paymentMethod,
        user: { connect: { id: user.id } },
        shippingMethod: { connect: { id: body.shippingMethodId } },
        // Create order items
        OrderItems: {
          create: body.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: new Decimal(item.price),
          })),
        },
      },
      include: {
        OrderItems: {
          include: {
            product: {
              select: {
                id: true,
                price: true,
              },
            },
          },
        },
        shippingMethod: true,
        user: true,
      },
    });

    // NEW: Trigger shipping notification (optional)
    // await notifyShippingProvider(order);

    // NEW: Record order event (optional)
    // await logOrderEvent(order.id, "created", { user: user.email });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: order.id,
          orderId: order.orderId,
          userId: order.userId,
          status: order.status,
          subtotal: order.subtotal,
          shippingFee: order.shippingFee,
          discountAmount: order.discountAmount,
          total: order.total,
          shippingMethodId: order.shippingMethodId,
          shippingMethod: order.shippingMethod?.name,
          itemCount: order.OrderItems.length,
          createdAt: order.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[Orders API] Creation error:", error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body format",
        },
        { status: 400 },
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/orders/:userId - Get order details by userId
 *
 * Retrieve order details including shipping information
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        OrderItems: {
          include: {
            product: {
              select: {
                id: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: orders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Orders API] Fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve order",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/orders
 *
 * List orders for current user (requires auth)
 * Includes shipping information
 */
export async function LIST(request: NextRequest): Promise<NextResponse> {
  try {
    return NextResponse.json(
      {
        success: false,
        error: "Not implemented - requires authentication",
      },
      { status: 501 },
    );
  } catch (error) {
    console.error("[Orders API] List error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve orders",
      },
      { status: 500 },
    );
  }
}

/**
 * Example: Additional helper functions for order management
 */

/**
 * Calculate order total with security validation
 * Used to verify calculations from client
 */
export function validateOrderTotal(
  subtotal: number,
  shippingFee: number,
  discountAmount: number,
): number {
  const total = new Decimal(subtotal)
    .plus(new Decimal(shippingFee))
    .minus(new Decimal(discountAmount));

  return Number(total);
}

/**
 * Format order for email/notification
 */
export function formatOrderForNotification(order: any) {
  return {
    orderId: order.orderId,
    total: `$${Number(order.total).toFixed(2)}`,
    shipping: `$${Number(order.shippingFee).toFixed(2)}`,
    shippingMethod: order.shippingMethod?.name || "Unknown",
    itemCount: order.OrderItems?.length || 0,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  };
}
