import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

type LatestProductsProps = {
  items: Product[];
};

const LatestProducts = ({ items }: LatestProductsProps) => {
  return (
    <div className="shadow-1 bg-white rounded-xl mt-7.5">
      <div className="px-4 sm:px-6 py-4.5 border-b border-gray-3">
        <h2 className="font-medium text-lg text-dark">Latest Products</h2>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6">
          {/* <!-- product item --> */}
          {items.slice(0, 3).map((item, key) => (
            <div className="flex items-center gap-6" key={key}>
              <div className="flex items-center justify-center rounded-[10px] bg-gray-3 max-w-[90px] w-full h-22.5">
                <Image
                  src={item.images?.[0].thumbnail}
                  alt="product image"
                  width={74}
                  height={74}
                />
              </div>

              <div>
                <h3 className="font-medium text-dark mb-1 ease-out duration-200 hover:text-blue">
                  <Link href={`/shop-details/${item.id}`}> {item.translations?.[0]?.name} </Link>
                </h3>
                <p className="text-custom-sm">Price: {item.price} TMT</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestProducts;
