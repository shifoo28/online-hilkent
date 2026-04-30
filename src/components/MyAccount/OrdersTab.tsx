"use client";

import { UserProfile } from "@/types/profile";
import Orders from "../Orders";

interface OrdersTabProps {
  // TODO: Replace with proper User type from auth context
  user: UserProfile;
}

// TODO: Pass user info from MyAccount to OrdersTab if needed for API calls
export default function OrdersTab({ user }: OrdersTabProps) {
  return (
    <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1">
      <Orders user={user} />
    </div>
  );
}
