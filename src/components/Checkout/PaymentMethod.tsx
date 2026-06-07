import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { PaymentMethod as PM } from "@prisma/client";
import { CheckoutFormData } from "@/hooks/useCheckoutForm";

interface PaymentMethodProps {
  selectedMethod: CheckoutFormData["paymentMethod"];
  onMethodChange: (method: CheckoutFormData["paymentMethod"]) => void;
}

const paymentOptions = [
  {
    id: "cash",
    enumValue: PM.CASH,
    label: "payment.cash",
    icon: "/images/checkout/cash.svg",
    alt: "cash",
  },
  {
    id: "rysgalbank",
    enumValue: PM.RYSGALBANK,
    label: "RYSGAL BANK",
    icon: "/images/checkout/rysgalbank.png",
    alt: "rysgalbank",
  },
  {
    id: "halkbank",
    enumValue: PM.HALKBANK,
    label: "HALK BANK",
    icon: "/images/checkout/halkbank.png",
    alt: "halkbank",
  },
  {
    id: "senagatbank",
    enumValue: PM.SENAGATBANK,
    label: "SENAGAT BANK",
    icon: "/images/checkout/senagatbank.png",
    alt: "senagatbank",
  },
];

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
          {paymentOptions.map((option) => {
            const isSelected = selectedMethod === option.enumValue;
            return (
              <label
                key={option.id}
                htmlFor={option.id}
                className="flex cursor-pointer select-none items-center gap-4"
              >
                <div className="relative">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id={option.id}
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => onMethodChange(option.enumValue)}
                  />
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                      isSelected
                        ? "border-4 border-blue"
                        : "border border-gray-4"
                    }`}
                  ></div>
                </div>

                <div
                  className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none flex-1 ${
                    isSelected
                      ? "border-transparent bg-gray-2"
                      : " border-gray-4 shadow-1"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="pr-2.5">
                      <Image
                        src={option.icon}
                        alt={option.alt}
                        width={option.alt === "cash" ? 21 : 29}
                        height={option.alt === "cash" ? 21 : 12}
                      />
                    </div>

                    <div className="border-l border-gray-4 pl-2.5">
                      <p>
                        {option.label === "payment.cash"
                          ? t(option.label)
                          : option.label}
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
