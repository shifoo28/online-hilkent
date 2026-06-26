"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import GenerateStars from "../Review/generateStars";
import { EyeIcon, HeartIcon } from "@/components/Icons";
import { getDatabaseLocale } from "@/locales/map";

const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const translate = useTranslations("Common");
  const locale = useLocale();
  const dispatch = useDispatch<AppDispatch>();
  const { addItem } = useWishlist();
  const { addItemToCart } = useCart();

  const title =
    item.translations.find((t) => t.locale === getDatabaseLocale(locale))
      ?.name ||
    item.translations[0]?.name ||
    "Product";

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // add to cart
  const handleAddToCart = () => {
    addItemToCart({
      ...item,
      quantity: 1,
    });
  };

  const handleItemToWishList = () => {
    addItem({ ...item });
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-[#F6F7FB] min-h-[270px] mb-4">
        {item.images[0] && (
          <Image
            key={item.id}
            src={item.images[0].url}
            alt={item.images[0].altText || "Product Image"}
            width={250}
            height={250}
          />
        )}

        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <button
            onClick={() => {
              openModal();
              handleQuickViewUpdate();
            }}
            id="newOne"
            aria-label="button for quick view"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
          >
            <EyeIcon
              className="fill-current"
              width={16}
              height={16}
              aria-label="Quick view"
            />
          </button>

          <button
            onClick={() => handleAddToCart()}
            className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark"
          >
            {translate("productItem.button")}
          </button>

          <button
            onClick={() => handleItemToWishList()}
            aria-label="button for favorite select"
            id="favOne"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
          >
            <HeartIcon
              className="fill-current"
              width={16}
              height={16}
              aria-label="Add to wishlist"
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1">
          <GenerateStars rating={item.rating} size={24} />
        </div>

        <p className="text-custom-sm">({item.rating})</p>
      </div>

      <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5 line-clamp-2">
        <Link href={`/shop-details/${item.id}`}> {title} </Link>
      </h3>
    </div>
  );
};

export default ProductItem;
