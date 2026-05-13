import React from "react";
import { useTranslations } from "next-intl";
import { CheckoutFormData } from "@/hooks/useCheckoutForm";
import AddressSelection from "../Common/AddressSelection";

interface BillingProps {
  formData: CheckoutFormData;
  errors: Record<string, string>;
  onChange: (field: keyof CheckoutFormData, value: any) => void;
}

const Billing: React.FC<BillingProps> = ({ formData, errors, onChange }) => {
  const t = useTranslations("Checkout");

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h2 className="font-medium text-dark text-xl">{t("billing.title")}</h2>
      </div>
      <div className="p-4 sm:p-8.5">
        {/* Saved Addresses Section */}
        <AddressSelection
          formData={formData}
          onChange={onChange}
          addressType="billing"
        />

        {/* Manual Entry Form */}
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="firstName" className="block mb-2.5">
              {t("billing.firstName")} <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Aman"
              value={formData.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
                errors.firstName ? "border-red text-red" : "border-gray-3"
              }`}
            />
            {errors.firstName && (
              <p className="text-red text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="block mb-2.5">
              {t("billing.lastName")}
            </label>

            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Amanow"
              value={formData.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
                errors.lastName ? "border-red text-red" : "border-gray-3"
              }`}
            />
            {errors.lastName && (
              <p className="text-red text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="companyName" className="block mb-2.5">
            {t("billing.companyName")}
          </label>

          <input
            type="text"
            name="companyName"
            id="companyName"
            value={formData.companyName}
            onChange={(e) => onChange("companyName", e.target.value)}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        {/* <div className="mb-5">
          <label htmlFor="countryName" className="block mb-2.5">
            {t("billing.country")}
            <span className="text-red">*</span>
          </label>

          <div className="relative">
            <select
              value={formData.billingCountry}
              onChange={(e) => onChange("billingCountry", e.target.value)}
              className={`w-full bg-gray-1 rounded-md border text-dark-4 py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
                errors.billingCountry ? "border-red" : "border-gray-3"
              }`}
            >
              <option value="">{t("billing.selectCountry")}</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Australia">Australia</option>
              <option value="America">America</option>
              <option value="England">England</option>
            </select>

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-4">
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.41469 5.03569L2.41467 5.03571L2.41749 5.03846L7.76749 10.2635L8.0015 10.492L8.23442 10.2623L13.5844 4.98735L13.5844 4.98735L13.5861 4.98569C13.6809 4.89086 13.8199 4.89087 13.9147 4.98569C14.0092 5.08024 14.0095 5.21864 13.9155 5.31345C13.9152 5.31373 13.915 5.31401 13.9147 5.31429L8.16676 10.9622L8.16676 10.9622L8.16469 10.9643C8.06838 11.0606 8.02352 11.0667 8.00039 11.0667C7.94147 11.0667 7.89042 11.0522 7.82064 10.9991L2.08526 5.36345C1.99127 5.26865 1.99154 5.13024 2.08609 5.03569C2.18092 4.94086 2.31986 4.94086 2.41469 5.03569Z"
                  fill=""
                  stroke=""
                  strokeWidth="0.666667"
                />
              </svg>
            </span>
          </div>
          {errors.billingCountry && (
            <p className="text-red text-sm mt-1">{errors.billingCountry}</p>
          )}
        </div> */}

        <div className="mb-5">
          <label htmlFor="address" className="block mb-2.5">
            {t("billing.streetAddress")}
            <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="address"
            id="address"
            placeholder={t("billing.housePlaceholder")}
            value={formData.billingAddress}
            onChange={(e) => onChange("billingAddress", e.target.value)}
            className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
              errors.billingAddress ? "border-red" : "border-gray-3"
            }`}
          />
          {errors.billingAddress && (
            <p className="text-red text-sm mt-1">{errors.billingAddress}</p>
          )}
        </div>

        {/* <div className="mb-5">
          <label htmlFor="town" className="block mb-2.5">
            {t("billing.town")} <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="town"
            id="town"
            value={formData.billingTown}
            onChange={(e) => onChange("billingTown", e.target.value)}
            className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
              errors.billingTown ? "border-red" : "border-gray-3"
            }`}
          />
          {errors.billingTown && (
            <p className="text-red text-sm mt-1">{errors.billingTown}</p>
          )}
        </div> */}

        {/* <div className="mb-5">
          <label htmlFor="postCode" className="block mb-2.5">
            {t("billing.postalCode")}
          </label>

          <input
            type="text"
            name="postCode"
            id="postCode"
            value={formData.billingPostCode}
            onChange={(e) => onChange("billingPostCode", e.target.value)}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div> */}

        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            {t("billing.phone")} <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="phone"
            id="phone"
            value={formData.billingPhone}
            onChange={(e) => onChange("billingPhone", e.target.value)}
            className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
              errors.billingPhone ? "border-red" : "border-gray-3"
            }`}
          />
          {errors.billingPhone && (
            <p className="text-red text-sm mt-1">{errors.billingPhone}</p>
          )}
        </div>

        <div className="mb-5.5">
          <label htmlFor="email" className="block mb-2.5">
            {t("billing.email")}
          </label>

          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
              errors.email ? "border-red" : "border-gray-3"
            }`}
          />
          {errors.email && (
            <p className="text-red text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
