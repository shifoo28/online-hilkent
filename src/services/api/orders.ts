/**
 * Orders Service
 * All order-related API calls with full type safety
 */

import { apiClient } from "./client";
import {
  OrderResponse,
  OrderQueryParams,
  CreateOrderRequest,
  UpdateOrderRequest,
  PaginatedApiResponse,
  ApiResponse,
  getPaginationQuery,
  validatePaginationParams,
} from "@/types/api";

/**
 * Get user's orders with pagination and filters
 */
export async function getOrders(
  params?: OrderQueryParams,
): Promise<PaginatedApiResponse<OrderResponse>> {
  const pagination = validatePaginationParams(params?.page, params?.pageSize);
  const query = getPaginationQuery(pagination.page, pagination.pageSize, {
    userId: params?.userId,
    status: params?.status,
    sortBy: params?.sortBy,
  });

  return apiClient.get<PaginatedApiResponse<OrderResponse>>(
    `/api/orders?${query.toString()}`,
  );
}

/**
 * Get single order by ID
 */
export async function getOrder(
  orderId: string,
): Promise<ApiResponse<OrderResponse>> {
  return apiClient.get<ApiResponse<OrderResponse>>(`/api/orders/${orderId}`);
}

/**
 * Create new order
 */
export async function createOrder(
  payload: CreateOrderRequest,
): Promise<ApiResponse<OrderResponse>> {
  return apiClient.post<ApiResponse<OrderResponse>>("/api/orders", payload);
}

/**
 * Update order status (admin only)
 */
export async function updateOrder(
  orderId: string,
  payload: UpdateOrderRequest,
): Promise<ApiResponse<OrderResponse>> {
  return apiClient.put<ApiResponse<OrderResponse>>(
    `/api/orders/${orderId}`,
    payload,
  );
}

/**
 * Cancel order
 */
export async function cancelOrder(
  orderId: string,
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post<ApiResponse<{ message: string }>>(
    `/api/orders/${orderId}/cancel`,
  );
}

/**
 * Get order receipt/invoice
 */
export async function getOrderReceipt(
  orderId: string,
): Promise<ApiResponse<{ receiptUrl: string }>> {
  return apiClient.get<ApiResponse<{ receiptUrl: string }>>(
    `/api/orders/${orderId}/receipt`,
  );
}

/**
 * Track order
 */
export async function trackOrder(orderId: string): Promise<
  ApiResponse<{
    status: string;
    trackingNumber: string;
    estimatedDelivery: string;
    lastUpdate: string;
  }>
> {
  return apiClient.get<
    ApiResponse<{
      status: string;
      trackingNumber: string;
      estimatedDelivery: string;
      lastUpdate: string;
    }>
  >(`/api/orders/${orderId}/track`);
}
