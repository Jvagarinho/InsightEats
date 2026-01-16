"use client";

import { WeightChart } from "./WeightChart";
import { WeightInput } from "./WeightInput";
import { FoodSearch } from "../diary/FoodSearch";
import { DailyProgressHeader } from "./DailyProgressHeader";
import { useLanguage } from "@/components/LanguageProvider";

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t("Dashboard.title")}</h2>
        <p className="text-gray-600">{t("Dashboard.subtitle")}</p>
      </div>

      <DailyProgressHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">{t("Dashboard.weightEvolution")}</h3>
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                {t("Dashboard.last30Days")}
              </span>
            </div>
            
            <WeightChart />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("Dashboard.logWeight")}</h3>
            <WeightInput />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t("Dashboard.smartFoodSearch")}
            </h3>
            <FoodSearch />
          </div>

          <div className="bg-soft-green/5 rounded-2xl border border-soft-green/10 p-6">
            <h3 className="text-lg font-semibold text-soft-green mb-2">{t("Dashboard.quickTip")}</h3>
            <p className="text-gray-600 text-sm">
              {t("Dashboard.tipContent")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
