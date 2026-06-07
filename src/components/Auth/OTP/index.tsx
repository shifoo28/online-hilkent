"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export const STORAGE_KEY = "verifiedPhoneNumber";

export default function OTP() {
  const t = useTranslations("Auth.otp");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const phone = localStorage.getItem("phoneNumber");
    if (!phone) {
      alert(t("noPhoneError"));
      window.location.href = "/signup";
    }
    setPhoneNumber(phone);
  }, [t]);

  async function handleVerify() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      const data = await res.json();

      res.status === 400
        ? setError(data.error)
        : !res.ok
          ? setError(data.error || t("verificationFailed"))
          : (alert(t("successMessage")),
            localStorage.removeItem("phoneNumber"), // Clear the phone number after successful verification
            localStorage.setItem(STORAGE_KEY, phoneNumber), // Store verified phone number for later use (e.g., auto-fill on homepage)
            (window.location.href = "/"));
    } catch (err) {
      console.error(err);
      alert(t("errorMessage"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-80">
        <h1 className="text-xl font-semibold mb-4 text-center">{t("title")}</h1>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder={t("placeholder")}
          className="border rounded-md w-full p-2 mb-4 text-center outline-blue focus:ring-2 focus:ring-blue-light-2"
        />

        {error && <p className="text-red text-sm">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 text-blue py-2 rounded-md hover:bg-blue hover:text-white disabled:opacity-50"
        >
          {loading ? t("buttonLoading") : t("button")}
        </button>
      </div>
    </div>
  );
}
