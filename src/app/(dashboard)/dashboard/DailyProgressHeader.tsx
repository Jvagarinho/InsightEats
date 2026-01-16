"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Flame } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

function todayIsoDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function addDaysToIsoDate(baseIso: string, days: number) {
  const base = new Date(baseIso + "T00:00:00.000Z");
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

function formatDisplayDate(targetIso: string, locale: string, t: (key: string) => string) {
  const today = todayIsoDate();
  if (targetIso === today) return t("DailyProgress.today");

  const date = new Date(targetIso + "T00:00:00.000Z");
  return date.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function DailyProgressHeader() {
  const { t, locale } = useLanguage();
  const [offset, setOffset] = useState(0);

  const baseIso = todayIsoDate();
  const selectedDate = useMemo(
    () => addDaysToIsoDate(baseIso, offset),
    [baseIso, offset]
  );

  const goals = useQuery(api.goals.getGoals);
  const summary =
    useQuery(api.logs.summaryForDate, { date: selectedDate }) ?? {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

  const caloriesGoal = goals?.caloriesTarget ?? 0;
  const caloriesConsumed = summary.calories ?? 0;

  const caloriesPercent =
    caloriesGoal > 0 ? Math.min(100, (caloriesConsumed / caloriesGoal) * 100) : 0;

  const macroCards = [
    {
      label: t("DailyProgress.macros.protein"),
      value: summary.protein ?? 0,
      unit: "g",
      target: goals?.proteinTargetGrams ?? 0,
    },
    {
      label: t("DailyProgress.macros.carbs"),
      value: summary.carbs ?? 0,
      unit: "g",
      target: goals?.carbsTargetGrams ?? 0,
    },
    {
      label: t("DailyProgress.macros.fats"),
      value: summary.fat ?? 0,
      unit: "g",
      target: goals?.fatTargetGrams ?? 0,
    },
    {
      label: t("DailyProgress.macros.fiber"),
      value: summary.fiber ?? 0,
      unit: "g",
      target: 25,
    },
  ];

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offsetStroke = circumference - (caloriesPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#2D5A27"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offsetStroke}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Flame className="text-soft-green mb-1" />
              <div className="text-xs text-gray-500">{t("DailyProgress.macros.calories")}</div>
              <div className="text-lg font-bold text-gray-800">
                {Math.round(caloriesConsumed)}
              </div>
              <div className="text-xs text-gray-400">
                {t("DailyProgress.of")} {caloriesGoal > 0 ? Math.round(caloriesGoal) : "--"} kcal
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500">{t("DailyProgress.dailyProgress")}</div>
            <div className="mt-1 text-2xl font-bold text-gray-800">
              {Math.round(caloriesPercent)}%
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {goals
                ? t("DailyProgress.basedOnTargets")
                : t("DailyProgress.setGoals")}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {t("DailyProgress.date")}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOffset((value) => value - 1)}
              className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              {t("DailyProgress.previous")}
            </button>
            <div className="px-4 py-1.5 rounded-full bg-soft-green/5 border border-soft-green/20 text-sm font-medium text-soft-green">
              {formatDisplayDate(selectedDate, locale, t)}
            </div>
            <button
              type="button"
              onClick={() => setOffset(0)}
              className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              {t("DailyProgress.today")}
            </button>
            <button
              type="button"
              onClick={() => setOffset((value) => value + 1)}
              className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              {t("DailyProgress.next")}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {macroCards.map((card) => (
          <div
            key={card.label}
            className="bg-gray-50 rounded-xl border border-gray-100 p-4"
          >
            <div className="text-xs font-medium text-gray-500 uppercase">
              {card.label}
            </div>
            <div className="mt-2 text-xl font-bold text-gray-800">
              {card.label === t("DailyProgress.macros.calories")
                ? Math.round(card.value)
                : card.value.toFixed(1)}{" "}
              <span className="text-sm font-normal text-gray-500">{card.unit}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {t("DailyProgress.target")}:{" "}
              {card.target > 0 ? `${Math.round(card.target)} ${card.unit}` : "--"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

