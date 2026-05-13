import React from "react";
import { CartItem, useCart } from "@/hooks/useCart";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { RemoveIcon } from "@/components/Icons";
import { getDatabaseLocale } from "@/locales/map";

const SingleItem = ({ item }: { item: CartItem }) => {
  const locale = useLocale();
  const title =
    item.translations.find((t) => t.locale === getDatabaseLocale(locale))
      ?.name ||
    item.translations[0]?.name ||
    "Product";
  const translate = useTranslations("Common.cartSidebarModal");
  const { removeItemFromCart } = useCart();

  const handleRemoveFromCart = () => {
    removeItemFromCart(item.id);
  };

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="w-full flex items-center gap-6">
        <div className="flex items-center justify-center rounded-[10px] bg-gray-3 max-w-[90px] w-full h-22.5">
          {item.images?.[0] && (
            <Image
              src={item.images[0].thumbnail}
              alt={item.images[0].altText}
              width={100}
              height={100}
            />
          )}
        </div>

        <div>
          <h3 className="font-medium text-dark mb-1 ease-out duration-200 hover:text-blue">
            <a href="#"> {title} </a>
          </h3>
          <p className="text-custom-sm">
            {translate("price")}: {item.discountedPrice} TMT
          </p>
        </div>
      </div>

      <button
        onClick={handleRemoveFromCart}
        aria-label="button for remove product from cart"
        className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
      >
        <RemoveIcon
          className="fill-current"
          width={22}
          height={22}
          aria-label="Remove item"
        />
      </button>
    </div>
  );
};

export default SingleItem;
