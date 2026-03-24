import { NextResponse, NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const SECRET = process.env.JWT_SECRET!;

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

export async function PUT(request: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verify(token, SECRET) as { userId: string };
    const body = await request.json();

    // Validate input
    const { name, email, bio, avatar } = body;

    // Check if email is already taken by another user
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      const user = await prisma.user.findUnique({
        where: { phone: decoded.userId },
        select: { id: true },
      });

      if (existingEmail && existingEmail.id !== user?.id) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 },
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { phone: decoded.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        memberSince: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true,
          },
        },
      },
    });

    // Fetch recent activity
    const recentOrders = await prisma.order.findMany({
      where: { userId: updatedUser.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        orderId: true,
        title: true,
        status: true,
        createdAt: true,
      },
    });

    const recentReviews = await prisma.review.findMany({
      where: { userId: updatedUser.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        comment: true,
        rating: true,
        createdAt: true,
      },
    });

    const recentActivity = [
      ...recentOrders.map((order) => ({
        type: "order" as const,
        description: `Placed order #${order.orderId} - ${order.title}`,
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

    const profileData = {
      id: updatedUser.id.toString(),
      name: updatedUser.name || "Anonymous User",
      email: updatedUser.email || "",
      avatar: updatedUser.avatar || "/images/users/default-avatar.jpg",
      memberSince: updatedUser.memberSince.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      }),
      bio: updatedUser.bio || "No bio available",
      stats: {
        orders: updatedUser._count.orders,
        reviews: updatedUser._count.reviews,
        wishlist: updatedUser._count.wishlist,
      },
      recentActivity,
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
