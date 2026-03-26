"use client";
import React, { use } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useWishlist } from "@/hooks/useWishlist";
import SingleItem from "./SingleItem";
import { useTranslations } from "next-intl";

export const Wishlist = () => {
  const { items: wishlistItems, clearWishlist } = useWishlist();
  const translate = useTranslations("Wishlist");

  return (
    <>
      <Breadcrumb title={translate("title")} pages={["Wishlist"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">
              {translate("label")}
            </h2>
            <button className="text-blue" onClick={clearWishlist} type="button">
              {translate("clear")}
            </button>
          </div>
          <div className="bg-white rounded-[10px] shadow-1">
            <div className="w-full overflow-x-auto">
              {wishlistItems.length !== 0 ? (
                <div className="min-w-full">
                  {/* <!-- table header --> */}
                  <div className="hidden md:flex items-center py-5.5 px-4 md:px-10">
                    <div className="w-[80px] md:min-w-[83px]"></div>
                    <div className="flex-1 md:min-w-[387px]">
                      <p className="text-dark">{translate("table.product")}</p>
                    </div>

                    <div className="w-[120px] md:min-w-[205px]">
                      <p className="text-dark">{translate("table.price")}</p>
                    </div>

                    <div className="w-[150px] md:min-w-[265px]">
                      <p className="text-dark">{translate("table.stock")}</p>
                    </div>

                    <div className="w-[100px] md:min-w-[150px] text-right">
                      <p className="text-dark">{translate("table.action")}</p>
                    </div>
                  </div>

                  {/* <!-- wish item --> */}
                  <div className="flex flex-col gap-4 md:block">
                    {wishlistItems.map((item, key) => (
                      <SingleItem item={item} key={key} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                  <p className="text-gray-500 text-lg">{translate("empty")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
