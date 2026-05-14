import { hashPassword } from "@/lib/bcrypt";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = [
    { name: "General", image: "/images/categories/categories-01.png" },
    { name: "Gaming", image: "/images/categories/categories-02.png" },
    { name: "Phones", image: "/images/categories/categories-03.png" },
    { name: "Computers", image: "/images/categories/categories-04.png" },
    { name: "Wearables", image: "/images/categories/categories-05.png" },
    { name: "Accessories", image: "/images/categories/categories-06.png" },
    { name: "Tablets", image: "/images/categories/categories-07.png" },
    { name: "Networking", image: "/images/categories/categories-08.png" },
  ];
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name, image: category.image },
    });
  }

  // Create test users
  const hashedPassword = await hashPassword("123");

  const user1 = await prisma.user.upsert({
    where: { email: "tobymarshal2802@gmail.com" },
    update: {},
    create: {
      name: "Hushnudbek Rahimov",
      email: "tobymarshal2802@gmail.com",
      phone: 62863012,
      passwordHash: hashedPassword,
      avatar: "/images/users/default.webp",
      bio: "Passionate about technology and e-commerce. Love sharing knowledge and helping others.",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "anna@example.com" },
    update: {},
    create: {
      name: "Anna Smith",
      email: "anna@example.com",
      phone: 71234567,
      passwordHash: hashedPassword,
      avatar: "/images/users/default.webp",
      bio: "Fashion enthusiast and tech lover. Always looking for the latest trends.",
    },
  });

  // Create test products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        price: 59,
        inStock: true,
        rating: 5,
        Category: {
          connect: { name: "Gaming" },
        },
        Images: {
          create: [
            {
              url: "/images/products/product-1-bg-1.png",
              thumbnail: "/images/products/product-1-sm-1.png",
              altText: "Havit HV-G69 USB Gamepad",
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        price: 899,
        Category: {
          connect: { name: "Phones" },
        },
        Images: {
          create: [
            {
              url: "/images/products/product-2-bg-1.png",
              thumbnail: "/images/products/product-2-sm-1.png",
              altText: "iPhone 14 Plus , 6/128GB",
            },
          ],
        },

        inStock: true,
        rating: 5,
      },
    }),
    prisma.product.create({
      data: {
        price: 1299,
        Category: {
          connect: { name: "Computers" },
        },
        Images: {
          create: [
            {
              url: "/images/products/product-3-bg-1.png",
              thumbnail: "/images/products/product-3-sm-1.png",
              altText: "Apple iMac M1 24-inch 2021",
            },
          ],
        },

        inStock: true,
        rating: 5,
      },
    }),
    prisma.product.create({
      data: {
        price: 999,
        Category: {
          connect: { name: "Computers" },
        },
        Images: {
          create: [
            {
              url: "/images/products/product-4-bg-1.png",
              thumbnail: "/images/products/product-4-sm-1.png",
              altText: "Dell XPS 13 Laptop",
            },
          ],
        },
        inStock: true,
        rating: 5,
      },
    }),
    prisma.product.create({
      data: {
        price: 799,
        Category: {
          connect: { name: "Wearables" },
        },
        Images: {
          create: [
            {
              url: "/images/products/product-5-bg-1.png",
              thumbnail: "/images/products/product-5-sm-1.png",
              altText: "Apple Watch Series 7",
            },
          ],
        },
        inStock: true,
        rating: 5,
      },
    }),
    prisma.product.create({
      data: {
        price: 99,
        Category: {
          connect: { name: "Accessories" },
        },
        Images: {
          create: [
            {
              url: "/images/products/product-6-bg-1.png",
              thumbnail: "/images/products/product-6-sm-1.png",
              altText: "Wireless Headphones",
            },
          ],
        },
        inStock: true,
        rating: 5,
      },
    }),
    prisma.product.create({
      data: {
        price: 599,
        Category: {
          connect: { name: "Tablets" },
        },
        Images: {
          create: [
            {
              url: "/images/products/product-7-bg-1.png",
              thumbnail: "/images/products/product-7-sm-1.png",
              altText: "iPad Pro 12.9-inch",
            },
          ],
        },
        inStock: true,
        rating: 5,
      },
    }),
    prisma.product.create({
      data: {
        price: 120,
        Category: {
          connect: { name: "Networking" },
        },
        Images: {
          create: [
            {
              url: "/images/products/product-8-bg-1.png",
              thumbnail: "/images/products/product-8-sm-1.png",
              altText: "Network Switch",
            },
          ],
        },
        inStock: true,
        rating: 5,
      },
    }),
  ]);

  // Create product translations
  await prisma.productTranslation.createMany({
    data: [
      // Product 1 translations
      {
        productId: products[0].id,
        locale: "US",
        name: "Havit HV-G69 USB Gamepad",
        description: "Ergonomic gamepad with vibration and turbo modes.",
      },
      {
        productId: products[0].id,
        locale: "RU",
        name: "Havit HV-G69 USB Геймпад",
        description: "Эргономичный геймпад с вибрацией и турбо режимами.",
      },
      {
        productId: products[0].id,
        locale: "TM",
        name: "Havit HV-G69 USB Oýun Dolandyryjy",
        description:
          "Titröw we turbo režimleri bilen ergonomiki oýun dolandyryjy.",
      },
      // Product 2 translations
      {
        productId: products[1].id,
        locale: "US",
        name: "iPhone 14 Plus , 6/128GB",
        description:
          "Latest Apple iPhone with 6.7-inch display and powerful A-series chip.",
      },
      {
        productId: products[1].id,
        locale: "RU",
        name: "iPhone 14 Plus , 6/128GB",
        description:
          "Последний iPhone от Apple с 6.7-дюймовым дисплеем и мощным чипом A-series.",
      },
      {
        productId: products[1].id,
        locale: "TM",
        name: "iPhone 14 Plus , 6/128GB",
        description:
          "6.7-düýpli displeý we güýçli A-series çip bilen iň täze Apple iPhone.",
      },
      // Product 3 translations
      {
        productId: products[2].id,
        locale: "US",
        name: "Apple iMac M1 24-inch 2021",
        description:
          "All-in-one desktop with Apple M1 chip and stunning Retina display.",
      },
      {
        productId: products[2].id,
        locale: "RU",
        name: "Apple iMac M1 24-дюймовый 2021",
        description: "Моноблок с чипом Apple M1 и потрясающим Retina дисплеем.",
      },
      {
        productId: products[2].id,
        locale: "TM",
        name: "Apple iMac M1 24-düýpli 2021",
        description:
          "Apple M1 çip we ajaýyp Retina displeý bilen hemmesi bir kompýuter.",
      },
      // Product 4 translations
      {
        productId: products[3].id,
        locale: "US",
        name: "MacBook Air M1 chip, 8/256GB",
        description:
          "Ultra-thin laptop with long battery life and silent fanless design.",
      },
      {
        productId: products[3].id,
        locale: "RU",
        name: "MacBook Air с чипом M1, 8/256GB",
        description:
          "Ультратонкий ноутбук с длительным временем работы и бесшумным дизайном без вентилятора.",
      },
      {
        productId: products[3].id,
        locale: "TM",
        name: "MacBook Air M1 çip, 8/256GB",
        description:
          "Uzyn batareýa ömri we sessiz wentilyatorsyz dizaýn bilen ýuka noutbuk.",
      },
      // Product 5 translations
      {
        productId: products[4].id,
        locale: "US",
        name: "Apple Watch Ultra",
        description:
          "Rugged watch for extreme sports with advanced health tracking.",
      },
      {
        productId: products[4].id,
        locale: "RU",
        name: "Apple Watch Ultra",
        description:
          "Прочные часы для экстремальных видов спорта с продвинутым отслеживанием здоровья.",
      },
      {
        productId: products[4].id,
        locale: "TM",
        name: "Apple Watch Ultra",
        description:
          "Öňdebaryjy saglyk yzarlaýyşy bilen ekstremal sport üçin çydamly sagat.",
      },
      // Product 6 translations
      {
        productId: products[5].id,
        locale: "US",
        name: "Logitech MX Master 3 Mouse",
        description: "Precision wireless mouse with ergonomic sm rest.",
      },
      {
        productId: products[5].id,
        locale: "RU",
        name: "Logitech MX Master 3 Мышь",
        description:
          "Точная беспроводная мышь с эргономичной подставкой для большого пальца.",
      },
      {
        productId: products[5].id,
        locale: "TM",
        name: "Logitech MX Master 3 Syçan",
        description: "Ergonomiki baş barmak üçin ýer bilen takyk simsiz syçan.",
      },
      // Product 7 translations
      {
        productId: products[6].id,
        locale: "US",
        name: "Apple iPad Air 5th Gen - 64GB",
        description:
          "Lightweight tablet with powerful processor and great display.",
      },
      {
        productId: products[6].id,
        locale: "RU",
        name: "Apple iPad Air 5-го поколения - 64GB",
        description: "Легкий планшет с мощным процессором и отличным дисплеем.",
      },
      {
        productId: products[6].id,
        locale: "TM",
        name: "Apple iPad Air 5-nji nesil - 64GB",
        description: "Güýçli prosessor we ajaýyp displeý bilen ýeňil planşet.",
      },
      // Product 8 translations
      {
        productId: products[7].id,
        locale: "US",
        name: "Asus RT Dual Band Router",
        description: "High speed router with dual band support and smart QoS.",
      },
      {
        productId: products[7].id,
        locale: "RU",
        name: "Asus RT Двухдиапазонный роутер",
        description:
          "Высокоскоростной роутер с поддержкой двух диапазонов и умным QoS.",
      },
      {
        productId: products[7].id,
        locale: "TM",
        name: "Asus RT Iki Zolakly Router",
        description:
          "Iki zolak goldawy we smart QoS bilen ýokary tizlikli router.",
      },
    ],
  });

  // Create hero products
  await prisma.heroProduct.createMany({
    data: [
      {
        productId: products[0].id,
        isSlider: true,
        headline: "MacBook Air M1",
        subline: "Ultra-thin laptop with long battery life",
        image: "/images/products/product-4-bg-1.png",
      },
      {
        productId: products[1].id,
        isSlider: false,
        headline: "iPhone 15 Pro",
        subline: "The most advanced iPhone ever",
        image: "/images/products/product-2-bg-1.png",
      },
      {
        productId: products[2].id,
        isSlider: true,
        headline: "Apple Watch Series 9",
        subline: "The smartwatch that keeps you connected",
        image: "/images/products/product-5-bg-1.png",
      },
      {
        productId: products[3].id,
        isSlider: true,
        headline: "MacBook Pro 16-inch",
        subline: "The ultimate pro notebook",
        image: "/images/products/product-3-bg-1.png",
      },
      {
        productId: products[4].id,
        isSlider: false,
        headline: "Apple iPad Air 5th Gen - 64GB",
        subline: "Lightweight tablet with powerful processor and great display",
        image: "/images/products/product-7-bg-1.png",
      },
    ],
  });

  async function createShippingMethods() {
    const methods = [
      { name: "Passenger Car", cost: 5, vehicle: "PASSENGER_CAR" },
      { name: "Light Truck", cost: 15, vehicle: "LIGHT_TRUCK" },
      { name: "Free Shipping", cost: 0, vehicle: null },
    ];

    for (const method of methods) {
      await prisma.shippingMethod.upsert({
        where: { name: method.name },
        update: {},
        create: {
          name: method.name,
          cost: new Decimal(method.cost),
          vehicle: method.vehicle as "PASSENGER_CAR" | "LIGHT_TRUCK" | null,
          isActive: true,
        },
      });
    }
  }

  await createShippingMethods();

  // Create orders for users
  const order1 = await prisma.order.upsert({
    where: { orderId: "ORD-2024-001" },
    update: {},
    create: {
      orderId: "ORD-2024-001",
      userId: user1.id,
      status: "DELIVERED",
      total: 150,
      subtotal: 120,
      shippingFee: 20,
      shippingMethodId: 1,
      discountAmount: 10,
    },
  });

  const order2 = await prisma.order.upsert({
    where: { orderId: "ORD-2024-002" },
    update: {},
    create: {
      orderId: "ORD-2024-002",
      userId: user1.id,
      status: "PROCESSING",
      total: 89,
      subtotal: 79,
      shippingFee: 10,
      shippingMethodId: 2,
      discountAmount: 0,
    },
  });

  const order3 = await prisma.order.upsert({
    where: { orderId: "ORD-2024-003" },
    update: {},
    create: {
      orderId: "ORD-2024-003",
      userId: user2.id,
      status: "SHIPPED",
      total: 45,
      subtotal: 45,
      shippingFee: 0,
      shippingMethodId: 3,
      discountAmount: 0,
    },
  });

  // Create order items
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: products[0].id,
        quantity: 1,
        price: 59,
      },
      {
        orderId: order2.id,
        productId: products[1].id,
        quantity: 1,
        price: 89,
      },
      {
        orderId: order3.id,
        productId: products[2].id,
        quantity: 1,
        price: 45,
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
