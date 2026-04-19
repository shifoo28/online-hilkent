"use client";

import type { ChangeEvent } from "react";

interface AccountDetailsTabProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
  };
  error: string | null;
  updateLoading: boolean;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSaveProfile: () => void;
}

export default function AccountDetailsTab({
  formData,
  error,
  updateLoading,
  handleInputChange,
  handleSaveProfile,
}: AccountDetailsTabProps) {
  return (
    <div className="xl:max-w-[770px] w-full">
      <form>
        <div className="bg-white shadow-1 rounded-xl p-4 sm:p-8.5">
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
            <div className="w-full">
              <label htmlFor="firstName" className="block mb-2.5">
                First Name <span className="text-red">*</span>
              </label>

              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Jhon"
                value={formData.firstName}
                onChange={handleInputChange}
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div className="w-full">
              <label htmlFor="lastName" className="block mb-2.5">
                Last Name <span className="text-red">*</span>
              </label>

              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Deo"
                value={formData.lastName}
                onChange={handleInputChange}
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
            <div className="w-full">
              <label htmlFor="email" className="block mb-2.5">
                Email <span className="text-red">*</span>
              </label>

              <input
                type="email"
                name="email"
                id="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div className="w-full">
              <label htmlFor="address" className="block mb-2.5">
                Default Address <span className="text-red">*</span>
              </label>

              <div className="relative">
                <select
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark-4 py-2.5 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                >
                  <option value="Address 1">Address 1</option>
                  <option value="Address 2">Address 2</option>
                  <option value="Address 3">Address 3</option>
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
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red rounded-lg">
              <p className="text-red text-custom-sm">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={updateLoading}
            className={`inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 ${
              updateLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-dark"
            }`}
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <p className="text-custom-sm mt-5 mb-9">
          This will be how your name will be displayed in the account section
          and in reviews
        </p>

        <p className="font-medium text-xl sm:text-2xl text-dark mb-7">
          Password Change
        </p>

        <div className="bg-white shadow-1 rounded-xl p-4 sm:p-8.5">
          <div className="mb-5">
            <label htmlFor="oldPassword" className="block mb-2.5">
              Old Password
            </label>

            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              autoComplete="on"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="newPassword" className="block mb-2.5">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              id="newPassword"
              autoComplete="on"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="confirmNewPassword" className="block mb-2.5">
              Confirm New Password
            </label>

            <input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              autoComplete="on"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <button
            type="submit"
            className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}
