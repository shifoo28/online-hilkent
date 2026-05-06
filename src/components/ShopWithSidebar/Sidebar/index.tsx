"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import CategoryDropdown from "./CategoryDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import { CategoryOption } from "@/types/category";

interface SidebarProps {
  isOpen: boolean;
  stickyMenu: boolean;
  categories: CategoryOption[];
  selectedCategoryId: string;
  selectedBrand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  onToggle: () => void;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onMinPriceChange: (price: number) => void;
  onMaxPriceChange: (price: number) => void;
  onMinRatingChange: (rating: number) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  minPrice,
  maxPrice,
  minRating,
  stickyMenu,
  categories,
  selectedBrand,
  selectedCategoryId,
  onToggle,
  onCategoryChange,
  onBrandChange,
  onMinPriceChange,
  onMaxPriceChange,
  onMinRatingChange,
  onClearFilters,
  onApplyFilters,
}) => {
  const t = useTranslations("Shop.filter");

  useEffect(() => {
    // closing sidebar while clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (!isOpen) return;
      if ((event.target as Element).closest(".sidebar-content")) return;
      onToggle();
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <>
      {/* <!-- Sidebar Start --> */}
      <div
        className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
          isOpen
            ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
            : "-translate-x-full"
        }`}
      >
        <button
          onClick={onToggle}
          aria-label="button for product sidebar toggle"
          className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
            stickyMenu
              ? "lg:top-20 sm:top-34.5 top-35"
              : "lg:top-24 sm:top-39 top-37"
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
              fill=""
            />
          </svg>
        </button>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-6">
            {/* <!-- filter box --> */}
            <div className="bg-white shadow-1 rounded-lg py-4 px-5">
              <div className="flex flex-col items-center justify-between mb-3 gap-5">
                <div className="w-full flex justify-between">
                  <p>{t("title")}</p>
                  <button
                    type="button"
                    className="text-blue"
                    onClick={onClearFilters}
                  >
                    {t("clearAll")}
                  </button>
                </div>
                <button
                  type="button"
                  className="w-full bg-blue text-white rounded py-2"
                  onClick={onApplyFilters}
                >
                  {t("applyFilter")}
                </button>
              </div>
            </div>

            {/* // <!-- price range box --> */}
            <PriceDropdown
              title={t("price")}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={onMinPriceChange}
              setMaxPrice={onMaxPriceChange}
            />

            {/* <!-- category box --> */}
            <CategoryDropdown
              title={t("category")}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={onCategoryChange}
            />

            {/* <!-- brand filter box --> */}
            <div className="bg-white shadow-1 rounded-lg py-4 px-5">
              <h4 className="text-dark font-semibold mb-3">
                {t("brand.title")}
              </h4>
              <select
                value={selectedBrand}
                onChange={(e) => onBrandChange(e.target.value)}
                className="w-full border border-gray-3 rounded px-3 py-2"
              >
                <option value="">{t("brand.all")}</option>
                <option value="Hilkent">{t("brand.hilkent")}</option>
                <option value="Aurora">{t("brand.aurora")}</option>
                <option value="Nova">{t("brand.nova")}</option>
                <option value="Terra">{t("brand.terra")}</option>
              </select>
            </div>

            {/* <!-- rating filter box --> */}
            <div className="bg-white shadow-1 rounded-lg py-4 px-5">
              <h4 className="text-dark font-semibold mb-3">
                {t("rating.title")}
              </h4>
              <select
                value={minRating}
                onChange={(e) => onMinRatingChange(Number(e.target.value))}
                className="w-full border border-gray-3 rounded px-3 py-2"
              >
                <option value={0}>{t("rating.all")}</option>
                <option value={1}>{t("rating.1star")}</option>
                <option value={2}>{t("rating.2stars")}</option>
                <option value={3}>{t("rating.3stars")}</option>
                <option value={4}>{t("rating.4stars")}</option>
                <option value={5}>{t("rating.5stars")}</option>
              </select>
            </div>

            {/* // <!-- size box --> */}
            <SizeDropdown title={t("size")} />

            {/* // <!-- color box --> */}
            <ColorsDropdwon title={t("color")} />
          </div>
        </form>
      </div>
      {/* // <!-- Sidebar End --> */}
    </>
  );
};

export default Sidebar;
