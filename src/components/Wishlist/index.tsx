"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useWishlist } from "@/hooks/useWishlist";
import { useTranslations } from "next-intl";
import WishlistItem from "./WishlistItem";

export const Wishlist = () => {
  const { items: wishlistItems, clearWishlist } = useWishlist();
  const translate = useTranslations("Wishlist");

  return (
    <>
      <Breadcrumb title={translate("title")} pages={[translate("page")]} />
      <section className="overflow-hidden py-10 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">
              {translate("label")}
            </h2>
            <button className="text-blue" onClick={clearWishlist} type="button">
              {translate("clear")}
            </button>
          </div>
          {wishlistItems.length !== 0 ? (
            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-full">
                  {/* <!-- wish item --> */}
                  <div className="flex flex-col gap-4 md:block">
                    {wishlistItems.map((item, key) => (
                      <WishlistItem item={item} key={key} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
              <p className="text-gray-500 text-lg">{translate("empty")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
