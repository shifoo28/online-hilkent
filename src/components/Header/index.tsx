"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";
import WishlistLink from "../Common/WishlistLink";
import { useCart } from "@/hooks/useCart";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import ExHeader from "./ExHeader";
import { UserIcon, SearchIcon, PhoneIcon, CartIcon } from "../Icons";
import LanguageSwitcher from "../Common/LanguageSwitcher";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const router = useRouter();
  const { openCartModal } = useCartModalContext();

  const { items: product, totalPrice } = useCart();

  const translate = useTranslations("Header");
  const breakpoint = useBreakpoint();

  const handleOpenCartModal = () => {
    openCartModal();
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = searchQuery.trim();

    if (keyword.length > 0) {
      router.push(`/shop-with-sidebar?search=${encodeURIComponent(keyword)}`);
      return;
    }

    router.push("/shop-with-sidebar");
  };

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    const phone = localStorage.getItem("verifiedPhoneNumber");
    if (phone) {
      setPhoneNumber(phone);
    }

    window.addEventListener("scroll", handleStickyMenu);

    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-white transition-all ease-in-out duration-300 ${
        stickyMenu && "shadow"
      }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        {/* <!-- header top start --> */}
        <div
          className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${
            stickyMenu ? "py-4" : "py-6"
          }`}
        >
          {/* <!-- header top left --> */}
          <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
            <div className="flex justify-between items-center gap-5">
              <Link className="flex-shrink-0" href="/">
                <Image
                  src="/images/logo/logo.png"
                  alt="Logo"
                  width={171}
                  height={36}
                />
              </Link>

              {breakpoint === "mobile" && <WishlistLink />}
            </div>

            <div className="max-w-[475px] w-full">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center">
                  <LanguageSwitcher />

                  <div className="relative max-w-[333px] sm:min-w-[333px] w-full h-full">
                    {/* <!-- divider --> */}
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5.5 bg-gray-4"></span>
                    <input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      type="search"
                      name="search"
                      id="search"
                      placeholder={translate("search")}
                      autoComplete="off"
                      className="custom-search w-full rounded-r-[5px] bg-gray-1 !border-l-0 border border-gray-3 h-[46px] pl-4 outline-none ease-in duration-200"
                    />

                    <button
                      type="submit"
                      id="search-btn"
                      aria-label="Search"
                      className="flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 ease-in duration-200 hover:text-blue"
                    >
                      <SearchIcon width={18} height={18} fill="#6B7280" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* <!-- header top right --> */}
          <div className="flex w-full lg:w-auto items-center gap-7.5">
            <div className="flex items-center gap-3.5">
              <PhoneIcon width={24} height={24} fill="#3C50E0" />

              <div>
                <span className="block text-2xs text-dark-4 uppercase">
                  {translate("support")}
                </span>
                <p className="min-w-max font-medium text-custom-sm text-dark">
                  <Link
                    href="tel:+99362863012"
                    className="hover:text-blue ease-out duration-200"
                  >
                    62 86-30-12
                  </Link>
                </p>
              </div>
            </div>

            {/* <!-- divider --> */}
            <span className="hidden xl:block w-px h-7.5 bg-gray-4"></span>

            <div className="flex w-full lg:w-auto justify-between items-center gap-5">
              <div className="flex items-center gap-5">
                <Link
                  href={phoneNumber ? "/my-account" : "/signin"}
                  className="flex items-center gap-2.5"
                >
                  <UserIcon width={24} height={24} fill="#3C50E0" />

                  <div>
                    <span className="block text-2xs text-dark-4 uppercase">
                      {translate("account.title")}
                    </span>
                    <p className="font-medium text-custom-sm text-dark">
                      {phoneNumber
                        ? phoneNumber
                        : translate("account.username")}
                    </p>
                  </div>
                </Link>

                {/* <!-- divider --> */}
                <span className="hidden xl:block w-px h-7.5 bg-gray-4"></span>

                <button
                  onClick={handleOpenCartModal}
                  className="flex items-center gap-2.5"
                >
                  <span className="inline-block relative">
                    <CartIcon width={24} height={24} fill="#3C50E0" />

                    <span className="flex items-center justify-center font-medium text-2xs absolute -right-2 -top-2.5 bg-blue w-4.5 h-4.5 rounded-full text-white">
                      {product.length}
                    </span>
                  </span>

                  <div>
                    <span className="block text-2xs text-dark-4 uppercase">
                      {translate("cart.title")}
                    </span>
                    <p className="min-w-max font-medium text-custom-sm text-dark">
                      {totalPrice} TMT
                    </p>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-5">
                {breakpoint === "tablet" && <ExHeader translate={translate} />}

                {/* <!-- Hamburger Toggle BTN --> */}
                <button
                  id="Toggle"
                  aria-label="Toggler"
                  className="lg:hidden block"
                  onClick={() => setNavigationOpen(!navigationOpen)}
                >
                  <span className="block relative cursor-pointer w-5.5 h-5.5">
                    <span className="du-block absolute right-0 w-full h-full">
                      <span
                        className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${
                          !navigationOpen && "!w-full delay-300"
                        }`}
                      ></span>
                      <span
                        className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${
                          !navigationOpen && "!w-full delay-400"
                        }`}
                      ></span>
                      <span
                        className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${
                          !navigationOpen && "!w-full delay-500"
                        }`}
                      ></span>
                    </span>

                    <span className="block absolute right-0 w-full h-full rotate-45">
                      <span
                        className={`block bg-dark rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${
                          !navigationOpen && "!h-0 delay-[0] "
                        }`}
                      ></span>
                      <span
                        className={`block bg-dark rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${
                          !navigationOpen && "!h-0 dealy-200"
                        }`}
                      ></span>
                    </span>
                  </span>
                </button>
                {/* //   <!-- Hamburger Toggle BTN --> */}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- header top end --> */}
      </div>

      <div className="border-t border-gray-3">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
          <div className="flex items-center justify-between">
            {/* <!--=== Main Nav Start ===--> */}
            <div
              className={`w-[288px] absolute right-4 top-full lg:static lg:w-auto h-0 lg:h-auto invisible lg:visible lg:flex items-center justify-between ${
                navigationOpen &&
                `!visible bg-white shadow-lg border border-gray-3 !h-auto max-h-[400px] overflow-y-scroll rounded-md p-5`
              }`}
            >
              {/* <!-- Main Nav Start --> */}
              <nav>
                <ul className="flex lg:items-center flex-col lg:flex-row gap-5 xl:gap-6">
                  {menuData.map((menuItem, i) =>
                    menuItem.submenu ? (
                      <Dropdown
                        key={i}
                        menuItem={menuItem}
                        stickyMenu={stickyMenu}
                      />
                    ) : (
                      <li
                        key={i}
                        className="group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full "
                      >
                        <Link
                          href={menuItem.path}
                          className={`hover:text-blue text-custom-sm font-medium text-dark flex ${
                            stickyMenu ? "xl:py-4" : "xl:py-6"
                          }`}
                        >
                          {menuItem.id === 1
                            ? translate("menu.popular")
                            : menuItem.id === 2
                              ? translate("menu.shop")
                              : menuItem.id === 3
                                ? translate("menu.contact")
                                : menuItem.title}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
              {/* //   <!-- Main Nav End --> */}
            </div>

            {breakpoint === "desktop" && <ExHeader translate={translate} />}
            {/* // <!--=== Main Nav End ===--> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
