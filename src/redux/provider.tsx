"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import React from "react";
import { WishlistProvider } from "@/context/WishlistContext";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WishlistProvider>{children}</WishlistProvider>
    </Provider>
  );
}
