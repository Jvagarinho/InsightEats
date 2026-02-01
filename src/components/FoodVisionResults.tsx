"use client";

import { useState, useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Utensils, Plus, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "./LanguageProvider";
import clsx from "clsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog";

export interface AnalyzedFood {
  name: string;
  description?: string;
  estimatedCaloriesPer100g: number;
  estimatedProteinPer100g: number;
  estimatedCarbsPer100g: number;
  estimatedFatPer100g: number;
  confidence: "high" | "medium" | "low";
  imageUrl?: string;
}

type FoodVisionResultsProps = {
  foods: AnalyzedFood[];
  summary?: string;
  onClose: () => void;
};

export function FoodVisionResults({ foods, summary, onClose }: FoodVisionResultsProps) {
  const { t } = useLanguage();
  const [selectedFood, setSelectedFood] = useState<AnalyzedFood | null>(null);
  const [open, setOpen] = useState(false);
  const [grams, setGrams] = useState<string>("100");
  
  const createFood = useMutation(api.foods.create);
  const addToLog = useMutation(api.logs.addToLog);

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

  const macros = useMemo(() => {
    if (!selectedFood) return null;
    const quantity = Number(grams) || 0;
    const factor = quantity / 100;
    return {
      calories: selectedFood.estimatedCaloriesPer100g * factor,
      protein: selectedFood.estimatedProteinPer100g * factor,
      carbs: selectedFood.estimatedCarbsPer100g * factor,
      fat: selectedFood.estimatedFatPer100g * factor,
    };
  }, [selectedFood, grams]);

  function handleAddClick(food: AnalyzedFood) {
    setSelectedFood(food);
    setGrams("100");
    setOpen(true);
  }

  async function handleConfirm() {
    if (!selectedFood) return;
    const quantity = Number(grams);
    if (!quantity || quantity <= 0) return;

    try {
      // Create food in database with estimated values
      const foodId = await createFood({
        name: selectedFood.name,
        caloriesPer100g: selectedFood.estimatedCaloriesPer100g,
        proteinPer100g: selectedFood.estimatedProteinPer100g,
        carbsPer100g: selectedFood.estimatedCarbsPer100g,
        fatPer100g: selectedFood.estimatedFatPer100g,
      });

      // Add to log
      await addToLog({
        foodId: foodId as Id<"foods">,
        quantityGrams: quantity,
      });

      toast.success(t("FoodVision.foodAdded"));
      setOpen(false);
      setSelectedFood(null);
      setGrams("100");
    } catch (error) {
      console.error("Error adding food to diary:", error);
      toast.error(t("FoodVision.errorAdding"));
    }
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

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {foods.map((food, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              {/* Food Image */}
              <div className="flex-shrink-0">
                {food.imageUrl ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide image on error
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                    <ImageOff size={32} className="text-gray-300" />
                  </div>
                )}
              </div>

              {/* Food Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {food.name}
                      </h4>
                      <span
                        className={clsx(
                          "text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0",
                          confidenceColors[food.confidence]
                        )}
                      >
                        {confidenceLabels[food.confidence]}
                      </span>
                    </div>

                    {food.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {food.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="bg-gray-50 px-2 py-1 rounded">
                        {Math.round(food.estimatedCaloriesPer100g)} kcal
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
                    onClick={() => handleAddClick(food)}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-soft-green text-white text-sm font-semibold hover:bg-soft-green-hover transition-colors"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">{t("FoodVision.addToDiary")}</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-sm:w-[95vw] max-sm:max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>{t("FoodVision.addToDiary")}</DialogTitle>
          </DialogHeader>
          {selectedFood && (
            <div className="space-y-4">
              <div className="flex gap-4">
                {selectedFood.imageUrl && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={selectedFood.imageUrl}
                      alt={selectedFood.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{selectedFood.name}</div>
                  <div className="text-sm text-gray-500">
                    {Math.round(selectedFood.estimatedCaloriesPer100g)} kcal · {" "}
                    {selectedFood.estimatedProteinPer100g.toFixed(1)}g P · {" "}
                    {selectedFood.estimatedCarbsPer100g.toFixed(1)}g C · {" "}
                    {selectedFood.estimatedFatPer100g.toFixed(1)}g F per 100g
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("FoodSearch.quantityGrams")}
                </label>
                <input
                  type="number"
                  value={grams}
                  onChange={(e) => setGrams(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-soft-green focus:border-soft-green text-base"
                  min={0}
                />
              </div>

              {macros && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500">{t("DailyProgress.macros.calories")}</div>
                    <div className="font-semibold text-gray-800">
                      {Math.round(macros.calories)} kcal
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500">{t("DailyProgress.macros.protein")}</div>
                    <div className="font-semibold text-gray-800">
                      {macros.protein.toFixed(1)} g
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500">{t("DailyProgress.macros.carbs")}</div>
                    <div className="font-semibold text-gray-800">
                      {macros.carbs.toFixed(1)} g
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500">{t("DailyProgress.macros.fats")}</div>
                    <div className="font-semibold text-gray-800">
                      {macros.fat.toFixed(1)} g
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 max-sm:flex-col-reverse">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm w-full sm:w-auto"
                >
                  {t("FoodSearch.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-4 py-3 rounded-xl bg-soft-green text-white font-semibold hover:bg-soft-green-hover text-sm w-full sm:w-auto"
                >
                  {t("FoodVision.addToDiary")}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
