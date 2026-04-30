/**
 * useApiCall Hook
 * Type-safe hook for making API calls with automatic loading/error/success state management
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ApiError, toApiError } from "@/types/api";

/**
 * API Call State
 */
export interface ApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * API Call Hook Options
 */
export interface UseApiCallOptions<T> {
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: ApiError) => void | Promise<void>;
  onFinally?: () => void | Promise<void>;
  immediate?: boolean;
}

/**
 * useApiCall Hook
 * Manages API call state with type safety
 */
export function useApiCall<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiCallOptions<T> = {},
) {
  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  /**
   * Execute API call
   */
  const execute = useCallback(
    async (...args: P) => {
      // Abort any previous requests
      abortControllerRef.current?.abort();

      if (!isMountedRef.current) return;

      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));
        const result = await apiFunction(...args);

        if (!isMountedRef.current) return; // Check if component is still mounted before updating state

        setState({
          data: result,
          loading: false,
          error: null,
        });

        await options.onSuccess?.(result);
      } catch (error) {
        if (!isMountedRef.current) return;

        const apiError = toApiError(error);

        setState({
          data: null,
          loading: false,
          error: apiError,
        });

        await options.onError?.(apiError);
      } finally {
        if (!isMountedRef.current) return;
        await options.onFinally?.();
      }
    },
    [apiFunction, options],
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Set data directly
   */
  const setData = useCallback((data: T | null) => {
    if (!isMountedRef.current) return;
    setState((prev) => ({
      ...prev,
      data,
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    isLoading: state.loading,
    isError: state.error !== null,
    isSuccess: state.data !== null && state.error === null,
  };
}

/**
 * useApiData Hook
 * Similar to useApiCall but fetches data immediately on mount
 */
export function useApiData<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<T>,
  args: P = [] as any,
  options: UseApiCallOptions<T> = {},
) {
  const { execute, ...state } = useApiCall(apiFunction, options);

  useEffect(() => {
    execute(...args);    
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, refetch: () => execute(...args) };
}

/**
 * useLazyApiCall Hook
 * Similar to useApiCall but only executes when called explicitly
 */
export function useLazyApiCall<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiCallOptions<T> = {},
) {
  const { execute, ...state } = useApiCall(apiFunction, options);

  return [execute, state] as const;
}
