export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  bio: string;
  stats: {
    orders: number;
    reviewCount: number;
    wishlist: number;
  };
  recentActivity: {
    type: "order" | "review" | "wishlist";
    description: string;
    date: string;
  }[];
}
