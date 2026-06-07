import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface CouponProps {
  couponCode: string;
  onCouponApply: (couponCode: string) => void;
}

const Coupon: React.FC<CouponProps> = ({ couponCode, onCouponApply }) => {
  const t = useTranslations("Checkout");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      await onCouponApply(inputValue);
      setInputValue("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">{t("coupon.title")}</h3>
      </div>

      <div className="py-8 px-4 sm:px-8.5">
        <div className="flex gap-4">
          <input
            type="text"
            name="coupon"
            id="coupon"
            placeholder={t("coupon.placeholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />

          <button
            onClick={() => handleApply()}
            disabled={isLoading || !inputValue.trim()}
            className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? t("coupon.validating") : t("coupon.apply")}
          </button>
        </div>
        {couponCode && (
          <p className="text-green-600 text-sm mt-2">
            {t("coupon.applied", { code: couponCode })}
          </p>
        )}
      </div>
    </div>
  );
};

export default Coupon;
