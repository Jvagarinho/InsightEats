"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Utensils, User, Info } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "./LanguageProvider";

const navItems = [
  { href: "/dashboard", labelKey: "Sidebar.dashboard", icon: LayoutDashboard },
  { href: "/diary", labelKey: "Sidebar.diary", icon: BookOpen },
  { href: "/foods", labelKey: "Sidebar.foods", icon: Utensils },
  { href: "/profile", labelKey: "Sidebar.profile", icon: User },
  { href: "/about", labelKey: "Sidebar.about", icon: Info },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLanguage();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 px-3 py-2 z-50 space-y-1">
      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span>Language</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={clsx(
              "px-2 py-1 rounded border text-[10px]",
              locale === "en"
                ? "bg-soft-green text-white border-soft-green"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            )}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLocale("pt")}
            className={clsx(
              "px-2 py-1 rounded border text-[10px]",
              locale === "pt"
                ? "bg-soft-green text-white border-soft-green"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            )}
          >
            PT
          </button>
        </div>
      </div>
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-1 text-xs transition-colors",
                isActive ? "text-soft-green" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div
                className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  isActive
                    ? "bg-soft-green text-white shadow-sm"
                    : "bg-transparent"
                )}
              >
                <Icon size={20} className={isActive ? "text-white" : "currentColor"} />
              </div>
              <span className="font-medium">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
