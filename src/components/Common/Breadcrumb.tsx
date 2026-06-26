import React, { useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { NavigationToggle } from "../Header";

const Breadcrumb = ({ title, pages }) => {
  const translate = useTranslations("Common");
  const toggleRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="overflow-hidden shadow-breadcrumb pt-[210px] sm:pt-[160px] lg:pt-[150px] xl:pt-[175px]">
      <div className="border-t border-gray-3">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-5 xl:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-semibold sm:text-dark text-xl sm:text-2xl xl:text-custom-xl">
              {title}
            </h1>

            <div className="sm:hidden absolute right-4">
              <NavigationToggle buttonRef={toggleRef} />
            </div>

            <ul className="flex items-center gap-2 max-w-max w-full">
              <li className="text-custom-sm hover:text-blue">
                <Link href="/">{translate("breadcrumb.link")} /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li
                    className="text-custom-sm last:text-blue capitalize"
                    key={key}
                  >
                    {page}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
