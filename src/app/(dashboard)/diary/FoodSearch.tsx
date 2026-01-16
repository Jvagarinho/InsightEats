"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

type Food = {
  _id: Id<"foods">;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

type ExternalFood = {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g?: number;
  source?: "Open Food Facts" | "USDA";
};

type SelectedFood = Food | null;

type FoodSearchProps = {
  mode?: "log" | "database";
};

export function FoodSearch({ mode = "log" }: FoodSearchProps) {
  const { t } = useLanguage();
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedFood>(null);
  const [grams, setGrams] = useState<string>("");
  const [externalFoods, setExternalFoods] = useState<ExternalFood[]>([]);
  const [externalLoading, setExternalLoading] = useState(false);
  
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedTerm(term.trim());
    }, 300);
    return () => clearTimeout(id);
  }, [term]);

  const foods = useQuery(api.foods.search, { term: debouncedTerm, limit: 10 }) ?? [];
  const addToLog = useMutation(api.logs.addToLog);
  const createFood = useMutation(api.foods.create);

  useEffect(() => {
    if (!debouncedTerm || debouncedTerm.length < 3) {
      setExternalFoods([]);
      setExternalLoading(false);
      return;
    }

    let cancelled = false;
    setExternalLoading(true);

    const run = async () => {
      try {
        const response = await fetch(
          `/api/external-foods?term=${encodeURIComponent(debouncedTerm)}`
        );

        if (!response.ok) {
          console.error(
            "External foods proxy error",
            response.status,
            response.statusText
          );
          if (!cancelled) {
            setExternalFoods([]);
          }
          return;
        }

        const data = await response.json();
        const products = Array.isArray(data.products) ? data.products : [];

        if (!cancelled) {
          setExternalFoods(products);
        }
      } catch (error) {
        console.error("External foods search error", error);
        if (!cancelled) {
          setExternalFoods([]);
        }
      } finally {
        if (!cancelled) {
          setExternalLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [debouncedTerm]);

  const macros = useMemo(() => {
    if (!selected) return null;
    const quantity = Number(grams) || 0;
    const factor = quantity / 100;
    return {
      calories: selected.caloriesPer100g * factor,
      protein: selected.proteinPer100g * factor,
      carbs: selected.carbsPer100g * factor,
      fat: selected.fatPer100g * factor,
    };
  }, [selected, grams]);

  function handleSelect(food: Food) {
    if (mode === "database") {
      toast.info(t("FoodSearch.alreadyInDb"));
      return;
    }
    setSelected(food);
    setGrams("");
    setOpen(true);
  }

  async function handleSelectExternal(food: ExternalFood) {
    const foodId = await createFood({
      name: food.name,
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
      fiberPer100g: food.fiberPer100g,
    });

    if (mode === "database") {
      toast.success(t("FoodSearch.addedToDb"));
      // Optionally clear search or keep it
      return;
    }

    const localFood: Food = {
      _id: foodId,
      name: food.name,
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
    };

    handleSelect(localFood);
  }

  async function handleConfirm() {
    if (!selected) return;
    const quantity = Number(grams);
    if (!quantity || quantity <= 0) return;

    await addToLog({
      foodId: selected._id,
      quantityGrams: quantity,
    });

    toast.success(t("FoodSearch.mealRecorded"));

    setOpen(false);
    setSelected(null);
    setGrams("");
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={t("FoodSearch.placeholder")}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-soft-green focus:border-soft-green bg-white text-base"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y max-h-72 overflow-y-auto">
        {foods.map((food) => (
          <button
            key={food._id}
            onClick={() => handleSelect(food as Food)}
            className="w-full text-left px-4 py-4 hover:bg-gray-50 flex justify-between items-center active:bg-gray-100"
          >
            <span className="font-medium text-gray-800 text-sm sm:text-base">
              {food.name}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              {food.caloriesPer100g} kcal / 100g
            </span>
          </button>
        ))}

        {externalFoods.length > 0 && (
          <>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
              {t("FoodSearch.externalResults")}
            </div>
            {externalFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => handleSelectExternal(food)}
                className="w-full text-left px-4 py-4 hover:bg-gray-50 flex justify-between items-center active:bg-gray-100"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 text-sm sm:text-base">
                    {food.name}
                  </span>
                  {food.source && (
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-0.5">
                      {food.source}
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  {Math.round(food.caloriesPer100g)} kcal / 100g
                </span>
              </button>
            ))}
          </>
        )}

        {externalLoading && (
          <div className="px-4 py-3 text-gray-400 text-sm">
            {t("FoodSearch.searchingExternal")}
          </div>
        )}

        {foods.length === 0 &&
          !externalLoading &&
          externalFoods.length === 0 &&
          debouncedTerm && (
            <div className="px-4 py-3 text-gray-400 text-sm">
              {t("FoodSearch.noResults")}
            </div>
          )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-sm:w-[95vw] max-sm:max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>{t("FoodSearch.addFood")}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-gray-800">{selected.name}</div>
                <div className="text-sm text-gray-500">
                  {selected.caloriesPer100g} kcal · {selected.proteinPer100g}g P ·{" "}
                  {selected.carbsPer100g}g C · {selected.fatPer100g}g F per 100g
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
                  {t("FoodSearch.addToDiary")}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
