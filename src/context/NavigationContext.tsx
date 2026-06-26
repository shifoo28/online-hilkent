"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

interface NavigationContextType {
  navigationOpen: boolean;
  setNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigationContext must be used within a NavigationProvider",
    );
  }
  return context;
};

export const NavigationProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [navigationOpen, setNavigationOpen] = useState(false);

  const value = useMemo(
    () => ({ navigationOpen, setNavigationOpen }),
    [navigationOpen],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
