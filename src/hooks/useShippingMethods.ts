/**
 * useShippingMethods Hook
 * Fetches and manages shipping methods from the API
 */

import { useState, useEffect, useCallback } from "react";

export interface ShippingMethod {
  id: number;
  name: string;
  fee: string;
  vehicle?: string | null;
  isActive: boolean;
}

interface UseShippingMethodsReturn {
  shippingMethods: ShippingMethod[];
  loading: boolean;
  error: string | null;
  getMethodFee: (methodId: number) => number | null;
  refetch: () => Promise<void>;
}

export const useShippingMethods = (): UseShippingMethodsReturn => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShippingMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/shipping-methods");

      if (!response.ok) {
        throw new Error(`Failed to fetch shipping methods: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setShippingMethods(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch shipping methods");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("[useShippingMethods] Error:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShippingMethods();
  }, [fetchShippingMethods]);

  const getMethodFee = useCallback(
    (methodId: number): number | null => {
      const method = shippingMethods.find((m) => m.id === methodId);
      return method ? parseFloat(method.fee) : null;
    },
    [shippingMethods],
  );

  return {
    shippingMethods,
    loading,
    error,
    getMethodFee,
    refetch: fetchShippingMethods,
  };
};
