import React from "react";
import { useCart } from "@/hooks/useCart";

import { useWishlist } from "@/hooks/useWishlist";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckIcon, ExclamationIcon, RemoveIcon } from "../Icons";

const SingleItem = ({ item }) => {
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
    <div className="flex items-center gap-2 border-t border-gray-3 py-5 px-2 md:px-10">
      <div className="min-w-[40px] md:min-w-[83px]">
        <button
          onClick={() => handleRemoveFromWishlist()}
          aria-label="button for remove product from wishlist"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <RemoveIcon width={22} height={22} />
        </button>
      </div>

      <div className="min-w-[250px] md:min-w-[387px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5">
              {item.images?.[0] && (
                <Image
                  src={item.images[0].thumbnail}
                  alt={item.images[0].altText}
                  width={200}
                  height={200}
                />
              )}
            </div>

            <div>
              <h3 className="text-dark ease-out duration-200 hover:text-blue">
                <a href="#"> {item.title} </a>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="md:contents flex flex-col gap-3">
        <div className="flex-1 min-w-[60px] md:min-w-[205px]">
          <p className="text-dark">{item.discountedPrice} TMT</p>
        </div>

        <div className="flex-1 min-w-[90px] md:min-w-[265px]">
          <div className="flex items-center gap-1.5">
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
        </div>
      </div>

      <div className="min-w-max md:min-w-max flex justify-end">
        <button
          onClick={() => handleAddToCart()}
          className="inline-flex text-dark hover:text-white bg-gray-1 border border-gray-3 py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue hover:border-gray-3"
        >
          {translate("addToCart")}
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
