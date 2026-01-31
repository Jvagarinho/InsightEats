"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageProvider";
import clsx from "clsx";

export function DiaryList() {
  const { t } = useLanguage();
  const logs = useQuery(api.logs.getTodayLogs) ?? [];
  const deleteLog = useMutation(api.logs.deleteLog);

  async function handleDelete(logId: string) {
    try {
      await deleteLog({ logId: logId as unknown as import("@/convex/_generated/dataModel").Id<"logs"> });
      toast.success(t("Diary.logDeleted"));
    } catch {
      toast.error(t("Diary.deleteError"));
    }
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t("Diary.noLogsToday")}
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {logs.map((log) => {
        if (!log.food) return null;

        const calories = (log.food.caloriesPer100g * log.quantityGrams) / 100;
        const protein = (log.food.proteinPer100g * log.quantityGrams) / 100;
        const carbs = (log.food.carbsPer100g * log.quantityGrams) / 100;
        const fat = (log.food.fatPer100g * log.quantityGrams) / 100;

        return (
          <div
            key={log._id}
            className={clsx(
              "flex items-center justify-between p-4 rounded-xl border transition-colors",
              "hover:bg-gray-50 hover:border-gray-200",
              "border-gray-100"
            )}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium text-gray-800">
                  {log.food.name}
                </span>
                <span className="text-sm text-gray-500">
                  {log.quantityGrams}g
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                <span>{Math.round(calories)} kcal</span>
                <span>{protein.toFixed(1)}g P</span>
                <span>{carbs.toFixed(1)}g C</span>
                <span>{fat.toFixed(1)}g F</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(log._id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label={t("Diary.deleteLog")}
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}