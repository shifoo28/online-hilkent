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
      <button
        onClick={onToggle}
        aria-label="button for product sidebar toggle"
        className="xl:hidden z-1 px-4 py-1 fixed -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-tl-3xl rounded-tr-3xl bg-blue shadow-1 rotate-90"
      >
        <p className="text-white text-lg">Filtr</p>
      </button>
      <div
        className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
          isOpen
            ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
            : "-translate-x-full"
        }`}
      >
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
            {/* <SizeDropdown title={t("size")} /> */}

            {/* // <!-- color box --> */}
            {/* <ColorsDropdwon title={t("color")} /> */}
          </div>
        </form>
      </div>
      {/* // <!-- Sidebar End --> */}
    </>
  );
};

export default Sidebar;
