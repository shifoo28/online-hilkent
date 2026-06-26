import { useState, useEffect } from "react";

export interface Address {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: "shipping" | "billing";
  isDefault: boolean;
}

const ADDRESSES_STORAGE_KEY = "user_addresses";

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Load addresses from localStorage on mount
  useEffect(() => {
    const loadAddresses = () => {
      try {
        const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
        if (stored) {
          setAddresses(JSON.parse(stored));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading addresses from localStorage:", error);
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
      } catch (error) {
        console.error("Error saving addresses to localStorage:", error);
      }
    }
  }, [addresses, loading]);

  const addAddress = (address: Omit<Address, "id">) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };
    setAddresses((prev) => [...prev, newAddress]);
    return newAddress;
  };

  const updateAddress = (id: string, updatedAddress: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, ...updatedAddress } : addr,
      ),
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const getAddressesByType = (type: "shipping" | "billing") => {
    return addresses.filter((addr) => addr.type === type);
  };

  const getDefaultAddress = (type: "shipping" | "billing") => {
    return addresses.find((addr) => addr.type === type && addr.isDefault);
  };

  const setDefaultAddress = (id: string, type: "shipping" | "billing") => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.type === type ? { ...addr, isDefault: addr.id === id } : addr,
      ),
    );
  };

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    getAddressesByType,
    getDefaultAddress,
    setDefaultAddress,
  };
};
