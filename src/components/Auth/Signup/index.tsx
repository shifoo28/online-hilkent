"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState } from "react";
import { TEMP_PHONE_KEY } from "../Signin";

const Signup = () => {
  const nameOf = useTranslations("Auth.signUp");
  const translate = useTranslations("Auth.signUp.form");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Continue with signup request
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phoneNumber, password }),
    });

    if (!res.ok) {
      setError(res.statusText || "Sending OTP failed");
      return;
    }

    localStorage.setItem(TEMP_PHONE_KEY, phoneNumber);
    window.location.href = "/otp";
  };

  return (
    <>
      <Breadcrumb title={nameOf("page")} pages={[nameOf("page")]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                {translate("title")}
              </h2>
              <p>{translate("description")}</p>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    {translate("name.label")}{" "}
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder={translate("name.placeholder")}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="phone" className="block mb-2.5">
                    {translate("phone.label")}
                    <span className="text-gray-5"> (6/7)x xxxxxx </span>
                    <span className="text-red">*</span>
                  </label>

                  <input
                    type="tel"
                    pattern="^[67][0-9]{7}$"
                    name="phone"
                    id="phone"
                    placeholder={
                      translate("phone.placeholder") + " (e.g. 6x xxxxxx)"
                    }
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block mb-2.5">
                    {translate("password.label")}{" "}
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder={translate("password.placeholder")}
                    autoComplete="on"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                <div className="mb-5.5">
                  <label htmlFor="re-type-password" className="block mb-2.5">
                    {translate("confirmPassword.label")}{" "}
                  </label>

                  <input
                    type="password"
                    name="re-type-password"
                    id="re-type-password"
                    placeholder={translate("confirmPassword.placeholder")}
                    autoComplete="on"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </div>

                {error && <p className="text-red-dark text-sm">{error}</p>}

                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5"
                >
                  {translate("button")}
                </button>

                <span className="relative z-1 block font-medium text-center mt-4.5">
                  <span className="block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3"></span>
                  <span className="inline-block px-3 bg-white">|||||</span>
                </span>

                <p className="text-center mt-6">
                  {translate("footer.text")}
                  <Link
                    href="/signin"
                    className="text-dark ease-out duration-200 hover:text-blue pl-2"
                  >
                    {translate("footer.link")}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
