"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/types/product";

type UseProductsOptions = {
  initialData?: Product[];
  productId?: number;
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
};

export function useProducts({
  initialData,
  productId,
  page = 1,
  limit = 9,
  category,
  brand,
  minPrice,
  maxPrice,
  minRating,
}: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>(initialData ?? []);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const url = useMemo(() => {
    if (productId) return `/api/products?id=${productId}`;

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));

    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (minPrice !== undefined) params.set("minPrice", String(minPrice));
    if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
    if (minRating !== undefined) params.set("minRating", String(minRating));

    return `/api/products?${params.toString()}`;
  }, [productId, page, limit, category, brand, minPrice, maxPrice, minRating]);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || "Failed to fetch products");
        }

        const data = await res.json();
        if (!cancelled) {
          if (Array.isArray(data)) {
            setProducts(data);
            setTotalItems(data.length);
            setTotalPages(1);
          } else if (data?.data) {
            setProducts(data.data);
            setTotalItems(data.totalItems ?? 0);
            setTotalPages(data.totalPages ?? 1);
          } else {
            setProducts([]);
            setTotalItems(0);
            setTotalPages(1);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    // Only run in browser environment
    if (typeof window !== "undefined") {
      fetchProducts();
    }

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { products, totalItems, totalPages, loading, error };
}
