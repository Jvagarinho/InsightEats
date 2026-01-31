"use client";

import { useState } from "react";
import { Utensils, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import clsx from "clsx";
import { FoodSearch } from "../app/(dashboard)/diary/FoodSearch";

export interface AnalyzedFood {
  name: string;
  description?: string;
  estimatedCaloriesPer100g: number;
  estimatedProteinPer100g: number;
  estimatedCarbsPer100g: number;
  estimatedFatPer100g: number;
  confidence: "high" | "medium" | "low";
}

type FoodVisionResultsProps = {
  foods: AnalyzedFood[];
  summary?: string;
  onClose: () => void;
};

export function FoodVisionResults({ foods, summary, onClose }: FoodVisionResultsProps) {
  const { t } = useLanguage();
  const [selectedFood, setSelectedFood] = useState<AnalyzedFood | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const confidenceColors = {
    high: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-red-100 text-red-800",
  };

  const confidenceLabels = {
    high: t("FoodVision.confidence.high"),
    medium: t("FoodVision.confidence.medium"),
    low: t("FoodVision.confidence.low"),
  };

  function handleSearchFood(food: AnalyzedFood) {
    setSelectedFood(food);
    setShowSearch(true);
  }

  function handleFoodAdded() {
    toast.success(t("FoodVision.foodAdded"));
    setShowSearch(false);
    setSelectedFood(null);
  }

  if (showSearch && selectedFood) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {t("FoodVision.searchingFor")}
            </h3>
            <p className="text-sm text-gray-500">
              &quot;{selectedFood.name}&quot;
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSearch(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        <FoodSearch mode="log" onFoodAdded={handleFoodAdded} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {summary && (
        <div className="bg-soft-green/10 rounded-xl border border-soft-green/20 p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-soft-green">
              {t("FoodVision.aiSummary")}:
            </span>
            {summary}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {foods.map((food, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils size={18} className="text-soft-green" />
                  <h4 className="font-semibold text-gray-800">
                    {food.name}
                  </h4>
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      confidenceColors[food.confidence]
                    )}
                  >
                    {confidenceLabels[food.confidence]}
                  </span>
                </div>

                {food.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {food.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="bg-gray-50 px-2 py-1 rounded">
                    {Math.round(food.estimatedCaloriesPer100g)} kcal / 100g
                  </span>
                  <span className="bg-gray-50 px-2 py-1 rounded">
                    {food.estimatedProteinPer100g.toFixed(1)}g P
                  </span>
                  <span className="bg-gray-50 px-2 py-1 rounded">
                    {food.estimatedCarbsPer100g.toFixed(1)}g C
                  </span>
                  <span className="bg-gray-50 px-2 py-1 rounded">
                    {food.estimatedFatPer100g.toFixed(1)}g F
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSearchFood(food)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-soft-green text-white text-sm font-semibold hover:bg-soft-green-hover transition-colors"
              >
                {t("FoodVision.search")}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {t("FoodVision.close")}
        </button>
      </div>
    </div>
  );
}
