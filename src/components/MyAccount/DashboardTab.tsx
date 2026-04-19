"use client";

import { UserProfile } from "@/types/profile";

interface DashboardTabProps {
  user: UserProfile | null;
  handleLogout: () => void;
}

export default function DashboardTab({
  user,
  handleLogout,
}: DashboardTabProps) {
  return (
    <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 py-9.5 px-4 sm:px-7.5 xl:px-10">
      <p className="text-dark">
        Hello {user?.name || "Annie"} (not {user?.name || "Annie"}?
        <button
          type="button"
          onClick={handleLogout}
          className="text-red ease-out duration-200 hover:underline"
        >
          Log Out
        </button>
        )
      </p>

      <p className="text-custom-sm mt-4">
        From your account dashboard you can view your recent orders, manage your
        shipping and billing addresses, and edit your password and account
        details.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 pt-9">
        <div className="text-center p-4 bg-gray-1 rounded-lg">
          <div className="text-2xl font-bold text-blue mb-1">
            {user?.stats?.orders || 0}
          </div>
          <div className="text-custom-sm text-dark-2">Total Orders</div>
        </div>

        <div className="text-center p-4 bg-gray-1 rounded-lg">
          <div className="text-2xl font-bold text-blue mb-1">
            {user?.stats?.reviewCount || 0}
          </div>
          <div className="text-custom-sm text-dark-2">Reviews</div>
        </div>

        <div className="text-center p-4 bg-gray-1 rounded-lg">
          <div className="text-2xl font-bold text-blue mb-1">{0 || 0}</div>
          <div className="text-custom-sm text-dark-2">Wishlist Items</div>
        </div>
      </div>
    </div>
  );
}
