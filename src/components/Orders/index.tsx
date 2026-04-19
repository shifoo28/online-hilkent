"use client";

import React from "react";
import SingleOrder from "./SingleOrder";
import { useApiData } from "@/hooks/useApiCall";
import { useApiError } from "@/hooks/useApiError";
import { ordersService } from "@/services/api";
import type { OrderResponse } from "@/types/api";

/**
 * Orders Component
 * Displays user's orders with type-safe API integration
 */
const Orders = () => {
  const { handleError } = useApiError();

  // Fetch orders with full type safety
  // Note: In a real app, get userId from auth context or session
  const {
    data: ordersResponse,
    loading,
    error,
  } = useApiData(() => ordersService.getOrders({ page: 1, pageSize: 50 }), [], {
    onError: (error) => {
      handleError(error, {
        showToast: true,
        userMessage: "Failed to load orders",
      });
    },
  });

  // Extract typed orders data
  const orders: OrderResponse[] = ordersResponse?.data ?? [];

  if (loading) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[770px] space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="items-center justify-between py-4.5 px-7.5 hidden md:flex bg-gray-1 animate-pulse"
            >
              <div className="min-w-[111px] h-4 bg-gray-3 rounded"></div>
              <div className="min-w-[175px] h-4 bg-gray-3 rounded"></div>
              <div className="min-w-[128px] h-4 bg-gray-3 rounded"></div>
              <div className="min-w-[113px] h-4 bg-gray-3 rounded"></div>
              <div className="min-w-[86px] h-4 bg-gray-3 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red rounded-lg">
        <p className="text-red font-medium">{error.getUserMessage()}</p>
        <p className="text-red-600 text-sm mt-2">
          {error.details?.message || "Please try again later"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[770px]">
        {/* Order Header */}
        {orders.length > 0 && (
          <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex">
            <div className="min-w-[111px]">
              <p className="text-custom-sm text-dark font-medium">
                Order Number
              </p>
            </div>
            <div className="min-w-[175px]">
              <p className="text-custom-sm text-dark font-medium">Date</p>
            </div>
            <div className="min-w-[128px]">
              <p className="text-custom-sm text-dark font-medium">Status</p>
            </div>
            <div className="min-w-[113px]">
              <p className="text-custom-sm text-dark font-medium">Total</p>
            </div>
            <div className="min-w-[86px]">
              <p className="text-custom-sm text-dark font-medium">Action</p>
            </div>
          </div>
        )}

        {/* Orders List or Empty State */}
        {orders.length > 0 ? (
          <>
            {/* Desktop View */}
            <div className="hidden md:block">
              {orders.map((order: OrderResponse) => (
                <SingleOrder
                  key={order.id}
                  orderItem={order}
                  smallView={false}
                />
              ))}
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {orders.map((order: OrderResponse) => (
                <SingleOrder
                  key={order.id}
                  orderItem={order}
                  smallView={true}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-dark-2">You don&apos;t have any orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
