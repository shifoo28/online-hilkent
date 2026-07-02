"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useShippingMethods } from "@/hooks/useShippingMethods";

interface ShippingMethodProps {
  selectedMethodId: number | null;
  onMethodChange: (methodId: number) => void;
}

const ShippingMethod: React.FC<ShippingMethodProps> = ({
  selectedMethodId,
  onMethodChange,
}) => {
  const t = useTranslations("Checkout.shippingMethod");
  const { shippingMethods, loading, error } = useShippingMethods();

  const getShippingMethodTranslationKey = (name: string, vehicle?: string | null) => {
    const normalized = name.trim().toLowerCase();

    if (vehicle === "PASSENGER_CAR") return "passengerCar";
    if (vehicle === "LIGHT_TRUCK") return "lightTruck";
    if (normalized.includes("free")) return "free";
    if (normalized.includes("express")) return "express";
    if (normalized.includes("standard")) return "standard";

    return null;
  };

  const getShippingMethodLabel = (method: {
    name: string;
    vehicle?: string | null;
  }) => {
    const key = getShippingMethodTranslationKey(method.name, method.vehicle);
    return key ? t(key) : method.name;
  };

  // Provide fallback for first method if none selected
  const effectiveSelection = useMemo(() => {
    if (selectedMethodId) return selectedMethodId;
    return shippingMethods.length > 0 ? shippingMethods[0].id : null;
  }, [selectedMethodId, shippingMethods]);

  if (loading) {
    return (
      <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">
            {t("title")}
          </h3>
        </div>
        <div className="p-4 sm:p-8.5">
          <p className="text-gray-600 text-center">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || shippingMethods.length === 0) {    
    return (
      <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">
            {t("title")}
          </h3>
        </div>
        <div className="p-4 sm:p-8.5">
          <p className="text-red-500 text-center">
            {error || t("noMethodsAvailable")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">
          {t("title")}
        </h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          {shippingMethods.map((method) => (
            <label
              key={method.id}
              htmlFor={`shipping-method-${method.id}`}
              className="flex cursor-pointer select-none items-center gap-3.5 p-3 rounded-md hover:bg-gray-1 transition-colors"
            >
              <div className="relative flex-shrink-0">
                <input
                  type="radio"
                  name="shippingMethod"
                  id={`shipping-method-${method.id}`}
                  className="sr-only"
                  checked={effectiveSelection === method.id}
                  onChange={() => onMethodChange(method.id)}
                />
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    effectiveSelection === method.id
                      ? "border-4 border-blue"
                      : "border border-gray-4"
                  }`}
                ></div>
              </div>

              <div className="flex-1 flex items-center justify-between">
                <span className="text-dark">{getShippingMethodLabel(method)}</span>
                {/* <span className="text-dark font-semibold">
                  {parseFloat(method.cost) === 0
                    ? t("free")
                    : `${parseFloat(method.cost).toFixed(2)} TMT`}
                </span> */}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
