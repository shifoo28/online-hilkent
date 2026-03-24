import React from "react";
import OrderSuccess from "@/components/OrderSuccess";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Order Success | Hilkent Nextjs E-commerce web app",
  description: "Your order has been successfully placed",
  // other metadata
};

const OrderSuccessPage = () => {
  return (
    <main>
      <OrderSuccess />
    </main>
  );
};

export default OrderSuccessPage;
