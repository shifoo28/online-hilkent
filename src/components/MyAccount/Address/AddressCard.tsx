"use client";

import type { Address } from "@/hooks/useAddresses";
import { useTranslations } from "next-intl";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const translate = useTranslations("Account.details.address");

  return (
    <div
      className={`p-3 rounded border ${
        address.isDefault ? "border-blue bg-blue/5" : "border-gray-3"
      }`}
    >
      {address.isDefault && (
        <div className="mb-2 inline-block bg-blue px-2 py-1 rounded text-white text-xs font-medium">
          {translate("actions.setDefault")}
        </div>
      )}

      <p className="font-medium text-dark text-sm mb-1">
        {translate("label.name")}: {address.name}
      </p>
      <p className="text-custom-xs text-dark-2 mb-1">
        {translate("label.email")}: {address.email}
      </p>
      <p className="text-custom-xs text-dark-2 mb-1">
        {translate("label.phone")}: {address.phone}
      </p>
      <p className="text-custom-xs text-dark-2 mb-3">
        {translate("label.address")}: {address.address}
      </p>

      <div className="flex text-xs gap-2">
        <p>{translate("label.actions")}: </p>
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="text-green hover:underline"
        >
          {translate("actions.edit")}
        </button>
        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onDelete(address.id)}
            className="text-red hover:underline"
          >
            {translate("actions.delete")}
          </button>
        )}
        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="text-blue hover:underline"
          >
            {translate("actions.setDefault")}
          </button>
        )}
      </div>
    </div>
  );
}
