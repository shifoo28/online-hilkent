import { useState, useCallback } from "react";

export interface CheckoutFormData {
  // Billing details
  firstName: string;
  lastName: string;
  companyName: string;
  billingCountry: string;
  billingAddress: string;
  billingAddressTwo: string;
  billingTown: string;
  billingPostCode: string;
  billingPhone: string;
  email: string;

  // Shipping details
  shippingAddressSame: boolean;
  shippingCountry: string;
  shippingAddress: string;
  shippingAddressTwo: string;
  shippingTown: string;
  shippingPostCode: string;

  // Shipping method
  shippingMethod: "free" | "fedex" | "dhl";

  // Payment method
  paymentMethod: "bank" | "cash" | "paypal";

  // Coupon
  couponCode: string;

  // Notes
  notes: string;

  // Is logged in
  isLoggedIn: boolean;
  loginEmail?: string;
  loginPassword?: string;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_STATE: CheckoutFormData = {
  firstName: "",
  lastName: "",
  companyName: "",
  billingCountry: "",
  billingAddress: "",
  billingAddressTwo: "",
  billingTown: "",
  billingPostCode: "",
  billingPhone: "",
  email: "",
  shippingAddressSame: true,
  shippingCountry: "",
  shippingAddress: "",
  shippingAddressTwo: "",
  shippingTown: "",
  shippingPostCode: "",
  shippingMethod: "free",
  paymentMethod: "bank",
  couponCode: "",
  notes: "",
  isLoggedIn: false,
  loginEmail: "",
  loginPassword: "",
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required billing fields
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.billingCountry)
      newErrors.billingCountry = "Country is required";
    if (!formData.billingAddress.trim())
      newErrors.billingAddress = "Street address is required";
    if (!formData.billingTown.trim())
      newErrors.billingTown = "Town/City is required";
    if (!formData.billingPhone.trim())
      newErrors.billingPhone = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Shipping fields if different address
    if (!formData.shippingAddressSame) {
      if (!formData.shippingCountry)
        newErrors.shippingCountry = "Shipping country is required";
      if (!formData.shippingAddress.trim())
        newErrors.shippingAddress = "Shipping address is required";
      if (!formData.shippingTown.trim())
        newErrors.shippingTown = "Shipping town/city is required";
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
