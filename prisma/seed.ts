import { hashPassword } from "@/lib/bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create test users
  const hashedPassword = await hashPassword("password123");

  const user1 = await prisma.user.upsert({
    where: { email: "james@example.com" },
    update: {},
    create: {
      name: "James Septimus",
      email: "james@example.com",
      phone: "+993123456789",
      passwordHash: hashedPassword,
      avatar: "/images/users/user-02.jpg",
      bio: "Passionate about technology and e-commerce. Love sharing knowledge and helping others.",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "anna@example.com" },
    update: {},
    create: {
      name: "Anna Smith",
      email: "anna@example.com",
      phone: "+993987654321",
      passwordHash: hashedPassword,
      avatar: "/images/users/user-03.jpg",
      bio: "Fashion enthusiast and tech lover. Always looking for the latest trends.",
    },
  });

  // Create test products
  await prisma.product.createMany({
    data: [
      {
        name: "Havit HV-G69 USB Gamepad",
        description: "Ergonomic gamepad with vibration and turbo modes.",
        price: 59,
        image: "/images/products/product-1-bg-1.png",
        category: "Gaming",
        inStock: true,
        rating: 5,
      },
      {
        name: "iPhone 14 Plus , 6/128GB",
        description:
          "Latest Apple iPhone with 6.7-inch display and powerful A-series chip.",
        price: 899,
        image: "/images/products/product-2-bg-1.png",
        category: "Phones",
        inStock: true,
        rating: 5,
      },
      {
        name: "Apple iMac M1 24-inch 2021",
        description:
          "All-in-one desktop with Apple M1 chip and stunning Retina display.",
        price: 1299,
        image: "/images/products/product-3-bg-1.png",
        category: "Computers",
        inStock: true,
        rating: 5,
      },
      {
        name: "MacBook Air M1 chip, 8/256GB",
        description:
          "Ultra-thin laptop with long battery life and silent fanless design.",
        price: 999,
        image: "/images/products/product-4-bg-1.png",
        category: "Computers",
        inStock: true,
        rating: 5,
      },
      {
        name: "Apple Watch Ultra",
        description:
          "Rugged watch for extreme sports with advanced health tracking.",
        price: 799,
        image: "/images/products/product-5-bg-1.png",
        category: "Wearables",
        inStock: true,
        rating: 5,
      },
      {
        name: "Logitech MX Master 3 Mouse",
        description: "Precision wireless mouse with ergonomic thumb rest.",
        price: 99,
        image: "/images/products/product-6-bg-1.png",
        category: "Accessories",
        inStock: true,
        rating: 5,
      },
      {
        name: "Apple iPad Air 5th Gen - 64GB",
        description:
          "Lightweight tablet with powerful processor and great display.",
        price: 599,
        image: "/images/products/product-7-bg-1.png",
        category: "Tablets",
        inStock: true,
        rating: 5,
      },
      {
        name: "Asus RT Dual Band Router",
        description: "High speed router with dual band support and smart QoS.",
        price: 120,
        image: "/images/products/product-8-bg-1.png",
        category: "Networking",
        inStock: true,
        rating: 5,
      },
    ],
  });

  // Get the created products
  const products = await prisma.product.findMany();

  // Create orders for users
  await prisma.order.createMany({
    data: [
      {
        orderId: "ORD-2024-001",
        userId: user1.id,
        status: "delivered",
        total: "150 TMT",
        title: "Wireless Headphones",
      },
      {
        orderId: "ORD-2024-002",
        userId: user1.id,
        status: "processing",
        total: "89 TMT",
        title: "Smart Watch",
      },
      {
        orderId: "ORD-2024-003",
        userId: user2.id,
        status: "shipped",
        total: "45 TMT",
        title: "Phone Case",
      },
    ],
  });

  // Create reviews
  await prisma.review.createMany({
    data: [
      {
        userId: user1.id,
        productId: products[0].id,
        rating: 5,
        comment: "Excellent product! Highly recommend.",
      },
      {
        userId: user2.id,
        productId: products[1].id,
        rating: 4,
        comment: "Good quality, fast delivery.",
      },
      {
        userId: user1.id,
        productId: products[2].id,
        rating: 4,
        comment: "Stylish and protective. Great value!",
      },
    ],
  });

  // Create wishlist items
  // await prisma.wishlist.createMany({
  //   data: [
  //     {
  //       userId: user1.id,
  //       productId: products[3].id,
  //     },
  //     {
  //       userId: user1.id,
  //       productId: products[4].id,
  //     },
  //     {
  //       userId: user2.id,
  //       productId: products[4].id,
  //     },
  //   ],
  // });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
