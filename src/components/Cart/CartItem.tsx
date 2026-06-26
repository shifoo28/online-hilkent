import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { RemoveIcon } from "@/components/Icons";

import Image from "next/image";
import { getDatabaseLocale } from "@/locales/map";
import { useLocale } from "next-intl";
import { CartItemType } from "@/context/CartContext";

const CartItem = ({ item }: { item: CartItemType }) => {
  const locale = useLocale();
  const [quantity, setQuantity] = useState(item.quantity);
  const title =
    item.translations.find((t) => t.locale === getDatabaseLocale(locale))
      ?.name || "Product";

  const { removeItemFromCart, updateCartItemQuantity } = useCart();

  const handleRemoveFromCart = () => {
    removeItemFromCart(item.id);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
    updateCartItemQuantity({ id: item.id, quantity: quantity + 1 });
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      updateCartItemQuantity({ id: item.id, quantity: quantity - 1 });
    } else {
      return;
    }
  };

  const price = item.discountedPrice ?? item.price;
  const total = price * quantity;

  return (
    <div className="flex flex-col border-t border-gray-3 py-5 px-4 sm:px-7.5 sm:flex-row sm:items-center">
      <div className="flex min-w-[250px] w-full justify-between">
        <div className="flex items-start gap-4 sm:items-center">
          <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-20 sm:h-17.5">
            <Image
              width={200}
              height={200}
              src={item.images[0].thumbnail}
              alt="product"
              className="object-contain"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-dark ease-out duration-200 hover:text-blue line-clamp-2">
              <a href="#">{title}</a>
            </h3>
          </div>
        </div>
        <button
          onClick={() => handleRemoveFromCart()}
          aria-label="button for remove product from cart"
          className="sm:hidden flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <RemoveIcon
            className="fill-current"
            width={22}
            height={22}
            aria-label="Remove item"
          />
        </button>
      </div>

      <div className="text-center w-full sm:max-w-[180px] py-1">
        <p className="text-center w-full mx-1 text-green">{price} TMT</p>
      </div>

      <div className="w-full flex justify-center py-1">
        <div className="flex w-full max-w-max items-center rounded-md border border-gray-3">
          <button
            onClick={handleDecreaseQuantity}
            aria-label="button for remove product"
            className="flex items-center justify-center w-11.5 h-11.5 ease-out duration-200 hover:text-blue"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z"
                fill=""
              />
            </svg>
          </button>

          <span className="flex items-center justify-center w-16 h-11.5 border-x border-gray-4">
            {quantity}
          </span>

          <button
            onClick={() => handleIncreaseQuantity()}
            aria-label="button for add product"
            className="flex items-center justify-center w-11.5 h-11.5 ease-out duration-200 hover:text-blue"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z"
                fill=""
              />
              <path
                d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="sm:max-w-[200px] w-full text-center py-1">
        <p className="text-dark w-full mx-1">{total} TMT</p>
      </div>

      <div className="hidden sm:flex justify-center sm:max-w-[80px] w-full">
        <button
          onClick={() => handleRemoveFromCart()}
          aria-label="button for remove product from cart"
          className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <RemoveIcon
            className="fill-current"
            width={22}
            height={22}
            aria-label="Remove item"
          />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
