"use client";

import { useWishlist } from "@/context/WishlistContext";
import { UserProfile } from "@/types/profile";
import { useTranslations } from "next-intl";

interface DashboardTabProps {
  user: UserProfile | null;
  handleLogout: () => void;
}

export default function DashboardTab({
  user,
  handleLogout,
}: DashboardTabProps) {
  const translate = useTranslations("Account.details.dashboard");
  const { items : wishlistItems } = useWishlist(); // Placeholder for potential future use of wishlist data in the dashboard metrics

  return (
    <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 py-9.5 px-4 sm:px-7.5 xl:px-10">
      <p className="text-dark">
        {translate("greeting", { name: user?.name || "User" })}
        <button
          type="button"
          onClick={handleLogout}
          className="text-red ease-out duration-200 hover:underline"
        >
          {translate("logout")}
        </button>
      </p>

      <p className="text-custom-sm mt-4">{translate("info")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 pt-9">
        <div className="text-center p-4 bg-gray-1 rounded-lg">
          <div className="text-2xl font-bold text-blue mb-1">
            {user?.stats?.orders || 0}
          </div>
          <div className="text-custom-sm text-dark-2">
            {translate("metrics.totalOrders")}
          </div>
        </div>

        <div className="text-center p-4 bg-gray-1 rounded-lg">
          <div className="text-2xl font-bold text-blue mb-1">
            {user?.stats?.reviews || 0}
          </div>
          <div className="text-custom-sm text-dark-2">
            {translate("metrics.reviews")}
          </div>
        </div>

        <div className="text-center p-4 bg-gray-1 rounded-lg">
          <div className="text-2xl font-bold text-blue mb-1">{wishlistItems.length || 0}</div>
          <div className="text-custom-sm text-dark-2">
            {translate("metrics.wishlistItems")}
          </div>
        </div>
      </div>
    </div>
  );
}
