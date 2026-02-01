"use client";

import { useLanguage } from "./LanguageProvider";
import clsx from "clsx";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={clsx(
          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
          locale === "en"
            ? "bg-soft-green text-white"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("pt")}
        className={clsx(
          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
          locale === "pt"
            ? "bg-soft-green text-white"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        PT
      </button>
    </div>
  );
}
