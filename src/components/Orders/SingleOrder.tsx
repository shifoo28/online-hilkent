import React, { useState } from "react";
import { useTranslations } from "next-intl";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import type { OrderResponse } from "@/types/api/responses";

const SingleOrder = ({
  orderItem,
  smallView,
}: {
  orderItem: OrderResponse;
  smallView: boolean;
}) => {
  const translate = useTranslations("Account.details.orders");
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  return (
    <>
      {!smallView && (
        <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
          <div className="min-w-[111px]">
            <p className="text-custom-sm text-red">
              #{orderItem.orderId}
            </p>
          </div>
          <div className="min-w-[175px]">
            <p className="text-custom-sm text-dark">
              {new Date(orderItem.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="min-w-[128px]">
            <p
              className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${
                orderItem.status === "DELIVERED"
                  ? "text-green bg-green-light-6"
                  : orderItem.status === "CANCELLED"
                    ? "text-red bg-red-light-6"
                    : orderItem.status === "PROCESSING"
                      ? "text-yellow bg-yellow-light-2"
                      : orderItem.status === "SHIPPED"
                        ? "text-blue bg-blue-light-6"
                        : "text-gray-7 bg-gray-3"
              }`}
            >
              {translate(`tablebody.${orderItem.status.toLowerCase()}`)}
            </p>
          </div>

          <div className="min-w-[113px]">
            <p className="text-custom-sm text-dark">{orderItem.total}</p>
          </div>

          <div className="flex gap-5 items-center">
            <OrderActions
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
            />
          </div>
        </div>
      )}

      {smallView && (
        <div className="block md:hidden">
          <div className="py-4.5 px-7.5">
            <div>
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">
                  {translate("tableheader.order")}:
                </span>{" "}
                #{orderItem.orderId.slice(-8)}
              </p>
            </div>
            <div>
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">
                  {translate("tableheader.date")}:
                </span>{" "}
                {new Date(orderItem.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">
                  {translate("tableheader.status")}:
                </span>{" "}
                <span
                  className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${
                    orderItem.status === "DELIVERED"
                      ? "text-green bg-green-light-6"
                      : orderItem.status === "CANCELLED"
                        ? "text-red bg-red-light-6"
                        : orderItem.status === "PROCESSING"
                          ? "text-yellow bg-yellow-light-2"
                          : orderItem.status === "SHIPPED"
                            ? "text-blue bg-blue-light-6"
                            : "text-gray bg-gray-light-6"
                  }`}
                >
                  {translate(`tablebody.${orderItem.status.toLowerCase()}`)}
                </span>
              </p>
            </div>

            <div>
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">
                  {translate("tableheader.total")}:
                </span>
                {orderItem.total} TMT
              </p>
            </div>

            <div>
              <p className="text-custom-sm text-dark flex items-center">
                <span className="font-bold pr-2">
                  {translate("tableheader.actions")}:
                </span>{" "}
                <OrderActions
                  toggleDetails={toggleDetails}
                  toggleEdit={toggleEdit}
                />
              </p>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  );
};

export default SingleOrder;
