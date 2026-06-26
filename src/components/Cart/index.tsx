"use client";
import React from "react";
import ApplyCoupon from "./ApplyCoupon";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { EmptyCartIcon } from "../Icons";

const Cart = () => {
  const { items: cartItems } = useCart();
  const translate = useTranslations("Cart");

  return (
    <>
      {/* <!-- ===== Breadcrumb Section Start ===== --> */}
      <section>
        <Breadcrumb title={translate("title")} pages={[translate("page")]} />
      </section>
      {/* <!-- ===== Breadcrumb Section End ===== --> */}
      {cartItems.length > 0 ? (
        <section className="overflow-hidden py-10 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <h2 className="font-medium text-dark text-2xl">
                {translate("table.title")}
              </h2>
              <button className="text-blue">
                {translate("table.clearCart")}
              </button>
            </div>

            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-full">
                  {/* <!-- table header --> */}
                  <div className="hidden md:flex items-center py-5.5 px-7.5">
                    <div className="min-w-[250px] w-full">
                      <p className="text-dark">{translate("table.product")}</p>
                    </div>

                    <div className="max-w-[180px] w-full text-center min-w-max pr-2">
                      <p className="text-dark">{translate("table.price")}</p>
                    </div>

                    <div className="max-w-[158px] w-full text-center">
                      <p className="text-dark">{translate("table.quantity")}</p>
                    </div>

                    <div className="max-w-[200px] w-full text-center">
                      <p className="text-dark">{translate("table.subtotal")}</p>
                    </div>

                    <div className="max-w-[80px] w-full ">
                      <p className="text-dark text-center">
                        {translate("table.actions")}
                      </p>
                    </div>
                  </div>

                  {/* <!-- cart item --> */}
                  {cartItems.length > 0 &&
                    cartItems.map((item, key) => (
                      <CartItem item={item} key={key} />
                    ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-9">
              <ApplyCoupon />
              <OrderSummary />
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className="text-center my-17">
            <div className="mx-auto pb-7.5">
              <EmptyCartIcon width={150} height={150} />
            </div>

            <p className="pb-6">{translate("empty")}</p>

            <Link
              href="/shop-with-sidebar"
              className="w-96 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
            >
              {translate("continueShopping")}
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
