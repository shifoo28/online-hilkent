/**
 * Shipping Methods Service
 * API calls for shipping methods
 */

import { apiClient } from "./client";
import { ApiResponse } from "@/types/api";

export interface ShippingMethodResponse {
  id: number;
  name: string;
  cost: string;
  vehicle?: string | null;
  isActive: boolean;
}

/**
 * Get all active shipping methods
 */
export async function getShippingMethods(): Promise<
  ApiResponse<ShippingMethodResponse[]>
> {
  return apiClient.get<ApiResponse<ShippingMethodResponse[]>>(
    "/api/shipping-methods",
  );
}
