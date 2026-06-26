"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useTranslations } from "next-intl";
import { Product } from "@/lib/products";
import SingleGridItem from "../Shop/SingleGridItem";

export const STORAGE_KEY_RECENTLY_VIEWED = "recentlyViewed";

export const RecentlyViewed = () => {
  const translate = useTranslations("RecentlyViewed");
  const [recentlyViewedItems, setRecentlyViewedItems] = useState<Product[]>([]);

  useEffect(() => {
    // Load recently viewed products from localStorage
    const viewed = JSON.parse(
      localStorage.getItem(STORAGE_KEY_RECENTLY_VIEWED) || "[]",
    );
    setRecentlyViewedItems(viewed);
  }, []);

  return (
    <>
      <Breadcrumb
        title={translate("breadcrumb.title")}
        pages={[translate("breadcrumb.page")]}
      />
      <section className="overflow-hidden py-10 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {recentlyViewedItems.length !== 0 ? (
            // Render the recently viewed items here with grid view
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentlyViewedItems.map((item: Product) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <SingleGridItem item={item} />
                </div>
              ))}
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
