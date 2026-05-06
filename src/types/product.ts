import {
  Discount,
  ProductImage,
  ProductProperty,
  ProductTranslation,
  Review,
} from "@prisma/client";

export type Product = {
  id: string;
  price: number;
  categoryId: number;
  inStock: boolean;
  rating: number;
  salesCount?: number;
  reviews: Review[];
  properties: ProductProperty[];
  translations: ProductTranslation[];
  discounts: Discount[];
  images: ProductImage[];
};

export type HeroProduct = {
  id: number;
  productId: string;
  isSlider: boolean;
  headline?: string;
  subline?: string;
  image: string;
  position: number;
  product?: Product | null;
};
