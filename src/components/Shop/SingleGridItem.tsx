"use client";
import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import GenerateStars from "../Review/generateStars";
import { EyeIcon, HeartIcon } from "@/components/Icons";

const SingleGridItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const { addItem } = useWishlist();
  const { addItemToCart } = useCart();

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // add to cart
  const handleAddToCart = () => {
    addItemToCart({
      ...item,
      title: item.translations?.[0]?.name,
      discountedPrice: item.discounts[0]?.value,
      quantity: 1,
    });
  };

  const handleItemToWishList = () => {
    addItem({
      ...item,
      status: "available",
      quantity: 1,
    });
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-white shadow-1 min-h-[270px] mb-4">
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
            Add to cart
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
        <GenerateStars rating={item.rating} size={18} />
        <p className="text-custom-sm">({item.rating})</p>
      </div>

      <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
        <Link href={`/shop-details/${item.id}`}>
          {" "}
          {item.translations?.[0]?.name}{" "}
        </Link>
      </h3>

      <span className="flex items-center gap-2 font-medium text-lg">
        <span className="text-dark">
          {item.discounts[0]?.value || item.price}{" "}
          {item.discounts[0]?.type === "PERCENTAGE" ? "%" : "TMT"}
        </span>
        {item.discounts[0] && (
          <span className="text-dark-4 line-through">{item.price} TMT</span>
        )}
      </span>
    </div>
  );
};

export default SingleGridItem;
