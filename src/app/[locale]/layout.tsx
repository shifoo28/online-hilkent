// import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../../context/QuickViewModalContext";
import { CartModalProvider } from "../../context/CartSidebarModalContext";
import { CartProvider } from "../../context/CartContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
// import PreLoader from "@/components/Common/PreLoader";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "../../context/AuthContext";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  // const [loading, setLoading] = useState<boolean>(true);
  const { locale } = await params;

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body>
        <NextIntlClientProvider>
          {/* {loading ? (
            <PreLoader />
          ) : ( */}
          <>
            <AuthProvider>
              <ReduxProvider>
                <CartProvider>
                  <CartModalProvider>
                    <ModalProvider>
                      <PreviewSliderProvider>
                        <Header />
                        {children}
                        <QuickViewModal />
                        <CartSidebarModal />
                        <PreviewSliderModal />
                      </PreviewSliderProvider>
                    </ModalProvider>
                  </CartModalProvider>
                </CartProvider>
              </ReduxProvider>
            </AuthProvider>
            <ScrollToTop />
            <Footer />
          </>
          {/* )} */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
