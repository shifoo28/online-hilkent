import {
  Discount,
  ProductImage,
  ProductProperty,
  ProductTranslation,
  Review,
  Locale,
} from "@prisma/client";

export type Product = {
  id: string;
  price: number;
  discountedPrice: number;
  categoryId: number;
  inStock: boolean;
  rating: number;
  salesCount?: number;
  reviews: Review[];
  properties: ProductPropertyWithTranslations[];
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

export type ProductPropertyWithTranslations = ProductProperty & {
  name: {
    id: number;
    name: string;
    propertyNameTranslations: Array<{
      id: number;
      propertyNameId: number;
      name: string;
      locale: Locale;
    }>;
  };
};
