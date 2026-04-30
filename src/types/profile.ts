export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  address: string;
  stats: {
    orders: number;
    reviews: number;
  };
  recentActivity: {
    type: "order" | "review" | "wishlist";
    description: string;
    date: string;
  }[];
  createdAt: Date;
}
