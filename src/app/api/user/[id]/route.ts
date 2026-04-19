import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: userId } = await params;

    // Fetch user with related data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            Orders: true,
            Reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch recent activity (orders and reviews)
    const recentOrders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        orderId: true,
        status: true,
        createdAt: true,
      },
    });

    const recentReviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        comment: true,
        rating: true,
        createdAt: true,
      },
    });

    // Combine and sort recent activity
    const recentActivity = [
      ...recentOrders.map((order) => ({
        type: "order" as const,
        description: `Placed order #${order.orderId} - ${order.status}`,
        date: formatDate(order.createdAt),
      })),
      ...recentReviews.map((review) => ({
        type: "review" as const,
        description: `Reviewed product (${review.rating} stars)`,
        date: formatDate(review.createdAt),
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Format the response
    const profileData = {
      id: user.id.toString(),
      name: user.name || "Anonymous User",
      email: user.email || "",
      avatar: user.avatar || "/images/users/default-avatar.jpg",
      memberSince: user.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      }),
      bio: user.bio || "No bio available",
      stats: {
        orders: user._count.Orders,
        reviews: user._count.Reviews,
      },
      recentActivity,
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}
