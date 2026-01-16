"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLanguage } from "@/components/LanguageProvider";

export function DiaryDashboard() {
  const summary = useQuery(api.logs.summaryToday);
  const { t } = useLanguage();

  // Default values while loading
  const { calories, protein, carbs, fat } = summary || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MacroCard label={t("DailyProgress.macros.calories")} value={calories} unit="kcal" />
      <MacroCard label={t("DailyProgress.macros.protein")} value={protein} unit="g" />
      <MacroCard label={t("DailyProgress.macros.carbs")} value={carbs} unit="g" />
      <MacroCard label={t("DailyProgress.macros.fats")} value={fat} unit="g" />
    </div>
  );
}

function MacroCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-soft-green">
          {unit === "kcal" ? Math.round(value) : value.toFixed(1)}
        </span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
    </div>
  );
}
