"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useAddresses } from "@/hooks/useAddresses";
import { useRouter } from "next/navigation";
import { getDatabaseLocale } from "@/locales/map";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import OrderSummary from "./OrderSummary";
import Notes from "./Notes";
import { useShippingMethods } from "@/hooks/useShippingMethods";

const Checkout = () => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Checkout");
  const { user, loading: authLoading } = useAuth();
  const { getDefaultAddress, loading: addressesLoading } = useAddresses();
  const {
    items: cartItems,
    totalPrice: cartTotal,
    removeAllItemsFromCart,
  } = useCart();
  const { shippingMethods, getMethodFee } = useShippingMethods();

  const cartItemsWithTitle = cartItems.map((item) => ({
    ...item,
    title:
      item.translations.find((t) => t.locale === getDatabaseLocale(locale))
        ?.name || "Product",
  }));

  const {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    updateMultipleFields,
    validateForm,
    resetForm,
  } = useCheckoutForm();

  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  // Set default shipping method from first available method
  useEffect(() => {
    if (shippingMethods.length > 0 && formData.shippingMethodId === null) {
      updateField("shippingMethodId", shippingMethods[0].id);
    }
  }, [shippingMethods, formData.shippingMethodId, updateField]);

  // Auto-fill billing form if user is authenticated
  useEffect(() => {
    // Wait until auth finished and addresses have been loaded
    if (!authLoading && !addressesLoading && user && !autoFilled) {
      const updates: Record<string, any> = {};

      // Auto-fill name fields
      if (user.name) {
        const nameParts = user.name.trim().split(/\s+/);
        updates.firstName = nameParts[0] || "";
        updates.lastName = nameParts.slice(1).join(" ") || "";
      }

      // Auto-fill email
      if (user.email) {
        updates.email = user.email;
      }

      // Auto-fill phone
      if (user.phone) {
        updates.billingPhone = user.phone;
      }

      // Try to auto-fill from default billing address if available
      const defaultBillingAddress = getDefaultAddress("billing");
      if (defaultBillingAddress) {
        updates.billingAddress = defaultBillingAddress.address;
        updates.selectedBillingAddressId = defaultBillingAddress.id;
      }

      if (Object.keys(updates).length > 0) {
        updateMultipleFields(updates);
      }

      setAutoFilled(true);
    }
  }, [
    user,
    authLoading,
    autoFilled,
    updateMultipleFields,
    getDefaultAddress,
    addressesLoading,
  ]);

  // Calculate shipping fee based on selected method
  useEffect(() => {
    if (formData.shippingMethodId !== null) {
      const fee = getMethodFee(formData.shippingMethodId);
      setShippingFee(fee || 0);
    }
  }, [formData.shippingMethodId, getMethodFee]);

  const subtotal = cartTotal;
  const total = subtotal - couponDiscount + shippingFee;

  const handleCouponApply = async (couponCode: string) => {
    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, orderSubtotal: subtotal }),
      });

      const data = await response.json();

      if (data.valid) {
        updateField("couponCode", couponCode);
        const discount = data.coupon.discountAmount || 0;
        setCouponDiscount(discount);
      } else {
        setOrderError(data.error || t("errors.couponInvalid"));
      }
    } catch (error) {
      setOrderError(t("errors.couponFailed"));
      console.error("Coupon validation error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setOrderError(t("errors.fillRequired"));
      return;
    }

    if (cartItemsWithTitle.length === 0) {
      setOrderError(t("errors.cartEmpty"));
      return;
    }

    if (formData.shippingMethodId === null) {
      setOrderError(
        t("errors.selectShippingMethod") || "Please select a shipping method",
      );
      return;
    }

    setOrderError(null);
    setIsSubmitting(true);

    try {
      // Prepare order data with shippingMethodId
      const orderData = {
        items: cartItemsWithTitle.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.discountedPrice || item.price,
        })),
        billingDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.billingPhone,
          address: formData.billingAddress,
        },
        shippingAddress: !formData.shippingAddressSame
          ? formData.shippingAddress
          : undefined,
        shippingMethodId: formData.shippingMethodId,
        shippingFee,
        paymentMethod: formData.paymentMethod,
        couponCode: formData.couponCode || undefined,
        note: formData.note || undefined,
        subtotal,
        discountAmount: couponDiscount,
        total,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        setOrderSuccess(true);
        removeAllItemsFromCart();
        resetForm();
        // Redirect to success page or show success message
        setTimeout(() => {
          router.push("/order-success");
        }, 2000);
      } else {
        setOrderError(result.error || t("errors.orderFailed"));
      }
    } catch (error) {
      setOrderError(t("errors.orderError"));
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title={t("title")} pages={[t("page")]} />
      <section className="overflow-hidden py-10 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {orderError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {orderError}
            </div>
          )}

          {orderSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {t("errors.orderSuccess")}
            </div>
          )}

          <div>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- login box --> */}
                {/* <Login
                  emails={formData.loginEmail}
                  password={formData.loginPassword}
                  onEmailChange={(val) => updateField("loginEmail", val)}
                  onPasswordChange={(val) => updateField("loginPassword", val)}
                /> */}

                {/* <!-- billing details --> */}
                <Billing
                  formData={formData}
                  errors={errors}
                  onChange={updateField}
                />

                {/* <!-- address box two --> */}
                <Shipping
                  formData={formData}
                  errors={errors}
                  onChange={updateField}
                  onAddressSameChange={(val) =>
                    updateField("shippingAddressSame", val)
                  }
                />

                <Notes
                  value={formData.note}
                  onChange={(val) => updateField("note", val)}
                />
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <OrderSummary
                  cartItemsWithTitle={cartItemsWithTitle}
                  subtotal={subtotal}
                  couponDiscount={couponDiscount}
                  shippingFee={shippingFee}
                  total={total}
                />

                {/* <!-- coupon box --> */}
                <Coupon
                  couponCode={formData.couponCode}
                  onCouponApply={handleCouponApply}
                />

                {/* <!-- shipping box --> */}
                <ShippingMethod
                  selectedMethodId={formData.shippingMethodId}
                  onMethodChange={(methodId) =>
                    updateField("shippingMethodId", methodId)
                  }
                />

                {/* <!-- payment box --> */}
                <PaymentMethod
                  selectedMethod={formData.paymentMethod}
                  onMethodChange={(method) =>
                    updateField("paymentMethod", method)
                  }
                />

                {/* <!-- checkout button --> */}
                <button
                  type="button"
                  onClick={(e) =>
                    handleSubmit(
                      e as unknown as React.FormEvent<HTMLFormElement>,
                    )
                  }
                  disabled={isSubmitting || cartItemsWithTitle.length === 0}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? t("buttons.processing")
                    : t("buttons.placeOrder")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
