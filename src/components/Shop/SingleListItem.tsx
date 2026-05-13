"use client";
import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import GenerateStars from "../Review/generateStars";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { EyeIcon, HeartIcon } from "@/components/Icons";
import { useLocale } from "next-intl";
import { getDatabaseLocale } from "@/locales/map";

const SingleListItem = ({ item }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const breakpoint = useBreakpoint();
  const { openModal } = useModalContext();
  const { addItem } = useWishlist();
  const { addItemToCart } = useCart();
  const locale = useLocale();

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
    <div className="group rounded-lg bg-white shadow-1">
      <div className="flex">
        <div className="shadow-list relative overflow-hidden flex items-center justify-center max-w-[270px] w-full sm:min-h-[270px] p-4">
          {item.images[0] && (
            <Image
              src={item.images[0].url}
              alt={item.images[0].altText || "Product image"}
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
              Add to cart
            </button>

            <button
              onClick={() => handleItemToWishList()}
              aria-label="button for favorite select"
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

        <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center justify-center sm:justify-between py-5 px-4 sm:px-7.5 lg:pl-11 lg:pr-12">
          <div>
            <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
              <Link href={`/shop-details/${item.id}`}> {title} </Link>
            </h3>

            <span className="flex items-center gap-2 font-medium text-lg">
              <span className="text-dark">{item.discountedPrice} TMT</span>
              {item.discountedPrice !== item.price && (
                <span className="text-dark-4 line-through">
                  {item.price} TMT
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5 mb-2">
            <GenerateStars
              rating={item.rating}
              size={breakpoint === "mobile" ? 17 : 24}
            />
            <p className="text-custom-sm">({item.rating})</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
