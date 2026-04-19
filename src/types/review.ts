import { Product, User } from "@prisma/client";

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  product: Product;
};
