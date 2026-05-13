/**
 * useApiError Hook
 * Handles API errors with consistent message formatting and toast notifications
 */

"use client";

import { useCallback } from "react";
import {
  ApiError,
  ValidationError,
  isApiError,
  isValidationError,
} from "@/types/api";
import toast from "react-hot-toast";

/**
 * Error Message Options
 */
export interface ErrorMessageOptions {
  showToast?: boolean;
  showConsole?: boolean;
  userMessage?: string;
}

/**
 * useApiError Hook
 */
export function useApiError() {
  /**
   * Get user-friendly error message
   */
  const getUserMessage = useCallback((error: unknown): string => {
    if (isApiError(error)) {
      return error.getUserMessage();
    }

    if (error instanceof Error) {
      return error.message || "Tüşünişölmin kaldym!";
    }

    return "Tüşünişölmin kaldym!";
  }, []);

  /**
   * Handle API error
   */
  const handleError = useCallback(
    (error: unknown, options: ErrorMessageOptions = {}) => {
      const {
        showToast = true,
        showConsole = process.env.NODE_ENV === "development",
        userMessage,
      } = options;

      let apiError: ApiError | null = null;
      let message = userMessage || getUserMessage(error);

      if (isApiError(error)) {
        apiError = error;
        if (!userMessage) {
          message = error.getUserMessage();
        }
      }

      if (showConsole) {
        console.error("API Error:", {
          error,
          apiError,
          message,
        });
      }

      if (showToast) {
        toast.error(message, {
          duration: 4000,
        });
      }

      return {
        error: apiError || toApiError(error),
        message,
      };
    },
    [getUserMessage],
  );

  /**
   * Get validation errors
   */
  const getValidationErrors = useCallback(
    (error: ValidationError): Record<string, string> | null => {
      if (isValidationError(error)) {
        return error.fieldErrors.reduce(
          (acc, fieldError) => ({
            ...acc,
            [fieldError.field]: fieldError.message,
          }),
          {},
        );
      }

      return null;
    },
    [],
  );

  /**
   * Extract field error
   */
  const getFieldError = useCallback(
    (error: unknown, fieldName: string): string | null => {
      if (isValidationError(error)) {
        const fieldError = error.getFieldError(fieldName);
        return fieldError?.message || null;
      }

      return null;
    },
    [],
  );

  /**
   * Check if error is auth error
   */
  const isAuthError = useCallback((error: unknown): boolean => {
    return isApiError(error) && error.isAuthError();
  }, []);

  /**
   * Check if error is validation error
   */
  const isValidation = useCallback((error: unknown): boolean => {
    return isValidationError(error);
  }, []);

  return {
    handleError,
    getUserMessage,
    getValidationErrors,
    getFieldError,
    isAuthError,
    isValidation,
  };
}

/**
 * Helper function - convert unknown error to ApiError
 */
function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(
      "UNKNOWN_ERROR" as any,
      error.message || "Tüşünişölmin kaldym!",
    );
  }

  return new ApiError("UNKNOWN_ERROR" as any, "Tüşünişölmin kaldym!");
}
