/**
 * API Request Types (DTOs)
 * Type-safe request bodies and query parameters
 */

// ============================================================================
// AUTH REQUESTS
// ============================================================================

export interface SignInRequest {
  phone: number;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  phone: number;
  password: string;
  confirmPassword: string;
}

export interface SendOtpRequest {
  phone: number;
}

export interface VerifyOtpRequest {
  phone: number;
  otp: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================================================
// USER REQUESTS
// ============================================================================

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// ============================================================================
// REVIEW REQUESTS
// ============================================================================

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

export interface ReviewQueryParams {
  productId?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "recent" | "helpful" | "rating";
}

// ============================================================================
// ORDER REQUESTS
// ============================================================================

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddressId?: string;
  billingAddressId?: string;
  couponCode?: string;
  shippingMethodId?: number;
  shippingCost?: number;
}

export interface UpdateOrderRequest {
  status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

export interface OrderQueryParams {
  userId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "recent" | "oldest" | "priceAsc" | "priceDesc";
}

// ============================================================================
// PRODUCT REQUESTS
// ============================================================================

export interface ProductQueryParams {
  id?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "recent" | "popular" | "priceAsc" | "priceDesc" | "rating";
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface CreateProductRequest {
  sku: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  isFeatured?: boolean;
  isNew?: boolean;
  categoryIds: string[];
  translations: Array<{
    locale: string;
    name: string;
    description?: string;
    slug: string;
  }>;
  images?: string[];
}

export interface UpdateProductRequest {
  sku?: string;
  price?: number;
  oldPrice?: number;
  quantity?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  categoryIds?: string[];
  translations?: Array<{
    locale: string;
    name: string;
    description?: string;
    slug: string;
  }>;
  images?: string[];
}

// ============================================================================
// ADDRESS REQUESTS
// ============================================================================

export interface CreateAddressRequest {
  type: "SHIPPING" | "BILLING";
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  type?: "SHIPPING" | "BILLING";
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

// ============================================================================
// CATEGORY REQUESTS
// ============================================================================

export interface CreateCategoryRequest {
  slug: string;
  image?: string;
  translations: Array<{
    locale: string;
    name: string;
    description?: string;
  }>;
}

export interface UpdateCategoryRequest {
  slug?: string;
  image?: string;
  translations?: Array<{
    locale: string;
    name: string;
    description?: string;
  }>;
}

// ============================================================================
// COUPON REQUESTS
// ============================================================================

export interface ValidateCouponRequest {
  code: string;
  orderTotal: number;
}

export interface CreateCouponRequest {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue?: number;
  maxUses?: number;
  expiresAt: string;
}

// ============================================================================
// SEARCH REQUESTS
// ============================================================================

export interface SearchQueryParams {
  q: string;
  type?: "products" | "categories" | "all";
  page?: number;
  pageSize?: number;
}
