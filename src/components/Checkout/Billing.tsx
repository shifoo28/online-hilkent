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

        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            {t("billing.phone")}
            <span className="text-gray-5 text-sm"> (6/7)x xxxxxx </span>{" "}
            <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="phone"
            pattern="^(6|7)\d{7}$"
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
