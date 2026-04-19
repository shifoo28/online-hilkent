/**
 * Standard API Response Types
 * All API responses should follow these envelope types for consistency
 */

/**
 * Standard API Response Envelope
 * Wraps all successful API responses with consistent structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

/**
 * Paginated API Response
 * For endpoints that support pagination
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * Error Response from API
 * Standard error response structure
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

/**
 * Auth Response
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
  };
}

/**
 * User Response
 */
export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatar: string | null;
  role: "USER" | "ADMIN" | "VENDOR";
  createdAt: string;
  updatedAt: string;
}

/**
 * Product Response
 */
export interface ProductResponse {
  id: string;
  sku: string;
  price: number;
  oldPrice?: number;
  reviewCount: number;
  averageRating: number;
  quantity: number;
  isFeatured: boolean;
  isNew: boolean;
  Translations: Array<{
    locale: string;
    name: string;
    description: string | null;
    slug: string;
  }>;
  images: string[];
  categories: Array<{
    id: string;
    Translations: Array<{
      locale: string;
      name: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Review Response
 */
export interface ReviewResponse {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  product: {
    id: string;
    Translations: Array<{
      name: string;
      locale: string;
    }>;
  };
}

/**
 * Order Response
 */
export interface OrderResponse {
  id: string;
  userId: string;
  orderNumber: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount?: number;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      Translations: Array<{
        name: string;
        locale: string;
      }>;
    };
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Category Response
 */
export interface CategoryResponse {
  id: string;
  slug: string;
  image?: string;
  Translations: Array<{
    locale: string;
    name: string;
    description?: string;
  }>;
  _count?: {
    products: number;
  };
}

/**
 * Address Response
 */
export interface AddressResponse {
  id: string;
  userId: string;
  type: "SHIPPING" | "BILLING";
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Coupon Response
 */
export interface CouponResponse {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue?: number;
  maxUses?: number;
  currentUses: number;
  expiresAt: string;
  isActive: boolean;
}
