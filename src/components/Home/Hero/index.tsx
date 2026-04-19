import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroProduct } from "@/types/product";

const mapHeroCard = (heroProduct: HeroProduct) => {
  const product = heroProduct.product;
  const price = product?.price || 0;
  const discountObj = product?.discounts?.[0];
  let discountedPrice = price;

  if (discountObj) {
    if (discountObj.type === "PERCENTAGE") {
      discountedPrice = price * (1 - discountObj.value / 100);
    } else if (discountObj.type === "FIXED") {
      discountedPrice = price - discountObj.value;
    }
  }

  return {
    id: heroProduct.id,
    productId: heroProduct.id,
    name: heroProduct.headline,
    image: heroProduct.image,
    price: price,
    discount: discountedPrice,
  };
};

type HeroProps = {
  products: HeroProduct[];
};

const Hero = ({ products }: HeroProps) => {
  const translate = useTranslations("Home.hero");
  const heroSlides = products.filter((p) => p.isSlider);
  const heroProducts = products.filter((p) => !p.isSlider).map(mapHeroCard);  

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-67 sm:pt-50 lg:pt-46 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel slides={heroSlides} />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {heroProducts.map((item) => (
                <div
                  key={item.id}
                  className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5"
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col justify-between xl:min-h-[190px]">
                      <h2 className="max-w-full font-semibold text-dark text-xl">
                        <a href={`/shop-details/${item.productId}`}>
                          {item.name}
                        </a>
                      </h2>

                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                          {translate("offer")}
                        </p>
                        <span className="flex flex-col items-start">
                          <span className="font-medium text-heading-5 text-green">
                            {item.discount} TMT
                          </span>
                          {item.discount !== item.price && (
                            <span className="font-medium text-2xl text-dark-4 line-through">
                              {item.price} TMT
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-max">
                      <Image
                        src={item.image}
                        alt={item.name || "Hilkent product"}
                        width={135}
                        height={161}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
