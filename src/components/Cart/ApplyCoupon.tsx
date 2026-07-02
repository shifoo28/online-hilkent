import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface ApplyCouponProps {
  onApply: (couponCode: string) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  successMessage?: string | null;
  appliedCouponCode?: string | null;
}

const ApplyCoupon = ({
  onApply,
  isLoading,
  error,
  successMessage,
  appliedCouponCode,
}: ApplyCouponProps) => {
  const translate = useTranslations("Cart.discount");
  const [couponInput, setCouponInput] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCode = couponInput.trim();

    if (!trimmedCode) return;

    const isSuccess = await onApply(trimmedCode);
    if (isSuccess) {
      setCouponInput("");
    }
  };

  return (
    <div className="lg:max-w-[670px] w-full">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-1 rounded-[10px]">
          <div className="border-b border-gray-3 py-5 px-4 sm:px-5.5">
            <h3 className="">{translate("title")}</h3>
          </div>

          <div className="py-8 px-4 sm:px-8.5">
            <div className="flex flex-wrap gap-4 xl:gap-5.5">
              <div className="max-w-[426px] w-full">
                <input
                  type="text"
                  name="coupon"
                  id="coupon"
                  placeholder={translate("placeholder")}
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !couponInput.trim()}
                className="inline-flex font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? translate("validating") : translate("apply")}
              </button>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            {successMessage && (
              <p className="mt-3 text-sm text-green-600">{successMessage}</p>
            )}
            {appliedCouponCode && !successMessage && (
              <p className="mt-3 text-sm text-green-600">
                {translate("applied", { code: appliedCouponCode })}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplyCoupon;
