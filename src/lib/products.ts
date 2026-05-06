import prisma from "@/lib/prisma";
import { Product } from "@/types/product";
import { HeroProduct } from "@prisma/client";

export function mapPrismaProduct(product: any): Product {
  return {
    id: product.id,
    price: product.price,
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

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      Reviews: {
        include: {
          user: true,
        },
      },
      Images: true,
      Discounts: true,
      Properties: true,
      Translations: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapPrismaProduct);
}

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

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      Reviews: {
        include: {
          user: true,
        },
      },
      Images: true,
      Discounts: true,
      Properties: true,
      Translations: true,
    },
  });
  if (!product) return null;
  return mapPrismaProduct(product);
}

export type { Product } from "@/types/product";
