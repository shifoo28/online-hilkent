"use client";

import type { Address } from "@/hooks/useAddresses";

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
  return (
    <div
      className={`p-3 rounded border ${
        address.isDefault ? "border-blue bg-blue/5" : "border-gray-3"
      }`}
    >
      {address.isDefault && (
        <div className="mb-2 inline-block bg-blue px-2 py-1 rounded text-white text-xs font-medium">
          Default
        </div>
      )}

      <p className="font-medium text-dark text-sm mb-1">Name: {address.name}</p>
      <p className="text-custom-xs text-dark-2 mb-1">Email: {address.email}</p>
      <p className="text-custom-xs text-dark-2 mb-1">Phone: {address.phone}</p>
      <p className="text-custom-xs text-dark-2 mb-3">
        Address: {address.address}
      </p>

      <div className="flex text-xs gap-2">
        <p>Actions: </p>
        <button
          type="button"
          onClick={() => onEdit(address)}
          className="text-blue hover:underline"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(address.id)}
          className="text-red hover:underline"
        >
          Delete
        </button>
        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="text-green hover:underline"
          >
            Set Default
          </button>
        )}
      </div>
    </div>
  );
}
