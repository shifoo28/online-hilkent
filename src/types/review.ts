export type Review = {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
};