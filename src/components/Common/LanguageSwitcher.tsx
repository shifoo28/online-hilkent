"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { GlobeIcon } from "@/components/Icons";

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: t("language.english"), flag: "🇺🇸" },
    { code: "tm", name: t("language.turkmen"), flag: "🇹🇲" },
    { code: "ru", name: t("language.russian"), flag: "🇷🇺" },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    setIsOpen(false);
    setSelectedOption(languages.find((l) => l.code === newLocale));
    toggleDropdown();
  };

  const [selectedOption, setSelectedOption] = useState(
    languages.find((l) => l.code === locale)
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".dropdown-content")) {
        toggleDropdown();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="dropdown-content custom-select relative"
      style={{ width: "200px" }}
    >
      <div
        onClick={toggleDropdown}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium select-selected whitespace-nowrap ${
          isOpen ? "select-arrow-active" : ""
        }`}
      >
        <GlobeIcon width={20} height={20} fill="#9ca3af" />
        <span className="text-blue">
          {languages.find((l) => l.code === locale).name}
        </span>
      </div>

      {isOpen && (
        <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`select-item w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center gap-2
               ${selectedOption === language ? "same-as-selected" : ""}`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
