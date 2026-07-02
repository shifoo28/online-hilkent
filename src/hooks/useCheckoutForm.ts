import { PaymentMethod } from "@prisma/client";
import { useState, useCallback } from "react";

export interface CheckoutFormData {
  // Billing details
  firstName: string;
  lastName: string;
  companyName: string;
  billingAddress: string;
  billingPhone: string;
  email: string;
  selectedBillingAddressId: string;

  // Shipping details
  shippingAddressSame: boolean;
  selectedShippingAddressId: string;
  shippingAddress: string;
  shippingAddressTwo: string;

  // Shipping method
  shippingMethodId: number | null;

  // Payment method
  paymentMethod: PaymentMethod;

  // Coupon
  couponCode: string;

  // Notes
  note: string;

  // Is logged in
  // isLoggedIn: boolean;
  // loginEmail?: string;
  // loginPassword?: string;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_STATE: CheckoutFormData = {
  firstName: "",
  lastName: "",
  companyName: "",
  billingAddress: "",
  billingPhone: "",
  email: "",
  selectedBillingAddressId: "",
  shippingAddressSame: true,
  selectedShippingAddressId: "",
  shippingAddress: "",
  shippingAddressTwo: "",
  shippingMethodId: null,
  paymentMethod: PaymentMethod.CASH,
  couponCode: "",
  note: "",
};

export const useCheckoutForm = () => {
  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(
    (field: keyof CheckoutFormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    },
    [errors],
  );

  const updateMultipleFields = useCallback(
    (updates: Partial<CheckoutFormData>) => {
      setFormData((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    [],
  );

  const normalizeStringValue = (value: unknown) => {
    if (typeof value === "string") return value;
    if (value === undefined || value === null) return "";
    return String(value);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required billing fields
    if (!normalizeStringValue(formData.firstName).trim())
      newErrors.firstName = "First name is required";
    if (!normalizeStringValue(formData.billingAddress).trim())
      newErrors.billingAddress = "Street address is required";
    if (!normalizeStringValue(formData.billingPhone).trim())
      newErrors.billingPhone = "Phone is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValue = normalizeStringValue(formData.email);
    if (emailValue && !emailRegex.test(emailValue)) {
      newErrors.email = "Invalid email format";
    }

    // Shipping fields if different address
    if (!formData.shippingAddressSame) {
      if (!normalizeStringValue(formData.shippingAddress).trim())
        newErrors.shippingAddress = "Shipping address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = useCallback(() => {
    setFormData(INITIAL_STATE);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    updateMultipleFields,
    validateForm,
    resetForm,
  };
};
