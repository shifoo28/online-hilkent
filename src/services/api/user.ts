/**
 * User Service
 * All user-related API calls with full type safety
 */

import { apiClient } from "./client";
import {
  UserResponse,
  UpdateUserRequest,
  UpdatePasswordRequest,
  ApiResponse,
} from "@/types/api";

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<ApiResponse<UserResponse>> {
  return apiClient.get<ApiResponse<UserResponse>>("/api/user");
}

/**
 * Get user by ID
 */
export async function getUserById(
  userId: string,
): Promise<ApiResponse<UserResponse>> {
  return apiClient.get<ApiResponse<UserResponse>>(`/api/user/${userId}`);
}

/**
 * Update user profile
 */
export async function updateUser(
  payload: UpdateUserRequest,
): Promise<ApiResponse<UserResponse>> {
  return apiClient.put<ApiResponse<UserResponse>>("/api/user", payload);
}

/**
 * Update user password
 */
export async function updatePassword(
  payload: UpdatePasswordRequest,
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.post<ApiResponse<{ message: string }>>(
    "/api/user/change-password",
    payload,
  );
}

/**
 * Delete user account
 */
export async function deleteAccount(): Promise<
  ApiResponse<{ message: string }>
> {
  return apiClient.delete<ApiResponse<{ message: string }>>("/api/user");
}
