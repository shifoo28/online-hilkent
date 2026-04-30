/**
 * API Client
 * Centralized HTTP client with type safety, error handling, and request/response interceptors
 */

import type { ApiResponse } from "@/types/api/responses";
import {
  ApiError,
  ApiErrorCode,
  HttpStatus,
  toApiError,
} from "@/types/api/errors";

/**
 * Request interceptor signature
 */
export type RequestInterceptor = (
  config: RequestInit,
) => Promise<RequestInit> | RequestInit;

/**
 * Response interceptor signature
 */
export type ResponseInterceptor<T> = (
  response: Response,
  data: T,
) => Promise<T> | T;

/**
 * Error interceptor signature
 */
export type ErrorInterceptor = (
  error: ApiError,
) => Promise<ApiError> | ApiError;

/**
 * API Client Configuration
 */
interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

/**
 * API Client
 * Main HTTP client for all API operations
 */
class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: Map<
    string | symbol,
    ResponseInterceptor<any>[]
  > = new Map();
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.defaultHeaders,
    };
  }

  /**
   * Add a request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor for a specific response type
   */
  addResponseInterceptor<T>(
    responseType: string | symbol,
    interceptor: ResponseInterceptor<T>,
  ): void {
    if (!this.responseInterceptors.has(responseType)) {
      this.responseInterceptors.set(responseType, []);
    }
    this.responseInterceptors.get(responseType)!.push(interceptor as any);
  }

  /**
   * Add an error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Execute request interceptors
   */
  private async executeRequestInterceptors(
    config: RequestInit,
  ): Promise<RequestInit> {
    let finalConfig = config;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    return finalConfig;
  }

  /**
   * Execute response interceptors
   */
  private async executeResponseInterceptors<T>(
    response: Response,
    data: T,
    responseType: string | symbol,
  ): Promise<T> {
    const interceptors = this.responseInterceptors.get(responseType);
    if (!interceptors) return data;

    let finalData = data;
    for (const interceptor of interceptors) {
      finalData = await interceptor(response, finalData);
    }
    return finalData;
  }

  /**
   * Execute error interceptors
   */
  private async executeErrorInterceptors(error: ApiError): Promise<ApiError> {
    let finalError = error;
    for (const interceptor of this.errorInterceptors) {
      finalError = await interceptor(finalError);
    }
    return finalError;
  }

  /**
   * Parse error response
   */
  private async parseErrorResponse(response: Response): Promise<ApiError> {
    try {
      const data = await response.json();

      if (data.error) {
        return new ApiError(
          data.error.code || ApiErrorCode.UNKNOWN_ERROR,
          data.error.message || "An error occurred",
          response.status as HttpStatus,
          data.error.details,
        );
      }

      return new ApiError(
        this.getErrorCode(response.status),
        data.message || response.statusText,
        response.status as HttpStatus,
      );
    } catch {
      return new ApiError(
        this.getErrorCode(response.status),
        response.statusText,
        response.status as HttpStatus,
      );
    }
  }

  /**
   * Map HTTP status to error code
   */
  private getErrorCode(status: number): ApiErrorCode {
    switch (status) {
      case 400:
        return ApiErrorCode.INVALID_INPUT;
      case 401:
        return ApiErrorCode.UNAUTHORIZED;
      case 403:
        return ApiErrorCode.FORBIDDEN;
      case 404:
        return ApiErrorCode.NOT_FOUND;
      case 409:
        return ApiErrorCode.CONFLICT;
      case 422:
        return ApiErrorCode.VALIDATION_ERROR;
      case 503:
        return ApiErrorCode.SERVICE_UNAVAILABLE;
      default:
        return ApiErrorCode.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Make HTTP request with full type safety
   */
  async request<T = any>(
    endpoint: string,
    options: RequestInit & { timeout?: number } = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;    
    const timeout = options.timeout || this.timeout;

    try {
      // Prepare request config
      let config: RequestInit = {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...(options.headers as Record<string, string>),
        },
      };

      // Execute request interceptors
      config = await this.executeRequestInterceptors(config);

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Make request
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle error responses
      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        const finalError = await this.executeErrorInterceptors(error);
        throw finalError;
      }

      // Parse response
      let data: T;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = (await response.text()) as any;
      }

      // Execute response interceptors
      // Note: Using string-based interceptor key since T is not available at runtime
      const interceptorKey = "default";
      data = await this.executeResponseInterceptors(
        response,
        data,
        interceptorKey,
      );

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError = new ApiError(
          ApiErrorCode.TIMEOUT,
          "Request timed out",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        await this.executeErrorInterceptors(timeoutError);
        throw timeoutError;
      }

      if (error instanceof ApiError) {
        throw error;
      }

      const apiError = toApiError(error);
      await this.executeErrorInterceptors(apiError);
      throw apiError;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

/**
 * Create and export API client instance
 */
export const apiClient = new ApiClient({
  baseUrl:
    typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 30000,
});

export default apiClient;
