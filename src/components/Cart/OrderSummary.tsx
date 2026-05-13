import { useCart } from "@/hooks/useCart";
import { getDatabaseLocale } from "@/locales/map";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

const OrderSummary = () => {
  const { items, totalPrice } = useCart();
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
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">
            {translate("title")}
          </h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
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

          {/* <!-- product item --> */}
          {items.map((item, key) => (
            <div
              key={key}
              className="flex items-center justify-between py-5 border-b border-gray-3"
            >
              <div>
                <p className="text-dark">{titles[key]}</p>
              </div>
              <div>
                <p className="text-dark text-right">
                  {item.discountedPrice
                    ? item.discountedPrice * item.quantity
                    : item.price * item.quantity}{" "}
                  TMT
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-lg text-dark">
                {translate("total")}
              </p>
            </div>
            <div>
              <p className="font-medium text-lg text-dark text-right">
                {totalPrice} TMT
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <button
            type="submit"
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            {translate("button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
