import { NextResponse, NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/bcrypt";

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
    const { name, email, bio, avatar, oldPassword, newPassword } = body;

    // Check if email is already taken by another user
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email },
        select: { id: true },
      });

      const user = await prisma.user.findUnique({
        where: { phone: parseInt(decoded.userId) },
        select: { id: true },
      });

      if (existingEmail && existingEmail.id !== user?.id) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 },
        );
      }
    }

    // Check if user wants to change password and validate old password
    if (newPassword) {
      const user = await prisma.user.findUnique({
        where: { phone: parseInt(decoded.userId) },
        select: { passwordHash: true },
      });

      if (!user || !verifyPassword(oldPassword, user.passwordHash)) {
        return NextResponse.json(
          { error: "Invalid old password" },
          { status: 400 },
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { phone: parseInt(decoded.userId) },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
        ...(newPassword && { passwordHash: await hashPassword(newPassword) }),
      },
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

    // Fetch recent activity
    const recentOrders = await prisma.order.findMany({
      where: { userId: updatedUser.id },
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

    const profileData = {
      id: updatedUser.id.toString(),
      name: updatedUser.name || "Anonymous User",
      email: updatedUser.email || "",
      avatar: updatedUser.avatar || "/images/users/default-avatar.jpg",
      memberSince: updatedUser.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      }),
      bio: updatedUser.bio || "No bio available",
      stats: {
        orders: updatedUser._count.Orders,
        reviews: updatedUser._count.Reviews,
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
