import { hashPassword } from "@/lib/bcrypt";
import { generateOrderId } from "@/lib/generateId";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = [
    { name: "General", image: "/images/categories/general.png" },
    { name: "Emulsions", image: "/images/categories/emulsions.png" },
    { name: "Kalekums", image: "/images/categories/kalekums.png" },
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
    where: { phone: 62863012 },
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
    where: { phone: 71234567 },
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
        price: 150,
        inStock: true,
        rating: 0,
        Category: {
          connect: { name: "Emulsions" },
        },
        Images: {
          create: [
            {
              url: "/images/products/elteks_dasky.png",
              thumbnail: "/images/products/elteks_dasky.png",
              altText: "Elteks Dasky Emulsion",
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        price: 111,
        Category: {
          connect: { name: "Emulsions" },
        },
        Images: {
          create: [
            {
              url: "/images/products/elteks_icki.png",
              thumbnail: "/images/products/elteks_icki.png",
              altText: "Elteks Icki Emulsion",
            },
          ],
        },

        inStock: true,
        rating: 0,
      },
    }),
    prisma.product.create({
      data: {
        price: 127,
        Category: {
          connect: { name: "Emulsions" },
        },
        Images: {
          create: [
            {
              url: "/images/products/elteks_icki_+.png",
              thumbnail: "/images/products/elteks_icki_+.png",
              altText: "Elteks Icki+ Emulsion",
            },
          ],
        },

        inStock: true,
        rating: 0,
      },
    }),
    prisma.product.create({
      data: {
        price: 214,
        Category: {
          connect: { name: "Emulsions" },
        },
        Images: {
          create: [
            {
              url: "/images/products/ganat_icki.png",
              thumbnail: "/images/products/ganat_icki.png",
              altText: "Ganat Icki Emulsion",
            },
          ],
        },
        inStock: true,
        rating: 0,
      },
    }),
    prisma.product.create({
      data: {
        price: 292,
        Category: {
          connect: { name: "Emulsions" },
        },
        Images: {
          create: [
            {
              url: "/images/products/ganat_dasky.png",
              thumbnail: "/images/products/ganat_dasky.png",
              altText: "Ganat Dasky Emulsion",
            },
          ],
        },
        inStock: true,
        rating: 0,
      },
    }),
    prisma.product.create({
      data: {
        price: 312,
        Category: {
          connect: { name: "Emulsions" },
        },
        Images: {
          create: [
            {
              url: "/images/products/ganat_silicon.png",
              thumbnail: "/images/products/ganat_silicon.png",
              altText: "Ganat Silicon Emulsion",
            },
          ],
        },
        inStock: true,
        rating: 0,
      },
    }),
    prisma.product.create({
      data: {
        price: 165,
        Category: {
          connect: { name: "Emulsions" },
        },
        Images: {
          create: [
            {
              url: "/images/products/ganat_taban.png",
              thumbnail: "/images/products/ganat_taban.png",
              altText: "Ganat Taban Emulsion",
            },
          ],
        },
        inStock: true,
        rating: 0,
      },
    }),
    prisma.product.create({
      data: {
        price: 156,
        Category: {
          connect: { name: "Emulsions" },
        },
        Images: {
          create: [
            {
              url: "/images/products/ganat_astar.png",
              thumbnail: "/images/products/ganat_astar.png",
              altText: "Ganat Astar Emulsion",
            },
          ],
        },
        inStock: true,
        rating: 0,
      },
    }),
    prisma.product.create({
      data: {
        price: 45,
        Category: {
          connect: { name: "Kalekums" },
        },
        Images: {
          create: [
            {
              url: "/images/products/kalekum_hilkent.png",
              thumbnail: "/images/products/kalekum_hilkent.png",
              altText: "Kalekum Hilkent ",
            },
          ],
        },
        inStock: true,
        rating: 0,
      },
    }),
    prisma.product.create({
      data: {
        price: 35,
        Category: {
          connect: { name: "Kalekums" },
        },
        Images: {
          create: [
            {
              url: "/images/products/kalekum_erkfix_gold.png",
              thumbnail: "/images/products/kalekum_erkfix_gold.png",
              altText: "Kalekum Erkfix Gold",
            },
          ],
        },
        inStock: true,
        rating: 0,
      },
    }),
    prisma.product.create({
      data: {
        price: 27,
        Category: {
          connect: { name: "Kalekums" },
        },
        Images: {
          create: [
            {
              url: "/images/products/kalekum_erkfix.png",
              thumbnail: "/images/products/kalekum_erkfix.png",
              altText: "Kalekum Erkfix",
            },
          ],
        },
        inStock: true,
        rating: 0,
      },
    }),
    prisma.product.create({
      data: {
        price: 24,
        Category: {
          connect: { name: "Kalekums" },
        },
        Images: {
          create: [
            {
              url: "/images/products/kalekum_elteks.png",
              thumbnail: "/images/products/kalekum_elteks.png",
              altText: "Kalekum Elteks",
            },
          ],
        },
        inStock: true,
        rating: 0,
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
        name: "Elteks Exterior Emulsion",
        description:
          "High-quality exterior paint designed to withstand harsh weather conditions.",
      },
      {
        productId: products[0].id,
        locale: "RU",
        name: "Elteks Наружная Эмульсия",
        description:
          "Высококачественная наружная краска, разработанная для выдерживания суровых погодных условий.",
      },
      {
        productId: products[0].id,
        locale: "TM",
        name: "Elteks Daşky Emulsiýa",
        description:
          "Kyn howa şertlerine garşy durmak üçin niýetlenen ýokary hilli daşky boýag.",
      },
      // Product 2 translations
      {
        productId: products[1].id,
        locale: "US",
        name: "Elteks Interior Emulsion",
        description:
          "Premium interior paint with smooth finish and excellent coverage.",
      },
      {
        productId: products[1].id,
        locale: "RU",
        name: "Elteks Внутренняя Эмульсия",
        description:
          "Премиальная внутренняя краска с гладкой поверхностью и отличным покрытием.",
      },
      {
        productId: products[1].id,
        locale: "TM",
        name: "Elteks Içki Emulsiýa",
        description: "Içerki boýag, ýumşak örtük we ajaýyp örtügi bilen.",
      },
      // Product 3 translations
      {
        productId: products[2].id,
        locale: "US",
        name: "Elteks + Interior Emulsion",
        description:
          "Enhanced interior paint with added durability and stain resistance.",
      },
      {
        productId: products[2].id,
        locale: "RU",
        name: "Elteks + Внутренняя Эмульсия",
        description:
          "Премиальная внутренняя краска с гладкой поверхностью и отличным покрытием.",
      },
      {
        productId: products[2].id,
        locale: "TM",
        name: "Elteks + Içki Emulsiýa",
        description:
          "Güýçlendirilen içki emulsiýa, goşmaça durnuklylyk we dogryga garşy duruş bilen.",
      },
      // Product 4 translations
      {
        productId: products[3].id,
        locale: "US",
        name: "Ganat Interior Emulsion",
        description:
          "Premium interior paint with smooth finish and excellent coverage.",
      },
      {
        productId: products[3].id,
        locale: "RU",
        name: "Ganat Внутренняя Эмульсия",
        description:
          "Премиальная внутренняя краска с гладкой поверхностью и отличным покрытием.",
      },
      {
        productId: products[3].id,
        locale: "TM",
        name: "Ganat Içki Emulsiýa",
        description: "Içerki boýag, ýumşak örtük we ajaýyp örtügi bilen.",
      },
      // Product 5 translations
      {
        productId: products[4].id,
        locale: "US",
        name: "Ganat Exterior Emulsion",
        description:
          "High-quality exterior paint designed to withstand harsh weather conditions.",
      },
      {
        productId: products[4].id,
        locale: "RU",
        name: "Ganat Наружная Эмульсия",
        description:
          "Высококачественная наружная краска, разработанная для выдерживания суровых погодных условий.",
      },
      {
        productId: products[4].id,
        locale: "TM",
        name: "Ganat Daşky Emulsiýa",
        description:
          "Kyn howa şertlerine garşy durmak üçin niýetlenen ýokary hilli daşky boýag.",
      },
      // Product 6 translations
      {
        productId: products[5].id,
        locale: "US",
        name: "Ganat Silicon Emulsion",
        description:
          "Premium silicon-based emulsion for superior durability and water resistance.",
      },
      {
        productId: products[5].id,
        locale: "RU",
        name: "Ganat Силиконовая Эмульсия",
        description:
          "Премиальная силиконовая эмульсия для превосходной прочности и водонепроницаемости.",
      },
      {
        productId: products[5].id,
        locale: "TM",
        name: "Ganat Silikonly Emulsiýa",
        description:
          "Ýokary durnuklylyk we suw wärişligi üçin premiýal silikon tabaýyn emulsiýa.",
      },
      // Product 7 translations
      {
        productId: products[6].id,
        locale: "US",
        name: "Ganat Taban Emulsion",
        description:
          "High-quality primer emulsion designed to improve adhesion and durability of topcoats.",
      },
      {
        productId: products[6].id,
        locale: "RU",
        name: "Ganat Подложечная Эмульсия",
        description:
          "Высококачественная грунтовочная эмульсия, разработанная для улучшения адгезии и долговечности верхних покрытий.",
      },
      {
        productId: products[6].id,
        locale: "TM",
        name: "Ganat Taban Emulsiýa",
        description:
          "Ýokary durnuklylyk we suw wärişligi üçin premiýal silikon tabaýyn emulsiýa.",
      },
      // Product 8 translations
      {
        productId: products[7].id,
        locale: "US",
        name: "Ganat Primer Emulsion",
        description:
          "High-quality primer emulsion designed to improve adhesion and durability of topcoats.",
      },
      {
        productId: products[7].id,
        locale: "RU",
        name: "Ganat Грунтовочная Эмульсия",
        description:
          "Высококачественная грунтовочная эмульсия, разработанная для улучшения адгезии и долговечности верхних покрытий.",
      },
      {
        productId: products[7].id,
        locale: "TM",
        name: "Ganat Astar Emulsiýa",
        description: "Ýokary durnuklylyk we suw wärişligi üçin premiýal astar.",
      },
      // Product 9 translations
      {
        productId: products[8].id,
        locale: "US",
        name: "Kalekum Hilkent Universal Tile Adhesive",
        description:
          "High-performance tile adhesive suitable for various substrates, providing strong bonding and durability.",
      },
      {
        productId: products[8].id,
        locale: "RU",
        name: "Kalekum Hilkent Универсальный Клей для Плитки",
        description:
          "Высокопроизводительный клей для плитки, подходящий для различных подложек, обеспечивающий прочное сцепление и долговечность.",
      },
      {
        productId: products[8].id,
        locale: "TM",
        name: "Kalekum Hilkent Uniwersal Kafel ýelimi",
        description:
          "Dürli substratlar üçin amatly ýokary öndürijilikli kafel ýelimi, güýçli baglanyşyk we durnuklylyk üpjün edýär.",
      },
      // Product 10 translation
      {
        productId: products[8].id,
        locale: "US",
        name: "Kalekum Erkfix Gold Tile Adhesive",
        description:
          "High-performance tile adhesive suitable for various substrates, providing strong bonding and durability.",
      },
      {
        productId: products[8].id,
        locale: "RU",
        name: "Kalekum Erkfix Gold Клей для Плитки",
        description:
          "Высокопроизводительный клей для плитки, подходящий для различных подложек, обеспечивающий прочное сцепление и долговечность.",
      },
      {
        productId: products[8].id,
        locale: "TM",
        name: "Kalekum Erkfix Gold Kafel ýelimi",
        description:
          "Dürli substratlar üçin amatly ýokary öndürijilikli kafel ýelimi, güýçli baglanyşyk we durnuklylyk üpjün edýär.",
      },
      // Product 11 translation
      {
        productId: products[8].id,
        locale: "US",
        name: "Kalekum Erkfix Tile Adhesive",
        description:
          "High-performance tile adhesive suitable for various substrates, providing strong bonding and durability.",
      },
      {
        productId: products[8].id,
        locale: "RU",
        name: "Kalekum Erkfix Клей для Плитки",
        description:
          "Высокопроизводительный клей для плитки, подходящий для различных подложек, обеспечивающий прочное сцепление и долговечность.",
      },
      {
        productId: products[8].id,
        locale: "TM",
        name: "Kalekum Erkfix Kafel ýelimi",
        description:
          "Dürli substratlar üçin amatly ýokary öndürijilikli kafel ýelimi, güýçli baglanyşyk we durnuklylyk üpjün edýär.",
      },
      // Product 12 translation
      {
        productId: products[8].id,
        locale: "US",
        name: "Kalekum Elteks Tile Adhesive",
        description:
          "High-performance tile adhesive suitable for various substrates, providing strong bonding and durability.",
      },
      {
        productId: products[8].id,
        locale: "RU",
        name: "Kalekum Elteks Клей для Плитки",
        description:
          "Высокопроизводительный клей для плитки, подходящий для различных подложек, обеспечивающий прочное сцепление и долговечность.",
      },
      {
        productId: products[8].id,
        locale: "TM",
        name: "Kalekum Elteks Kafel ýelimi",
        description:
          "Dürli substratlar üçin amatly ýokary öndürijilikli kafel ýelimi, güýçli baglanyşyk we durnuklylyk üpjün edýär.",
      },
    ],
  });

  // General property names
  const propertyNames = [
    { name: "Brand" },
    { name: "Finish" },
    { name: "Color" },
    { name: "Size" },
    { name: "Packaging" },
    { name: "Durability" },
    { name: "Application Surface" },
    { name: "Resistance" },
    { name: "Coverage" },
    { name: "Drying Time" },
    { name: "Washability" },
    { name: "Safety" },
    { name: "Price Range" },
  ];

  for (const p of propertyNames) {
    await prisma.propertyName.create({
      data: {
        name: p.name,
        propertyNameTranslations: {
          create: [
            {
              locale: "US",
              name: p.name,
            },
            {
              locale: "RU",
              name:
                p.name === "Brand"
                  ? "Бренд"
                  : p.name === "Finish"
                    ? "Финиш"
                    : p.name === "Color"
                      ? "Цвет"
                      : p.name === "Size"
                        ? "Размер"
                        : p.name === "Packaging"
                          ? "Упаковка"
                          : p.name === "Durability"
                            ? "Прочность"
                            : p.name === "Application Surface"
                              ? "Поверхность применения"
                              : p.name === "Resistance"
                                ? "Сопротивляемость"
                                : p.name === "Coverage"
                                  ? "Покрытие"
                                  : p.name === "Drying Time"
                                    ? "Время высыхания"
                                    : p.name === "Washability"
                                      ? "Смываемость"
                                      : p.name === "Safety"
                                        ? "Безопасность"
                                        : p.name === "Price Range"
                                          ? "Ценовой диапазон"
                                          : p.name,
            },
            {
              locale: "TM",
              name:
                p.name === "Brand"
                  ? "Brend"
                  : p.name === "Finish"
                    ? "Görünşi"
                    : p.name === "Color"
                      ? "Reňk"
                      : p.name === "Size"
                        ? "Ölçegi"
                        : p.name === "Packaging"
                          ? "Gaplama"
                          : p.name === "Durability"
                            ? "Durnuklylyk"
                            : p.name === "Application Surface"
                              ? "Ulanyş ýüzü"
                              : p.name === "Resistance"
                                ? "Çydamlylyk"
                                : p.name === "Coverage"
                                  ? "Örtügi"
                                  : p.name === "Drying Time"
                                    ? "Gurama wagty"
                                    : p.name === "Washability"
                                      ? "Ýuwulýanlyk"
                                      : p.name === "Safety"
                                        ? "Howpsuzlyk"
                                        : p.name === "Price Range"
                                          ? "Bahalar aralygy"
                                          : p.name,
            },
          ],
        },
      },
    });
  }

  async function createShippingMethods() {
    const methods = [
      { name: "Passenger Car", cost: 5, vehicle: "PASSENGER_CAR" },
      { name: "Light Truck", cost: 15, vehicle: "LIGHT_TRUCK" },
    ];

    for (const method of methods) {
      await prisma.shippingMethod.upsert({
        where: { name: method.name },
        update: {},
        create: {
          name: method.name,
          fee: new Decimal(method.cost),
          vehicle: method.vehicle as "PASSENGER_CAR" | "LIGHT_TRUCK" | null,
          isActive: true,
        },
      });
    }
  }

  await createShippingMethods();

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
