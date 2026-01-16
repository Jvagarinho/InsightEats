"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FoodSearch } from "../diary/FoodSearch";
import { Search } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function FoodsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch a larger list for the library view
  const allFoods = useQuery(api.foods.search, { term: debouncedTerm, limit: 50 }) ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t("Foods.title")}</h2>
        <p className="text-gray-600">
          {t("Foods.subtitle")}
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-soft-green/10 p-6 rounded-3xl space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">{t("Foods.addNewFood")}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {t("Foods.searchDescription")}
        </p>
        <FoodSearch mode="database" />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-bold text-gray-800">{t("Foods.yourLibrary")}</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("Foods.filterLibrary")}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-soft-green focus:border-soft-green text-sm"
            />
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-6 sm:col-span-4">{t("Foods.headers.name")}</div>
            <div className="col-span-6 sm:col-span-2 text-right">{t("Foods.headers.calories")}</div>
            <div className="hidden sm:block col-span-2 text-right">{t("Foods.headers.protein")}</div>
            <div className="hidden sm:block col-span-2 text-right">{t("Foods.headers.carbs")}</div>
            <div className="hidden sm:block col-span-2 text-right">{t("Foods.headers.fat")}</div>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {allFoods.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {t("Foods.emptyLibrary")}
              </div>
            ) : (
              allFoods.map((food) => (
                <div
                  key={food._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-6 sm:col-span-4 font-medium text-gray-800 truncate">
                    {food.name}
                  </div>
                  <div className="col-span-6 sm:col-span-2 text-right text-gray-600">
                    {Math.round(food.caloriesPer100g)} kcal
                  </div>
                  <div className="hidden sm:block col-span-2 text-right text-gray-400 text-sm">
                    {food.proteinPer100g}g
                  </div>
                  <div className="hidden sm:block col-span-2 text-right text-gray-400 text-sm">
                    {food.carbsPer100g}g
                  </div>
                  <div className="hidden sm:block col-span-2 text-right text-gray-400 text-sm">
                    {food.fatPer100g}g
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
