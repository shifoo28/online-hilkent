"use client";
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/types/product";

export type WishlistItem = Product & {
  quantity: number;
  status?: string;
};

const STORAGE_KEY = "wishlist";

function loadWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error("Failed to load wishlist from localStorage", error);
    return [];
  }
}

function saveWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save wishlist to localStorage", error);
  }
}

type WishlistContextType = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(loadWishlist());
  }, []);

  useEffect(() => {
    saveWishlist(items);
  }, [items]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: (i.quantity || 0) + (item.quantity || 0) }
            : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const isInWishlist = useCallback(
    (id: number) => items.some((item) => item.id === id),
    [items],
  );

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, clearWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
