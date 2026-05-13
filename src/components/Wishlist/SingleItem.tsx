import React from "react";
import { useCart } from "@/hooks/useCart";

import { useWishlist } from "@/hooks/useWishlist";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { CheckIcon, ExclamationIcon, RemoveIcon } from "../Icons";
import { Product } from "@/types/product";
import { getDatabaseLocale } from "@/locales/map";
import Link from "next/link";

const SingleItem = ({ item }: { item: Product }) => {
  const locale = useLocale();
  const title =
    item.translations.find((t) => t.locale === getDatabaseLocale(locale))
      ?.name ||
    item.translations[0]?.name ||
    "Product";
  const { removeItem } = useWishlist();
  const { addItemToCart } = useCart();
  const translate = useTranslations("Wishlist");

  const handleRemoveFromWishlist = () => {
    removeItem(item.id);
  };

  const handleAddToCart = () => {
    addItemToCart({
      ...item,
      quantity: 1,
    });
  };

  return (
    <div className="flex items-center w-full border-t border-gray-3 py-5 px-2 md:px-10">
      <div className="min-w-[40px] md:min-w-[83px]">
        <button
          onClick={() => handleRemoveFromWishlist()}
          aria-label="button for remove product from wishlist"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <RemoveIcon width={22} height={22} />
        </button>
      </div>

      <div className="min-w-[250px] md:min-w-[387px] flex items-center gap-5 px-2 w-full md:max-w-[270px]">
        <div className="flex items-center justify-center rounded-[5px] bg-gray-2 w-[80px] h-17.5">
          {item.images?.[0] && (
            <Image
              src={item.images[0].thumbnail}
              alt={item.images[0].altText}
              width={200}
              height={200}
            />
          )}
        </div>

        <h3 className="text-dark transition ease-out duration-200 hover:text-blue">
          <Link href={`/shop-details/${item.id}`} prefetch={false}>
            {title}
          </Link>
        </h3>
      </div>

      <div className="md:contents flex flex-col gap-3">
        <div className="md:contents flex">
          <div className="flex-1 flex items-center gap-1.5 min-w-max px-2">
            {item.inStock ? (
              <CheckIcon width={20} height={20} fill="#22AD5C" />
            ) : (
              <ExclamationIcon width={20} height={20} fill="#E02424" />
            )}

            <span
              className={`text-sm font-medium min-w-max ${item.inStock ? "text-green" : "text-red"}`}
            >
              {translate(`stock.${item.inStock ? "inStock" : "outOfStock"}`)}
            </span>
          </div>

          <div className="flex-1 min-w-max px-2">
            <p className="text-dark">{item.discountedPrice} TMT</p>
          </div>
        </div>

        <div className="min-w-max flex justify-end px-2 md:pr-5">
          <button
            onClick={() => handleAddToCart()}
            className="inline-flex text-dark hover:text-white bg-gray-1 border border-gray-3 py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue hover:border-gray-3"
          >
            {translate("addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
