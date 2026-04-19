export interface UserProfile {
  address: string;
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  stats: {
    orders: number;
    reviewCount: number;
  };
  recentActivity: {
    type: "order" | "review" | "wishlist";
    description: string;
    date: string;
  }[];
  createdAt: Date;
}
