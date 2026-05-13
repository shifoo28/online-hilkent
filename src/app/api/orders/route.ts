/**
 * ORDERS API ROUTE - UPDATED WITH SHIPPING INTEGRATION
 *
 * This updated API route handles order creation with:
 * - Shipping method association
 * - Shipping cost calculation and storage
 * - Complete price breakdown (subtotal, shipping, discount, total)
 * - Decimal precision for currency values
 * - Comprehensive error handling
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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
    town: string;
    country: string;
    postCode: string;
  };
  shippingDetails?: {
    address: string;
    town: string;
    country: string;
    postCode: string;
  };
  shippingMethodId: number; // NEW: FK to ShippingMethod
  shippingCost: number; // NEW: Shipping cost
  shippingMethod: string; // Display name
  paymentMethod: "bank" | "cash";
  couponCode?: string;
  notes?: string;
  subtotal: number; // NEW: Itemized subtotal
  discountAmount: number; // NEW: Applied discount
  total: number; // NEW: Final total
}

/**
 * POST /api/orders
 *
 * Create a new order with shipping information
 *
 * Request Body:
 * {
 *   items: Array<{ productId, quantity, price }>,
 *   billingDetails: { firstName, lastName, email, phone, address, town, country, postCode },
 *   shippingDetails?: { address, town, country, postCode },
 *   shippingMethodId: number,
 *   shippingCost: number,
 *   shippingMethod: string,
 *   paymentMethod: "bank" | "cash",
 *   couponCode?: string,
 *   notes?: string,
 *   subtotal: number,
 *   discountAmount: number,
 *   total: number
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   data?: {
 *     id: string,
 *     orderId: string,
 *     userId: string,
 *     status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
 *     subtotal: Decimal,
 *     shippingCost: Decimal,
 *     discountAmount: Decimal,
 *     total: Decimal,
 *     shippingMethodId: number,
 *     createdAt: DateTime
 *   },
 *   error?: string
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    const requiredFields = [
      "items",
      "billingDetails",
      "shippingMethodId",
      "shippingCost",
      "subtotal",
      "discountAmount",
      "total",
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

    // Validate shipping cost matches database
    const dbCost = Number(shippingMethod.cost);
    if (Math.abs(dbCost - body.shippingCost) > 0.01) {
      console.warn(
        `[Orders API] Shipping cost mismatch: DB=${dbCost}, Request=${body.shippingCost}`,
      );
      // Continue anyway, but use DB value
      body.shippingCost = dbCost;
    }

    // Get or create user by email
    let user = await prisma.user.findUnique({
      where: { email: body.billingDetails.email },
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
      .plus(new Decimal(body.shippingCost))
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
        orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        userId: user.id,
        status: "PENDING",
        // NEW: Price breakdown fields
        subtotal: new Decimal(body.subtotal),
        shippingCost: new Decimal(body.shippingCost),
        discountAmount: new Decimal(body.discountAmount),
        total: new Decimal(calculatedTotal),
        // NEW: Shipping method reference
        shippingMethodId: body.shippingMethodId,
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

    // Log order creation
    console.log(`[Orders API] Order created:`, {
      orderId: order.orderId,
      userId: order.userId,
      total: order.total,
      shippingCost: order.shippingCost,
      shippingMethodId: order.shippingMethodId,
      itemCount: order.OrderItems.length,
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
          shippingCost: order.shippingCost,
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
 * GET /api/orders/:id
 *
 * Retrieve order details including shipping information
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const order = await prisma.order.findUnique({
      where: { id },
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
        shippingMethod: true, // NEW: Include shipping method details
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
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
        data: order,
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
    // TODO: Implement user authentication
    // const session = await getSession(request);
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { success: false, error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    // Example: Get orders for user
    // const orders = await prisma.order.findMany({
    //   where: { userId: session.user.id },
    //   include: {
    //     OrderItems: true,
    //     shippingMethod: true,
    //   },
    //   orderBy: { createdAt: "desc" },
    //   take: 50,
    // });

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
  shippingCost: number,
  discountAmount: number,
): number {
  const total = new Decimal(subtotal)
    .plus(new Decimal(shippingCost))
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
    shipping: `$${Number(order.shippingCost).toFixed(2)}`,
    shippingMethod: order.shippingMethod?.name || "Unknown",
    itemCount: order.OrderItems?.length || 0,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  };
}
