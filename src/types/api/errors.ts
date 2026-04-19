/**
 * API Error Types
 * Custom error handling and type-safe error responses
 */

/**
 * API Error Codes
 * Standardized error codes for consistent error handling
 */
export enum ApiErrorCode {
  // Authentication
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",

  // Validation
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",

  // Resource
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",

  // Server
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",

  // Network
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT = "TIMEOUT",

  // Business Logic
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  INVALID_COUPON = "INVALID_COUPON",
  ORDER_CREATION_FAILED = "ORDER_CREATION_FAILED",

  // Generic
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * HTTP Status Codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Custom API Error class
 * Provides type-safe error handling with standardized structure
 */
export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    public message: string,
    public statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = "ApiError";

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Check if error is of specific code
   */
  isCode(code: ApiErrorCode): boolean {
    return this.code === code;
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    return [
      ApiErrorCode.UNAUTHORIZED,
      ApiErrorCode.TOKEN_EXPIRED,
      ApiErrorCode.INVALID_CREDENTIALS,
    ].includes(this.code);
  }

  /**
   * Check if error is validation related
   */
  isValidationError(): boolean {
    return [ApiErrorCode.VALIDATION_ERROR, ApiErrorCode.INVALID_INPUT].includes(
      this.code,
    );
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * User-friendly error message
   */
  getUserMessage(): string {
    const messages: Record<ApiErrorCode, string> = {
      [ApiErrorCode.UNAUTHORIZED]: "Please sign in to continue",
      [ApiErrorCode.FORBIDDEN]:
        "You don't have permission to perform this action",
      [ApiErrorCode.TOKEN_EXPIRED]:
        "Your session has expired. Please sign in again",
      [ApiErrorCode.INVALID_CREDENTIALS]: "Invalid email or password",
      [ApiErrorCode.VALIDATION_ERROR]: "Please check your input and try again",
      [ApiErrorCode.INVALID_INPUT]: "Invalid input provided",
      [ApiErrorCode.NOT_FOUND]: "The requested resource was not found",
      [ApiErrorCode.CONFLICT]: "This resource already exists",
      [ApiErrorCode.INTERNAL_SERVER_ERROR]:
        "Something went wrong. Please try again later",
      [ApiErrorCode.SERVICE_UNAVAILABLE]: "Service is temporarily unavailable",
      [ApiErrorCode.NETWORK_ERROR]:
        "Network error. Please check your connection",
      [ApiErrorCode.TIMEOUT]: "Request timed out. Please try again",
      [ApiErrorCode.INSUFFICIENT_STOCK]: "Insufficient stock available",
      [ApiErrorCode.INVALID_COUPON]: "The coupon code is invalid or expired",
      [ApiErrorCode.ORDER_CREATION_FAILED]:
        "Failed to create order. Please try again",
      [ApiErrorCode.UNKNOWN_ERROR]: "An unexpected error occurred",
    };

    return messages[this.code] || this.message;
  }
}

/**
 * Type guard to check if unknown error is ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard to check if unknown error is Error
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Convert unknown error to ApiError
 */
export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (isError(error)) {
    return new ApiError(
      ApiErrorCode.UNKNOWN_ERROR,
      error.message || "An unexpected error occurred",
    );
  }

  return new ApiError(
    ApiErrorCode.UNKNOWN_ERROR,
    "An unexpected error occurred",
  );
}

/**
 * Validation Error Details
 */
export interface ValidationErrorDetails {
  field: string;
  message: string;
  value?: any;
}

/**
 * API Error with validation details
 */
export class ValidationError extends ApiError {
  constructor(
    message: string,
    public fieldErrors: ValidationErrorDetails[],
  ) {
    super(
      ApiErrorCode.VALIDATION_ERROR,
      message,
      HttpStatus.UNPROCESSABLE_ENTITY,
      { fieldErrors },
    );
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  /**
   * Get field error message
   */
  getFieldError(field: string): ValidationErrorDetails | undefined {
    return this.fieldErrors.find((e) => e.field === field);
  }
}

/**
 * Type guard for ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
