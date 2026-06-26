import { CartItemType } from "@/context/CartContext";
import { useTranslations } from "next-intl";

type OrderRowProps = {
  label: string;
  value?: string | number;
  highlight?: boolean;
  valueClass?: string;
};

const OrderRow = ({ label, value, highlight, valueClass }: OrderRowProps) => (
  <div className="flex items-center justify-between py-5 border-b border-gray-3">
    <p className={`text-gray-6 line-clamp-2 ${highlight ? "font-medium text-lg" : ""}`}>
      {label}
    </p>
    {value !== undefined && (
      <p
        className={`text-dark w-full max-w-max text-right ${highlight ? "font-medium text-lg" : ""} ${valueClass || ""}`}
      >
        {value}
      </p>
    )}
  </div>
);

export default function OrderSummary({
  cartItemsWithTitle,
  subtotal,
  couponDiscount,
  shippingFee,
  total,
}: {
  cartItemsWithTitle: (CartItemType & { title: string })[];
  subtotal: number;
  couponDiscount: number;
  shippingFee: number;
  total: number;
}) {
  const t = useTranslations("Checkout");

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      {/* Header */}
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">
          {t("orderSummary.title")}
        </h3>
      </div>

      {/* Body */}
      <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
        {/* Cart Items */}
        {cartItemsWithTitle.length > 0 ? (
          cartItemsWithTitle.map((item) => (
            <OrderRow
              key={item.id}
              label={`${item.quantity} x ${item.title}`}
              value={`${(
                (item.discountedPrice || item.price) * item.quantity
              ).toFixed(2)} TMT`}
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-5 border-b border-gray-3">
            <p className="text-dark">{t("orderSummary.cartEmpty")}</p>
          </div>
        )}

        {/* Subtotal */}
        <OrderRow
          label={t("orderSummary.subtotal")}
          value={`${subtotal.toFixed(2)} TMT`}
        />

        {/* Discount */}
        {couponDiscount > 0 && (
          <OrderRow
            label={t("orderSummary.discount")}
            value={`-${couponDiscount.toFixed(2)} TMT`}
            valueClass="text-green-600"
          />
        )}

        {/* Shipping */}
        {shippingFee > 0 && (
          <OrderRow
            label={t("orderSummary.shippingFee")}
            value={`${shippingFee.toFixed(2)} TMT`}
          />
        )}

        {/* Total */}
        <div className="flex items-center justify-between pt-5">
          <p className="font-medium text-lg text-dark">
            {t("orderSummary.total")}
          </p>
          <p className="font-medium text-lg text-green text-right">
            {total.toFixed(2)} TMT
          </p>
        </div>
      </div>
    </div>
  );
}
