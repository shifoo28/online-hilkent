// Provides helper functions and Prisma queries for the e-commerce app:
// - calculateDiscountedPrice: applies percentage or fixed discounts safely
// - mapPrismaProduct: converts raw Prisma product data into typed Product objects
// - mapPrismaHeroProduct: maps hero product entries with linked product data
// - getProducts / getHeroProducts / getProductById: fetch products with relations

import prisma from "@/lib/prisma";
import { Product } from "@/types/product";
import { Discount, HeroProduct } from "@prisma/client";

function calculateDiscountedPrice(
  price: number,
  discounts: Discount[] = [],
): number {
  const discount = discounts?.[0];
  if (!discount) return price;

  if (discount.type === "PERCENTAGE") {
    return Math.max(0, Math.round(price * (1 - discount.value / 100)));
  }

  if (discount.type === "FIXED") {
    return Math.max(0, price - discount.value);
  }

  return price;
}

export function mapPrismaProduct(product: any): Product {
  return {
    id: product.id,
    price: product.price,
    discountedPrice: calculateDiscountedPrice(
      product.price,
      product.Discounts || [],
    ),
    categoryId: product.categoryId,
    inStock: product.inStock,
    rating: product.rating,
    salesCount: product.salesCount ?? 0,
    reviews: product.Reviews || [],
    discounts: product.Discounts || [],
    properties: product.Properties || [],
    translations: product.Translations || [],
    images: product.Images || [],
  };
}

export function mapPrismaHeroProduct(
  heroProduct: any,
): HeroProduct & { product: Product | null } {
  return {
    id: heroProduct.id,
    productId: heroProduct.productId,
    isSlider: heroProduct.isSlider,
    headline: heroProduct.headline,
    subline: heroProduct.subline,
    image: heroProduct.image,
    position: heroProduct.position,
    createdAt: heroProduct.createdAt,
    updatedAt: heroProduct.updatedAt,
    product: heroProduct.product ? mapPrismaProduct(heroProduct.product) : null,
  };
}

// export async function getProducts(): Promise<Product[]> {
//   const products = await prisma.product.findMany({
//     include: {
//       Reviews: {
//         include: {
//           user: true,
//         },
//       },
//       Images: true,
//       Discounts: true,
//       Properties: true,
//       Translations: true,
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   return products.map(mapPrismaProduct);
// }

// export async function getProductById(id: string): Promise<Product | null> {
//   const product = await prisma.product.findUnique({
//     where: { id },
//     include: {
//       Reviews: {
//         include: {
//           user: true,
//         },
//       },
//       Images: true,
//       Discounts: true,
//       Properties: true,
//       Translations: true,
//     },
//   });
//   if (!product) return null;
//   return mapPrismaProduct(product);
// }

export async function getHeroProducts(): Promise<
  (HeroProduct & { product: Product | null })[]
> {
  const heroProducts = await prisma.heroProduct.findMany({
    include: {
      product: {
        include: {
          Discounts: true,
        },
      },
    },
  });

  return heroProducts.map(mapPrismaHeroProduct);
}

export type { Product } from "@/types/product";
