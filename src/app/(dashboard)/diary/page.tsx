"use client";

import { FoodSearch } from "./FoodSearch";
import { DiaryDashboard } from "./DiaryDashboard";
import { DiaryList } from "./DiaryList";
import { useLanguage } from "@/components/LanguageProvider";

export default function DiaryPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t("Diary.title")}</h2>
        <p className="text-gray-600">
          {t("Diary.subtitle")}
        </p>
      </div>

      <DiaryDashboard />

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("Diary.addToDiary")}</h3>
        <FoodSearch />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("Diary.todayLog")}</h3>
        <DiaryList />
      </div>
    </div>
  );
}
