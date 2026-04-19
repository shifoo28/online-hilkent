/**
 * Products Service
 * All product-related API calls with full type safety
 */

import { apiClient } from "./client";
import {
  ProductResponse,
  ProductQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  PaginatedApiResponse,
  ApiResponse,
  getPaginationQuery,
  validatePaginationParams,
} from "@/types/api";

/**
 * Get all products with pagination and filters
 */
export async function getProducts(
  params?: ProductQueryParams,
): Promise<PaginatedApiResponse<ProductResponse>> {
  const pagination = validatePaginationParams(params?.page, params?.pageSize);
  const query = getPaginationQuery(pagination.page, pagination.pageSize, {
    categoryId: params?.categoryId,
    search: params?.search,
    sortBy: params?.sortBy,
    minPrice: params?.minPrice,
    maxPrice: params?.maxPrice,
    inStock: params?.inStock,
  });

  return apiClient.get<PaginatedApiResponse<ProductResponse>>(
    `/api/products?${query.toString()}`,
  );
}

/**
 * Get single product by ID
 */
export async function getProduct(
  productId: string,
): Promise<ApiResponse<ProductResponse>> {
  return apiClient.get<ApiResponse<ProductResponse>>(
    `/api/products/${productId}`,
  );
}

/**
 * Get product by ID (query parameter version)
 */
export async function getProductByIdQuery(
  productId: string,
): Promise<ApiResponse<ProductResponse>> {
  return apiClient.get<ApiResponse<ProductResponse>>(
    `/api/products?id=${encodeURIComponent(productId)}`,
  );
}

/**
 * Create new product (admin only)
 */
export async function createProduct(
  payload: CreateProductRequest,
): Promise<ApiResponse<ProductResponse>> {
  return apiClient.post<ApiResponse<ProductResponse>>("/api/products", payload);
}

/**
 * Update product (admin only)
 */
export async function updateProduct(
  productId: string,
  payload: UpdateProductRequest,
): Promise<ApiResponse<ProductResponse>> {
  return apiClient.put<ApiResponse<ProductResponse>>(
    `/api/products/${productId}`,
    payload,
  );
}

/**
 * Delete product (admin only)
 */
export async function deleteProduct(
  productId: string,
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<ApiResponse<{ message: string }>>(
    `/api/products/${productId}`,
  );
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(
  limit: number = 10,
): Promise<ApiResponse<ProductResponse[]>> {
  return apiClient.get<ApiResponse<ProductResponse[]>>(
    `/api/products?isFeatured=true&pageSize=${limit}`,
  );
}

/**
 * Get new products
 */
export async function getNewProducts(
  limit: number = 10,
): Promise<ApiResponse<ProductResponse[]>> {
  return apiClient.get<ApiResponse<ProductResponse[]>>(
    `/api/products?isNew=true&pageSize=${limit}`,
  );
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  categoryId: string,
  params?: ProductQueryParams,
): Promise<PaginatedApiResponse<ProductResponse>> {
  const pagination = validatePaginationParams(params?.page, params?.pageSize);
  const query = getPaginationQuery(pagination.page, pagination.pageSize, {
    categoryId,
    sortBy: params?.sortBy,
    minPrice: params?.minPrice,
    maxPrice: params?.maxPrice,
  });

  return apiClient.get<PaginatedApiResponse<ProductResponse>>(
    `/api/products?${query.toString()}`,
  );
}

/**
 * Search products
 */
export async function searchProducts(
  searchTerm: string,
  params?: ProductQueryParams,
): Promise<PaginatedApiResponse<ProductResponse>> {
  const pagination = validatePaginationParams(params?.page, params?.pageSize);
  const query = getPaginationQuery(pagination.page, pagination.pageSize, {
    search: searchTerm,
    sortBy: params?.sortBy,
    minPrice: params?.minPrice,
    maxPrice: params?.maxPrice,
  });

  return apiClient.get<PaginatedApiResponse<ProductResponse>>(
    `/api/products?${query.toString()}`,
  );
}
