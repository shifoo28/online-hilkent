"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef } from "react";
import testimonialsData from "./testimonialsData";
import Image from "next/image";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";
import { Autoplay } from "swiper/modules";
import { useTranslations } from "next-intl";
import ArrowIcon from "@/components/Icons/ArrowIcon";

const Testimonials = () => {
  const sliderRef = useRef(null);
  const translate = useTranslations("Home.testimonials");

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="overflow-hidden pb-16.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="">
          <div className="swiper testimonial-carousel common-carousel p-5">
            {/* <!-- section title --> */}
            <div className="mb-10 flex items-center justify-between">
              <div>
                <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                  <Image
                    src="/images/icons/icon-08.svg"
                    alt="icon"
                    width={17}
                    height={17}
                  />
                  {translate("title")}
                </span>
                <h2 className="font-semibold text-lg xl:text-heading-5 text-dark">
                  {translate("description")}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div onClick={handlePrev} className="swiper-button-prev">
                  <ArrowIcon width={20} height={20} fill="" />
                </div>

                <div onClick={handleNext} className="swiper-button-next">
                  <ArrowIcon
                    width={20}
                    height={20}
                    fill=""
                    className="rotate-180 fill-current"
                  />
                </div>
              </div>
            </div>

            <Swiper
              ref={sliderRef}
              slidesPerView={3}
              spaceBetween={20}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
            >
              {testimonialsData.map((item, key) => (
                <SwiperSlide key={key}>
                  <SingleItem testimonial={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
