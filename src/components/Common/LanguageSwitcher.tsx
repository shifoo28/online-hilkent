"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";
import { GlobeIcon } from "@/components/Icons";

const LanguageSwitcher = ({
  wrapperRef,
}: {
  wrapperRef?: RefObject<HTMLDivElement>;
}) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);
  const switcherRef = wrapperRef ?? internalRef;

  const languages = [
    { code: "us", name: t("language.english"), flag: "🇺🇸" },
    { code: "tm", name: t("language.turkmen"), flag: "🇹🇲" },
    { code: "ru", name: t("language.russian"), flag: "🇷🇺" },
  ];

  const [selectedOption, setSelectedOption] = useState(
    languages.find((l) => l.code === locale)
  );

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    setIsOpen(false);
    setSelectedOption(languages.find((l) => l.code === newLocale));
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && switcherRef.current && !switcherRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, switcherRef]);

  return (
    <div
      ref={switcherRef}
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
        <span className="text-gray-6">
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
