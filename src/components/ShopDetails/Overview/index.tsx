"use client";
import React, { useMemo, useState } from "react";
import { ReviewList, ReviewForm } from "../../Review";
import { tabs } from "../data";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { getDatabaseLocale } from "@/locales/map";
import { ProductPropertyWithTranslations } from "@/types/product";

interface OverviewProps {
  id: string;
  description?: string;
  properties?: ProductPropertyWithTranslations[];
}

const Overview = ({ id, description, properties }: OverviewProps) => {
  const translate = useTranslations("ShopDetails.overview");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("tabOne");
  const { user } = useAuth();

  const localeKey = useMemo(() => getDatabaseLocale(locale), [locale]);

  const formatPropertyName = (property: ProductPropertyWithTranslations) => {
    return (
      property.name.propertyNameTranslations.find(
        (translation) => translation.locale === localeKey,
      )?.name ||
      property.name.propertyNameTranslations[0]?.name ||
      property.name.name ||
      ""
    );
  };

  return (
    <section className="overflow-hidden bg-gray-2 py-10">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!--== tab header start ==--> */}
        <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
          {tabs.map((item, key) => (
            <button
              key={key}
              onClick={() => setActiveTab(item.id)}
              className={`font-medium lg:text-lg ease-out duration-200 hover:text-blue relative before:h-0.5 before:bg-blue before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${
                activeTab === item.id
                  ? "text-blue before:w-full"
                  : "text-dark before:w-0"
              }`}
            >
              {item.id === "tabOne"
                ? translate("review.title")
                : item.id === "tabTwo"
                  ? translate("specification.title")
                  : translate("description.title")}
            </button>
          ))}
        </div>
        {/* <!--== tab header end ==--> */}

        {/* <!--== tab content start ==--> */}
        {/* <!-- tab content one start --> */}
        <div
          className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-5 ${
            activeTab === "tabOne" ? "flex" : "hidden"
          }`}
        >
          <div className="max-w-[570px] w-full">
            <ReviewList productId={id} userId={user?.id} />
          </div>

          <div className="max-w-[550px] w-full">
            {user ? (
              <ReviewForm
                productId={id}
                userId={user.id}
                onReviewSubmitted={() => {
                  // Refresh the page or update reviews list
                  window.location.reload();
                }}
              />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-1 text-center">
                <p className="text-dark-2 mb-4">
                  {translate("review.noUser.message")}
                </p>
                <a
                  href="/signin"
                  className="inline-block bg-blue text-white px-6 py-2 rounded-md hover:bg-blue-dark transition-colors"
                >
                  {translate("review.noUser.button")}
                </a>
              </div>
            )}
          </div>
        </div>
        {/* <!-- tab content one end --> */}

        {/* <!-- tab content two start --> */}
        <div>
          <div
            className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-5 min-h-[200px] ${
              activeTab === "tabTwo" ? "block" : "hidden"
            }`}
          >
            {/* <!-- info item --> */}
            {properties && properties.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {properties.map((prop) => (
                  <li
                    key={prop.id}
                    className="flex justify-between border-b border-gray-3 py-2"
                  >
                    <div className="max-w-[450px] min-w-[140px] w-full">
                      <p className="text-sm sm:text-base text-dark">
                        {formatPropertyName(prop)}
                      </p>
                    </div>

                    <div className="w-full">
                      <p className="text-sm sm:text-base text-dark-2">
                        {prop.value}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm sm:text-base text-dark w-full text-center">
                {translate("specification.noSpecification")}
              </p>
            )}
          </div>
        </div>
        {/* <!-- tab content two end --> */}

        {/* <!-- tab content three start --> */}
        <div>
          <div
            className={`flex-col bg-white mt-5 rounded-lg shadow-1 text-center sm:flex-row gap-7.5 xl:gap-12.5 min-h-[200px] p-4 sm:p-6 ${
              activeTab === "tabThree" ? "flex" : "hidden"
            }`}
          >
            {description ? (
              <p className="text-sm sm:text-base text-dark text-left">
                {description}
              </p>
            ) : (
              <p className="text-sm sm:text-base text-dark w-full text-center">
                {translate("description.noDescription")}
              </p>
            )}
          </div>
        </div>
        {/* <!-- tab content three end --> */}
      </div>
      {/* <!--== tab content end ==--> */}
    </section>
  );
};

export default Overview;
