import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckoutFormData } from "@/hooks/useCheckoutForm";

interface PaymentMethodProps {
  selectedMethod: CheckoutFormData["paymentMethod"];
  onMethodChange: (method: CheckoutFormData["paymentMethod"]) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const t = useTranslations("Checkout");
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">{t("payment.title")}</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          <label
            htmlFor="cash"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="paymentMethod"
                id="cash"
                className="sr-only"
                checked={selectedMethod === "cash"}
                onChange={() => onMethodChange("cash")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "cash"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none flex-1 ${
                selectedMethod === "cash"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image
                    src="/images/checkout/cash.svg"
                    alt="cash"
                    width={21}
                    height={21}
                  />
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>{t("payment.cash")}</p>
                </div>
              </div>
            </div>
          </label>
          <label
            htmlFor="rysgalbank"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="paymentMethod"
                id="rysgalbank"
                className="sr-only"
                checked={selectedMethod === "rysgalbank"}
                onChange={() => onMethodChange("rysgalbank")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "rysgalbank"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none flex-1 ${
                selectedMethod === "rysgalbank"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image
                    src="/images/checkout/rysgalbank.png"
                    alt="rysgalbank"
                    width={29}
                    height={12}
                  />
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>RYSGAL BANK</p>
                </div>
              </div>
            </div>
          </label>
          <label
            htmlFor="halkbank"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="paymentMethod"
                id="halkbank"
                className="sr-only"
                checked={selectedMethod === "halkbank"}
                onChange={() => onMethodChange("halkbank")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "halkbank"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none flex-1 ${
                selectedMethod === "halkbank"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image
                    src="/images/checkout/halkbank.png"
                    alt="halkbank"
                    width={29}
                    height={12}
                  />
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>HALK BANK</p>
                </div>
              </div>
            </div>
          </label>
          <label
            htmlFor="senagatbank"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="paymentMethod"
                id="senagatbank"
                className="sr-only"
                checked={selectedMethod === "senagatbank"}
                onChange={() => onMethodChange("senagatbank")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selectedMethod === "senagatbank"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none flex-1 ${
                selectedMethod === "senagatbank"
                  ? "border-transparent bg-gray-2"
                  : " border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image
                    src="/images/checkout/senagatbank.png"
                    alt="senagatbank"
                    width={29}
                    height={12}
                  />
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p>SENAGAT BANK</p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
