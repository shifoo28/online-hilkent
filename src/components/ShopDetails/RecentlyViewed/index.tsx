"use client";
import React, { useEffect, useState } from "react";
import ProductItem from "@/components/Common/ProductItem";
import Image from "next/image";
import { ArrowIcon } from "@/components/Icons";

import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef } from "react";
import "swiper/css/navigation";
import "swiper/css";
import { STORAGE_KEY_RECENTLY_VIEWED } from "..";

const RecentlyViewedItems = () => {
  const sliderRef = useRef(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    // Load recently viewed products from localStorage
    const viewed = JSON.parse(
      localStorage.getItem(STORAGE_KEY_RECENTLY_VIEWED) || "[]",
    );
    setRecentlyViewed(viewed);
  }, []);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        <div className="swiper categories-carousel common-carousel">
          {/* <!-- section title --> */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                <Image
                  src="/images/icons/icon-05.svg"
                  width={17}
                  height={17}
                  alt="icon"
                />
                Recently Viewed
              </span>
              <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
                Your Recently Viewed Items
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleNext} className="swiper-button-next">
                <ArrowIcon
                  className="fill-current"
                  width={24}
                  height={24}
                  aria-label="Next slide"
                />
              </button>
              <button onClick={handlePrev} className="swiper-button-prev">
                <ArrowIcon
                  className="fill-current rotate-180"
                  width={24}
                  height={24}
                  aria-label="Previous slide"
                />
              </button>
            </div>
          </div>

          <Swiper
            ref={sliderRef}
            spaceBetween={20}
            className="justify-between"
            breakpoints={{
              // Small screens (phones)
              320: {
                slidesPerView: 2,
              },
              // Medium screens (tablets)
              768: {
                slidesPerView: 3,
              },
              // when window width is >= 924px
              924: {
                slidesPerView: 4,
              },
              // Large screens (desktops)
              1280: {
                slidesPerView: 5,
              },
            }}
          >
            {recentlyViewed.map((item, key) => (
              <SwiperSlide key={key}>
                {item ? <ProductItem item={item} /> : <div>Loading...</div>}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedItems;
