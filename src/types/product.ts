export type Product = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  image?: string;
  description?: string;
  category?: string;
  inStock?: boolean;
  rating?: number;
  reviewCount: number;
};
