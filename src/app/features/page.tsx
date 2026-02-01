"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Heart, BarChart3, Globe, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Heart,
    titleKey: "Features.smartTracking.title",
    descriptionKey: "Features.smartTracking.description"
  },
  {
    icon: BarChart3,
    titleKey: "Features.detailedInsights.title",
    descriptionKey: "Features.detailedInsights.description"
  },
  {
    icon: Globe,
    titleKey: "Features.globalDatabase.title",
    descriptionKey: "Features.globalDatabase.description"
  },
  {
    icon: Zap,
    titleKey: "Features.quickEasy.title",
    descriptionKey: "Features.quickEasy.description"
  }
];

export default function FeaturesPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-10 pt-10">
      <div className="flex justify-between items-center">
        <div className="text-center space-y-4 flex-1">
          <h1 className="text-4xl font-bold text-gray-800">
            {t("Features.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("Features.description")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-soft-green text-soft-green text-sm font-semibold hover:bg-soft-green hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            {t("Features.backToApp")}
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-br from-soft-green/5 to-soft-green/10 rounded-3xl p-8 border border-soft-green/20">
        <h2 className="text-2xl font-bold text-soft-green mb-4">
          {t("Features.mission.title")}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {t("Features.mission.content")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-soft-green/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="text-soft-green" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t(feature.descriptionKey)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t("Features.technologies.title")}
        </h2>
        <p className="text-gray-600 mb-4">
          {t("Features.technologies.description")}
        </p>
        <div className="flex flex-wrap gap-2">
          {["Next.js", "Convex", "Clerk", "Tailwind CSS", "Recharts", "Lucide"].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-soft-green/10 text-soft-green rounded-full text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 items-center">
        <p className="text-gray-500 text-sm">
          {t("Features.version").replace("{version}", "1.0.0")}
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-soft-green text-soft-green text-sm font-semibold hover:bg-soft-green hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          {t("Features.backToApp")}
        </Link>
      </div>
    </div>
  );
}