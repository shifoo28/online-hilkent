import React from "react";
import { useCart } from "@/hooks/useCart";
import { getDatabaseLocale } from "@/locales/map";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

interface OrderSummaryProps {
  subtotal: number;
  discountAmount: number;
  appliedCouponCode?: string | null;
  orderTotal: number;
}

const OrderSummary = ({
  subtotal,
  discountAmount,
  appliedCouponCode,
  orderTotal,
}: OrderSummaryProps) => {
  const { items } = useCart();
  const locale = useLocale();
  const translate = useTranslations("Cart.orderSummary");
  const titles =
    items.map(
      (item) =>
        item.translations.find((t) => t.locale === getDatabaseLocale(locale))
          ?.name || "Product",
    ) || [];

  return (
    <div className="lg:max-w-[455px] w-full">
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">
            {translate("title")}
          </h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">{translate("product")}</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">
                {translate("subtotal")}
              </h4>
            </div>
          </div>

          {items.map((item, key) => (
            <div
              key={key}
              className="flex items-center justify-between py-5 border-b border-gray-3"
            >
              <p className="text-dark line-clamp-2">{titles[key]}</p>
              <p className="text-dark text-right min-w-max pl-1">
                {item.discountedPrice
                  ? item.discountedPrice * item.quantity
                  : item.price * item.quantity}{" "}
                TMT
              </p>
            </div>
          ))}

          <div className="flex items-center justify-between pt-5">
            <p className="font-medium">
              {translate("subtotal")}
            </p>
            <p className="font-medium text-right">
              {subtotal.toFixed(2)} TMT
            </p>
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between pt-4">
              <p className="font-medium  text-dark">
                {translate("discount")}
              </p>
              <p className="font-medium  text-red text-right">
                -{discountAmount.toFixed(2)} TMT
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-5">
            <p className="font-medium  text-dark">
              {translate("total")}
            </p>
            <p className="font-medium  text-green text-right">
              {orderTotal.toFixed(2)} TMT
            </p>
          </div>

          <Link
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            href={"/checkout"}
          >
            {translate("button")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
