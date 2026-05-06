"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { HeartIcon } from "@/components/Icons";

type WishlistLinkProps = {};

const WishlistLink = ({}: WishlistLinkProps) => {
  const translate = useTranslations("Header");
  const [itemsInWishlist, setItemsInWishlist] = useState(false);

  useEffect(() => {
    const wishlist = localStorage.getItem("wishlist");
    if (wishlist) {
      setItemsInWishlist(JSON.parse(wishlist).length > 0);
    }
  }, []);

  return (
    <Link
      href="/wishlist"
      className={`flex items-center gap-1.5 font-medium text-custom-sm text-gray-7 hover:text-blue`}
    >
      <HeartIcon
        className="fill-current"
        width={16}
        height={16}
        fill={itemsInWishlist ? "#FF0000" : undefined}
        aria-label="Wishlist"
      />
      <span className="">{translate("menu.wishlist")}</span>
    </Link>
  );
};

export default WishlistLink;
