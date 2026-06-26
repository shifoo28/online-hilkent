/**
 * API Services Hub
 * Export all API service functions
 */

export * as authService from "./auth";
export * as userService from "./user";
export * as productsService from "./products";
export * as reviewsService from "./reviews";
export * as contactService from "./contact";
export * as ordersService from "./orders";
export * as shippingService from "./shipping";

export {
  apiClient,
  type RequestInterceptor,
  type ResponseInterceptor,
  type ErrorInterceptor,
} from "./client";
