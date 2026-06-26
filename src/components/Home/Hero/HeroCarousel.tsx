"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroProduct } from "@/types/product";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

const mapHeroSlide = (heroProduct: HeroProduct) => {
  const discount = heroProduct.product?.discounts?.[0]?.value;
  const type = heroProduct.product?.discounts?.[0]?.type;

  const discountedPrice =
    type === "PERCENTAGE"
      ? `${discount}%`
      : type === "FIXED"
        ? `-${discount} TMT`
        : "Exclusive";

  return {
    id: heroProduct.id,
    productId: heroProduct.productId,
    isSlider: heroProduct.isSlider,
    position: heroProduct.position,
    headline:
      heroProduct.headline ||
      heroProduct.product?.translations?.[0]?.name ||
      "",
    subline: heroProduct.subline || "",
    image: heroProduct.image,
    discount: discountedPrice,
    discountType: type,
  };
};

const HeroCarousel = ({ slides }: { slides: HeroProduct[] }) => {
  const heroSlides = slides.map(mapHeroSlide);
  const translate = useTranslations("Home.hero");

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {heroSlides.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="flex items-center justify-between pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
            <div className="max-w-[394px] py-10 sm:py-15 lg:py-16.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                  {item.discount}
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  {item.discountType ? translate("discount") : null}
                </span>
              </div>

              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                <p>{item.headline}</p>
              </h1>

              <p>{item.subline}</p>

              <a
                href={"/shop-details/" + item.productId}
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
              >
                {translate("button")}
              </a>
            </div>

            <div>
              <Image
                src={item.image}
                alt="Hero Product"
                width={351}
                height={358}
                className="rounded"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousel;
