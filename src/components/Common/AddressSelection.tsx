import React, { useEffect, useRef, useState } from "react";
import AddressModal from "../MyAccount/Address/AddressModal";
import { Address, useAddresses } from "@/hooks/useAddresses";
import { useTranslations } from "next-intl";
import { CheckoutFormData } from "@/hooks/useCheckoutForm";

type AddressType = "billing" | "shipping";
type AddressKey = `selected${Capitalize<AddressType>}AddressId`;

interface AddressSelectionProps {
  formData: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: any) => void;
  addressType: AddressType;
}

function getAddressKey(addressType: AddressType): AddressKey {
  return `selected${addressType.charAt(0).toUpperCase() + addressType.slice(1)}AddressId` as AddressKey;
}

const AddressSelection = ({
  formData,
  onChange,
  addressType,
}: AddressSelectionProps) => {
  const t = useTranslations("Checkout");
  const { getAddressesByType, addAddress, updateAddress } = useAddresses();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressId, setAddressId] = useState("");
  const previousAddressIdRef = useRef<string>("");

  const addresses = getAddressesByType(addressType);

  // Populate form when address is selected
  useEffect(() => {
    const selectedId =
      addressType === "billing"
        ? formData.selectedBillingAddressId
        : formData.selectedShippingAddressId;

    setAddressId(selectedId || "");

    // Only populate form fields if the selected address ID has changed
    if (selectedId && selectedId !== previousAddressIdRef.current) {
      previousAddressIdRef.current = selectedId;

      const selectedAddress = addresses.find((addr) => addr.id === selectedId);
      if (selectedAddress) {
        onChange("email", selectedAddress.email);
        if (addressType === "billing") {
          onChange("billingPhone", String(selectedAddress.phone));
        } else {
          if (!formData.billingPhone || formData.billingPhone === "")
            onChange("billingPhone", String(selectedAddress.phone));
        }

        onChange(`${addressType}Address`, selectedAddress.address);
      }
    }
  }, [
    addressType,
    addresses,
    formData.selectedBillingAddressId,
    formData.selectedShippingAddressId,
  ]);

  const handleAddressSelect = (addressId: string) => {
    onChange(getAddressKey(addressType), addressId);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleSaveAddress = (addressData: Omit<Address, "id" | "type">) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, {
        ...addressData,
        type: "billing",
      });
    } else {
      const newAddr = addAddress({
        ...addressData,
        type: addressType,
      });
      onChange(getAddressKey(addressType), newAddr.id);
    }
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const selectionTitle =
    addressType === "billing"
      ? t("billing.selectSavedAddress")
      : t("shipping.selectSavedAddress");
  const addNewAddressLabel =
    addressType === "billing"
      ? t("billing.addNewAddress")
      : t("shipping.addNewAddress");
  const noAddressesText =
    addressType === "billing"
      ? t("billing.noSavedAddresses")
      : t("shipping.noSavedAddresses");
  const noAddressesHint =
    addressType === "billing"
      ? t("billing.noSavedAddressesHint")
      : t("shipping.noSavedAddressesHint");

  return (
    <>
      <div className="mb-5">
        <div className="flex justify-between items-center gap-4">
          <label className="block mb-2.5 text-sm font-medium text-dark">
            {selectionTitle}
          </label>
          <div className="flex gap-2 mb-2.5">
            <button
              type="button"
              onClick={handleAddNewAddress}
              className="text-blue text-sm hover:underline min-w-max"
            >
              {addNewAddressLabel}
            </button>
            {addressId && (
              <button
                type="button"
                onClick={() => {
                  const addr = addresses.find((a) => a.id === addressId);
                  if (addr) handleEditAddress(addr);
                }}
                className="text-green text-sm hover:underline min-w-max"
              >
                {t("billing.editAddress")}
              </button>
            )}
          </div>
        </div>

        {addresses.length > 0 ? (
          <div className="relative">
            <select
              value={addressId}
              onChange={(e) => handleAddressSelect(e.target.value)}
              className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark-4 py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            >
              <option value="">{t("billing.selectAddress")}</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.name} - {addr.address}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-4">
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.41469 5.03569L2.41467 5.03571L2.41749 5.03846L7.76749 10.2635L8.0015 10.492L8.23442 10.2623L13.5844 4.98735L13.5844 4.98735L13.5861 4.98569C13.6809 4.89086 13.8199 4.89087 13.9147 4.98569C14.0092 5.08024 14.0095 5.21864 13.9155 5.31345C13.9152 5.31373 13.915 5.31401 13.9147 5.31429L8.16676 10.9622L8.16676 10.9622L8.16469 10.9643C8.06838 11.0606 8.02352 11.0667 8.00039 11.0667C7.94147 11.0667 7.89042 11.0522 7.82064 10.9991L2.08526 5.36345C1.99127 5.26865 1.99154 5.13024 2.08609 5.03569C2.18092 4.94086 2.31986 4.94086 2.41469 5.03569Z"
                  fill=""
                  stroke=""
                  strokeWidth="0.666667"
                />
              </svg>
            </span>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-3 bg-gray-1 p-5 text-sm text-dark-4">
            <p className="font-medium text-dark mb-2">{noAddressesText}</p>
            <p>{noAddressesHint}</p>
          </div>
        )}
      </div>
      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        closeModal={() => setShowAddressModal(false)}
        addressType={addressType}
        onSave={handleSaveAddress}
        initialAddress={editingAddress}
      />
    </>
  );
};

export default AddressSelection;
