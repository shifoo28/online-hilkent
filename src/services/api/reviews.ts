/**
 * Reviews Service
 * All review-related API calls with full type safety
 */

import { apiClient } from "./client";
import {
  ReviewResponse,
  ReviewQueryParams,
  CreateReviewRequest,
  UpdateReviewRequest,
  PaginatedApiResponse,
  ApiResponse,
  getPaginationQuery,
  validatePaginationParams,
} from "@/types/api";

/**
 * Get reviews with filters and pagination
 */
export async function getReviews(
  params?: ReviewQueryParams,
): Promise<PaginatedApiResponse<ReviewResponse>> {
  const pagination = validatePaginationParams(params?.page, params?.pageSize);
  const query = getPaginationQuery(pagination.page, pagination.pageSize, {
    productId: params?.productId,
    userId: params?.userId,
    sortBy: params?.sortBy,
  });

  return apiClient.get<PaginatedApiResponse<ReviewResponse>>(
    `/api/reviews?${query.toString()}`,
  );
}

/**
 * Get reviews for a specific product
 */
export async function getProductReviews(
  productId: string,
  params?: Omit<ReviewQueryParams, "productId">,
): Promise<PaginatedApiResponse<ReviewResponse>> {
  const pagination = validatePaginationParams(params?.page, params?.pageSize);
  const query = getPaginationQuery(pagination.page, pagination.pageSize, {
    productId,
    sortBy: params?.sortBy,
  });

  return apiClient.get<PaginatedApiResponse<ReviewResponse>>(
    `/api/reviews?${query.toString()}`,
  );
}

/**
 * Get reviews by a specific user
 */
export async function getUserReviews(
  userId: string,
  params?: Omit<ReviewQueryParams, "userId">,
): Promise<PaginatedApiResponse<ReviewResponse>> {
  const pagination = validatePaginationParams(params?.page, params?.pageSize);
  const query = getPaginationQuery(pagination.page, pagination.pageSize, {
    userId,
    sortBy: params?.sortBy,
  });

  return apiClient.get<PaginatedApiResponse<ReviewResponse>>(
    `/api/reviews?${query.toString()}`,
  );
}

/**
 * Get single review by ID
 */
export async function getReview(
  reviewId: string,
): Promise<ApiResponse<ReviewResponse>> {
  return apiClient.get<ApiResponse<ReviewResponse>>(`/api/reviews/${reviewId}`);
}

/**
 * Create a new review
 */
export async function createReview(
  payload: CreateReviewRequest,
): Promise<ApiResponse<ReviewResponse>> {
  return apiClient.post<ApiResponse<ReviewResponse>>("/api/reviews", payload);
}

/**
 * Update an existing review
 */
export async function updateReview(
  reviewId: string,
  payload: UpdateReviewRequest,
): Promise<ApiResponse<ReviewResponse>> {
  return apiClient.put<ApiResponse<ReviewResponse>>(
    `/api/reviews/${reviewId}`,
    payload,
  );
}

/**
 * Delete a review
 */
export async function deleteReview(
  reviewId: string,
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<ApiResponse<{ message: string }>>(
    `/api/reviews/${reviewId}`,
  );
}

/**
 * Mark review as helpful
 */
export async function markReviewHelpful(
  reviewId: string,
): Promise<ApiResponse<ReviewResponse>> {
  return apiClient.post<ApiResponse<ReviewResponse>>(
    `/api/reviews/${reviewId}/helpful`,
  );
}
