import prisma from "@/lib/prisma";
import { Product } from "@/types/product";

const DEFAULT_IMAGE = "/images/products/default-product.png";

export function mapPrismaProduct(product: any): Product {
  const image = product.image ?? DEFAULT_IMAGE;
  const previews = [image];
  const thumbnails = [image];

  return {
    id: product.id,
    title: product.name,
    price: product.price,
    discountedPrice: product.price,
    imgs: {
      thumbnails,
      previews,
    },
    // keep additional fields for downstream usage
    image,
    description: product.description,
    category: product.category,
    inStock: product.inStock,
    rating: product.rating,
  } as Product;
}

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      _count: {
        select: { reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return products.map(mapPrismaProduct);
}

export async function getProductById(id: number): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      _count: {
        select: { reviews: true },
      },
    },
  });
  if (!product) return null;
  return mapPrismaProduct(product);
}

export type { Product } from "@/types/product";
