"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Utensils, User, LogOut, Info } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import clsx from "clsx";
import { useLanguage } from "./LanguageProvider";

const navItems = [
  { href: "/dashboard", labelKey: "Sidebar.dashboard", icon: LayoutDashboard },
  { href: "/diary", labelKey: "Sidebar.diary", icon: BookOpen },
  { href: "/foods", labelKey: "Sidebar.foods", icon: Utensils },
  { href: "/profile", labelKey: "Sidebar.profile", icon: User },
  { href: "/about", labelKey: "Sidebar.about", icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLanguage();

  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col sticky top-0 max-md:hidden">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-soft-green">InsightEats</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                isActive
                  ? "bg-soft-green text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-soft-green"
              )}
            >
              <Icon size={20} />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
          <span>Language</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={clsx(
                "px-2 py-1 rounded border text-xs",
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
                "px-2 py-1 rounded border text-xs",
                locale === "pt"
                  ? "bg-soft-green text-white border-soft-green"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              )}
            >
              PT
            </button>
          </div>
        </div>
        <SignOutButton>
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium">
            <LogOut size={20} />
            {t("Sidebar.signOut")}
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
