import React from "react";

import { Metadata } from "next";
import OTP from "@/components/Auth/OTP";
export const metadata: Metadata = {
  title: "OTP Page | Hilkent Nextjs E-commerce web app",
  description: "This is OTP Page for Hilkent Web App",
  // other metadata
};

const OTPPage = () => {
  return (
    <main>
      <OTP />
    </main>
  );
};

export default OTPPage;
