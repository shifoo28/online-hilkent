"use client";
import React from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useTranslations } from "next-intl";

const BestSeller = () => {
  const translate = useTranslations("Home.bestSeller");
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <section className="overflow-hidden">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center py-20">Loading best sellers...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center py-20 text-red-600">
            Failed to load products.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              {translate("title")}
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              {translate("description")}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {/* <!-- Best Sellers item --> */}
          {products.slice(1, 7).map((item, key) => (
            <SingleItem item={item} key={key} />
          ))}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            {translate("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
