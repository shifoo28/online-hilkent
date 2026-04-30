"use client";

import { useTranslations } from "next-intl";

export default function DownloadsTab() {
  const translate = useTranslations("Account.details.downloads");

  return (
    <div className="xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 py-9.5 px-4 sm:px-7.5 xl:px-10">
      <p>{translate("info")}</p>
    </div>
  );
}
