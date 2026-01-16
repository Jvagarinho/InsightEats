"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Utensils, User } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "./LanguageProvider";

const navItems = [
  { href: "/dashboard", labelKey: "Sidebar.dashboard", icon: LayoutDashboard },
  { href: "/diary", labelKey: "Sidebar.diary", icon: BookOpen },
  { href: "/foods", labelKey: "Sidebar.foods", icon: Utensils },
  { href: "/profile", labelKey: "Sidebar.profile", icon: User },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-50">
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
    </nav>
  );
}
