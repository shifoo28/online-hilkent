"use client";
import { Product } from "@/types/product";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export type CartItemType = Product & {
  quantity: number;
};

const STORAGE_KEY = "cart";

function loadCart(): CartItemType[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error("Failed to load cart from localStorage", error);
    return [];
  }
}

function saveCart(items: CartItemType[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage", error);
  }
}

interface CartContextType {
  items: CartItemType[];
  addItemToCart: (item: CartItemType) => void;
  removeItemFromCart: (id: string) => void;
  updateCartItemQuantity: ({
    id,
    quantity,
  }: {
    id: string;
    quantity: number;
  }) => void;
  removeAllItemsFromCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItemType[]>([]);
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveCart(items);
  }, [items]);

  const addItemToCart = useCallback((item: CartItemType) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItemFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateCartItemQuantity = useCallback(
    ({ id, quantity }: { id: string; quantity: number }) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    },
    [],
  );

  const removeAllItemsFromCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => {
      return total + item.discountedPrice * item.quantity;
    }, 0);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItemToCart,
      removeItemFromCart,
      updateCartItemQuantity,
      removeAllItemsFromCart,
      totalPrice,
    }),
    [
      items,
      addItemToCart,
      removeItemFromCart,
      updateCartItemQuantity,
      removeAllItemsFromCart,
      totalPrice,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
