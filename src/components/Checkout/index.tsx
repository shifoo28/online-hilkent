"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const router = useRouter();
  const { items: cartItems, totalPrice: cartTotal } = useCart();
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

  // Calculate shipping fee based on method
  useEffect(() => {
    switch (formData.shippingMethod) {
      case "fedex":
        setShippingFee(10.99);
        break;
      case "dhl":
        setShippingFee(15.99);
        break;
      default:
        setShippingFee(0);
    }
  }, [formData.shippingMethod]);

  const subtotal = cartTotal;
  const total = subtotal - couponDiscount + shippingFee;

  const handleCouponApply = async (couponCode: string) => {
    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (data.valid) {
        updateField("couponCode", couponCode);
        const discount = data.coupon.discountAmount || 0;
        setCouponDiscount(discount);
      } else {
        setOrderError(data.error || "Invalid coupon");
      }
    } catch (error) {
      setOrderError("Failed to validate coupon");
      console.error("Coupon validation error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setOrderError("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      setOrderError("Your cart is empty");
      return;
    }

    setOrderError(null);
    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.discountedPrice || item.price,
        })),
        billingDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.billingPhone,
          address: formData.billingAddress,
          town: formData.billingTown,
          country: formData.billingCountry,
          postCode: formData.billingPostCode,
        },
        shippingDetails: !formData.shippingAddressSame
          ? {
              address: formData.shippingAddress,
              town: formData.shippingTown,
              country: formData.shippingCountry,
              postCode: formData.shippingPostCode,
            }
          : undefined,
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod,
        couponCode: formData.couponCode || undefined,
        notes: formData.notes || undefined,
        subtotal,
        shippingFee,
        discount: couponDiscount,
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
        resetForm();
        // Redirect to success page or show success message
        setTimeout(() => {
          router.push("/order-success");
        }, 2000);
      } else {
        setOrderError(result.error || "Failed to create order");
      }
    } catch (error) {
      setOrderError("An error occurred while processing your order");
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {orderError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {orderError}
            </div>
          )}

          {orderSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              Order created successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- login box --> */}
                <Login
                  emails={formData.loginEmail}
                  password={formData.loginPassword}
                  onEmailChange={(val) => updateField("loginEmail", val)}
                  onPasswordChange={(val) => updateField("loginPassword", val)}
                />

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

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {/* <!-- cart items --> */}
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-5 border-b border-gray-3"
                        >
                          <div>
                            <p className="text-dark">
                              {item.title} x {item.quantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-dark text-right">
                              {(
                                (item.discountedPrice || item.price) *
                                item.quantity
                              ).toFixed(2)}{" "}
                              TMT
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-5 border-b border-gray-3">
                        <p className="text-dark">Your cart is empty</p>
                      </div>
                    )}

                    {/* <!-- product item --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Subtotal</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">
                          {subtotal.toFixed(2)} TMT
                        </p>
                      </div>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">Discount</p>
                        </div>
                        <div>
                          <p className="text-dark text-right text-green-600">
                            -{couponDiscount.toFixed(2)} TMT
                          </p>
                        </div>
                      </div>
                    )}

                    {shippingFee > 0 && (
                      <div className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">Shipping Fee</p>
                        </div>
                        <div>
                          <p className="text-dark text-right">
                            {shippingFee.toFixed(2)} TMT
                          </p>
                        </div>
                      </div>
                    )}

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          {total.toFixed(2)} TMT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- coupon box --> */}
                <Coupon
                  couponCode={formData.couponCode}
                  onCouponApply={handleCouponApply}
                />

                {/* <!-- shipping box --> */}
                <ShippingMethod
                  selectedMethod={formData.shippingMethod}
                  onMethodChange={(method) =>
                    updateField("shippingMethod", method)
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
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Process to Checkout"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
