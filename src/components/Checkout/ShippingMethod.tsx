import React from "react";
import { useTranslations } from "next-intl";
import { CheckoutFormData } from "@/hooks/useCheckoutForm";

interface ShippingMethodProps {
  selectedMethod: CheckoutFormData["shippingMethod"];
  onMethodChange: (method: CheckoutFormData["shippingMethod"]) => void;
}

const ShippingMethod: React.FC<ShippingMethodProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const t = useTranslations("Checkout");

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">
          {t("shippingMethod.title")}
        </h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          <label
            htmlFor="free"
            aria-disabled
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                disabled
                type="radio"
                name="shippingMethod"
                id="free"
                className="sr-only"
                checked={selectedMethod === "free"}
                onChange={() => onMethodChange("free")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "free"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>
            <span className="text-gray-600">{t("shippingMethod.free")}</span>
          </label>

          <label
            htmlFor="passengerCar"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="passengerCar"
                className="sr-only"
                checked={selectedMethod === "passengerCar"}
                onChange={() => onMethodChange("passengerCar")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "passengerCar"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>
            <span className="text-dark">
              {t("shippingMethod.passengerCar")}
            </span>
          </label>

          <label
            htmlFor="lightTruck"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="lightTruck"
                className="sr-only"
                checked={selectedMethod === "lightTruck"}
                onChange={() => onMethodChange("lightTruck")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "lightTruck"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>
            <span className="text-dark">{t("shippingMethod.lightTruck")}</span>
          </label>

          {/* <label
            htmlFor="fedex"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="fedex"
                className="sr-only"
                checked={selectedMethod === "fedex"}
                onChange={() => onMethodChange("fedex")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "fedex"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none flex-1">
              <div className="flex items-center">
                <div className="pr-4">
                  <Image
                    src="/images/checkout/fedex.svg"
                    alt="fedex"
                    width={64}
                    height={18}
                  />
                </div>

                <div className="border-l border-gray-4 pl-4">
                  <p className="font-semibold text-dark">10.99 TMT</p>
                  <p className="text-custom-xs">
                    {t("shippingMethod.standard")}
                  </p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="dhl"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="dhl"
                className="sr-only"
                checked={selectedMethod === "dhl"}
                onChange={() => onMethodChange("dhl")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "dhl"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none flex-1">
              <div className="pr-4">
                <Image
                  src="/images/checkout/dhl.svg"
                  alt="dhl"
                  width={64}
                  height={20}
                />
              </div>

              <div className="border-l border-gray-4 pl-4">
                <p className="font-semibold text-dark">15.99 TMT</p>
                <p className="text-custom-xs">{t("shippingMethod.express")}</p>
              </div>
            </div>
          </label> */}
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
