"use client";
import React, { useEffect, useState } from "react";
import { Address, useAddresses } from "@/hooks/useAddresses";
import { useTranslations } from "next-intl";

interface AddressModalProps {
  isOpen: boolean;
  closeModal: () => void;
  addressType: "shipping" | "billing";
  onSave: (address: Omit<Address, "id" | "type">) => void;
  initialAddress?: Address | null;
}

const AddressModal = ({
  isOpen,
  closeModal,
  addressType,
  onSave,
  initialAddress,
}: AddressModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const translate = useTranslations("Account.details.address");

  // Initialize form with existing address data or reset
  useEffect(() => {
    if (initialAddress) {
      setFormData({
        name: initialAddress.name,
        email: initialAddress.email,
        phone: initialAddress.phone,
        address: initialAddress.address,
        isDefault: initialAddress.isDefault,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        isDefault: false,
      });
    }
    setError(null);
  }, [isOpen, initialAddress]);

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as Element)?.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.phone || !formData.address) {
      setError(translate("modal.message.required"));
      return;
    }

    try {
      setLoading(true);
      onSave(formData);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        isDefault: false,
      });
      closeModal();
    } catch (err) {
      setError(translate("modal.message.error"));
      console.error("Error saving address:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5 ${
        isOpen ? "block z-99999" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={closeModal}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-3 sm:right-3 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <div>
            <h3 className="text-xl font-semibold text-dark mb-6">
              {initialAddress
                ? translate("modal.titleEdit", {
                    type: translate(`terms.${addressType}`),
                  })
                : translate("modal.titleNew", {
                    type: translate(`terms.${addressType}`),
                  })}
            </h3>

            <div onSubmit={handleSubmit}>
              {error && (
                <div className="mb-5 p-4 bg-red-50 border border-red rounded-lg">
                  <p className="text-red text-custom-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                <div className="w-full">
                  <label htmlFor="name" className="block mb-2.5">
                    {translate("modal.name.label")}{" "}
                    <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder={translate("modal.name.placeholder")}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="rounded-md border text-dark border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="email" className="block mb-2.5">
                    {translate("modal.email.label")}
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={translate("modal.email.placeholder")}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-md border text-dark border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                <div className="w-full">
                  <label htmlFor="phone" className="block mb-2.5">
                    {translate("modal.phone.label")}
                    <span className="text-dark-5 text-sm">(6/7)x xxxxxx</span>
                    <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    // 6x xxxxxx or 7x xxxxxx
                    pattern="^(6|7)\d{7}$"
                    placeholder={translate("modal.phone.placeholder")}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="rounded-md border text-dark border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="address" className="block mb-2.5">
                    {translate("modal.address.label")}{" "}
                    <span className="text-red">*</span>
                  </label>

                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder={translate("modal.address.placeholder")}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="rounded-md border text-dark border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="rounded border-gray-3 text-blue focus:ring-blue"
                />
                <label htmlFor="isDefault" className="text-dark-2 text-sm">
                  {translate("modal.message.default", {
                    type: translate(`terms.${addressType}`),
                  })}
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-dark"
                  }`}
                >
                  {loading ? "Saving..." : translate("modal.buttonSave")}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex font-medium text-dark-2 bg-gray-1 py-3 px-7 rounded-md ease-out duration-200 hover:bg-gray-2"
                >
                  {translate("modal.buttonCancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
