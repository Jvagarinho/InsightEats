"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-soft-green tracking-tight">
            {t("About.title")}
          </h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-soft-green text-soft-green text-sm font-semibold hover:bg-soft-green hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              {t("About.backToApp")}
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            {t("About.presentation.title")}
          </h2>
          <p className="text-gray-600 mb-3">
            {t("About.presentation.paragraph1")}
          </p>
          <p className="text-gray-600 mb-3">
            {t("About.presentation.paragraph2")}
          </p>
          <p className="text-gray-600">
            {t("About.presentation.paragraph3")}
          </p>
          <div className="mt-4 rounded-xl bg-white border border-soft-green/10 px-4 py-3">
            <p className="text-sm text-gray-700 font-medium">
              {t("About.mission")}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            {t("About.contact.title")}
          </h2>
          <p className="text-gray-600 mb-3">
            {t("About.contact.intro")}
          </p>
          <p className="text-gray-800 font-semibold">
            {t("About.contact.emailLabel")}
            <a
              href="mailto:iteriotech@gmail.com"
              className="text-soft-green hover:text-soft-green-hover underline underline-offset-2"
            >
              iteriotech@gmail.com
            </a>
          </p>
          <p className="mt-3 text-gray-600 text-sm">
            {t("About.contact.tagline")}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            {t("About.footer.copyright").replace("{year}", new Date().getFullYear().toString())}
          </p>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-soft-green text-white text-sm font-semibold hover:bg-soft-green-hover transition-colors shadow-md"
          >
            {t("About.backToApp")}
            <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
