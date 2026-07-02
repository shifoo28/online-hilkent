import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckoutFormData } from "@/hooks/useCheckoutForm";
import AddressSelection from "../Common/AddressSelection";

interface ShippingProps {
  formData: CheckoutFormData;
  errors: Record<string, string>;
  onChange: (field: keyof CheckoutFormData, value: any) => void;
  onAddressSameChange: (value: boolean) => void;
}

const Shipping: React.FC<ShippingProps> = ({
  formData,
  errors,
  onChange,
  onAddressSameChange,
}) => {
  const t = useTranslations("Checkout");
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="flex items-center gap-2.5 font-medium text-lg text-dark py-5 px-5.5">
        {t("shipping.differentAddress")}
        {/* <svg
          className={`fill-current ease-out duration-200 ${
            dropdown && "rotate-180"
          }`}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
            fill=""
          />
        </svg> */}
      </div>

      {/* <!-- dropdown menu --> */}
      {!formData.shippingAddressSame && dropdown && (
        <div className="p-4 sm:p-8.5">
          {/* Saved Addresses Section */}
          <AddressSelection
            formData={formData}
            onChange={onChange}
            addressType="shipping"
          />

          {/* Manual Entry Form */}
          <div className="mb-5">
            <label htmlFor="address" className="block mb-2.5">
              {t("billing.streetAddress")}
              <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="shippingAddress"
              placeholder={t("billing.housePlaceholder")}
              value={formData.shippingAddress}
              onChange={(e) => onChange("shippingAddress", e.target.value)}
              className={`rounded-md border bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 ${
                errors.shippingAddress ? "border-red" : "border-gray-3"
              }`}
            />
            {errors.shippingAddress && (
              <p className="text-red text-sm mt-1">{errors.shippingAddress}</p>
            )}

            <div className="mt-5">
              <input
                type="text"
                name="address"
                placeholder={t("billing.apartmentPlaceholder")}
                value={formData.shippingAddressTwo}
                onChange={(e) => onChange("shippingAddressTwo", e.target.value)}
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-8.5 border-t border-gray-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.shippingAddressSame}
            onChange={(e) => {
              onAddressSameChange(e.target.checked);
              setDropdown(!e.target.checked); // Open dropdown if unchecked
            }}
            className="w-4 h-4"
          />
          <span className="text-dark">{t("shipping.sameAsBilling")}</span>
        </label>
      </div>
    </div>
  );
};

export default Shipping;
