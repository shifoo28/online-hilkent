import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const featureData = [
  {
    key: "shipping",
    img: "/images/icons/icon-01.svg",
  },
  {
    key: "return",
    img: "/images/icons/icon-02.svg",
  },
  {
    key: "payment",
    img: "/images/icons/icon-03.svg",
  },
  {
    key: "support",
    img: "/images/icons/icon-04.svg",
  },
];

const HeroFeature = () => {
  const translate = useTranslations("Home.hero.features");

  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="flex flex-wrap items-center gap-7.5 xl:gap-12.5 mt-10">
        {featureData.map((item, key) => (
          <div className="flex items-center gap-4" key={key}>
            <Image src={item.img} alt="icons" width={40} height={41} />

            <div>
              <h3 className="font-medium text-lg text-dark">
                {translate(`${item.key}.title`)}
              </h3>
              <p className="text-sm">{translate(`${item.key}.description`)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
