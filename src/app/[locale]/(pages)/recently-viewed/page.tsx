import React from "react";
import RecentlyViewedItems from "@/components/ShopDetails/RecentlyViewed";
import { Metadata } from "next";
import { RecentlyViewed } from "@/components/RecentlyViewed";

export const metadata: Metadata = {
  title: "Recently Viewed | Hilkent Nextjs E-commerce web app",
  description: "Browse your recently viewed products.",
};

const RecentlyViewedPage = () => {
  return (
    <main>
      <RecentlyViewed />
    </main>
  );
};

export default RecentlyViewedPage;
