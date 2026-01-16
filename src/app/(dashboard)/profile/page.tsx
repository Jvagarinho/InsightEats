"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageProvider";

type Sex = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export default function ProfilePage() {
  const { user } = useUser();
  const { t } = useLanguage();
  const existingGoals = useQuery(api.goals.getGoals);
  const calculateAndSaveGoals = useMutation(api.goals.calculateAndSaveGoals);

  const [age, setAge] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("sedentary");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingGoals) {
      setAge(existingGoals.age.toString());
      setWeightKg(existingGoals.weightKg.toString());
      setHeightCm(existingGoals.heightCm.toString());
      setSex(existingGoals.sex as Sex);
      setActivityLevel(existingGoals.activityLevel as ActivityLevel);
    }
  }, [existingGoals]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const ageValue = parseInt(age, 10);
    const weightValue = parseFloat(weightKg);
    const heightValue = parseFloat(heightCm);

    if (!ageValue || ageValue < 10 || ageValue > 100) {
      toast.error(t("Profile.toasts.invalidAge"));
      return;
    }

    if (!weightValue || weightValue <= 0 || weightValue > 500) {
      toast.error(t("Profile.toasts.invalidWeight"));
      return;
    }

    if (!heightValue || heightValue <= 0 || heightValue > 260) {
      toast.error(t("Profile.toasts.invalidHeight"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await calculateAndSaveGoals({
        age: ageValue,
        weightKg: weightValue,
        heightCm: heightValue,
        sex,
        activityLevel,
      });

      toast.success(t("Profile.toasts.success"));

      return result;
    } catch (error) {
      toast.error(t("Profile.toasts.error"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasTargets = !!existingGoals;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">{t("Profile.title")}</h2>
        {user && (
          <div className="text-sm text-gray-500">
            {t("Profile.user_info").replace("{name}", user.fullName || user.username || "Logged in").replace("{email}", user.primaryEmailAddress?.emailAddress || "")}
          </div>
        )}
        <p className="text-gray-600 mt-4">
          {t("Profile.subtitle")}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1.5fr)]">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                {t("Profile.form.age")}
              </label>
              <input
                id="age"
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-soft-green focus:border-soft-green bg-white text-lg"
                placeholder="e.g. 30"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                {t("Profile.form.weight")}
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                inputMode="decimal"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-soft-green focus:border-soft-green bg-white text-lg"
                placeholder="e.g. 72.5"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                {t("Profile.form.height")}
              </label>
              <input
                id="height"
                type="number"
                inputMode="decimal"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-soft-green focus:border-soft-green bg-white text-lg"
                placeholder="e.g. 178"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">
                {t("Profile.form.sex")}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSex("male")}
                  className={`flex-1 px-4 py-3 rounded-xl border text-center text-sm font-medium ${
                    sex === "male"
                      ? "bg-soft-green text-white border-soft-green"
                      : "border-gray-200 text-gray-700 bg-white"
                  }`}
                >
                  {t("Profile.form.male")}
                </button>
                <button
                  type="button"
                  onClick={() => setSex("female")}
                  className={`flex-1 px-4 py-3 rounded-xl border text-center text-sm font-medium ${
                    sex === "female"
                      ? "bg-soft-green text-white border-soft-green"
                      : "border-gray-200 text-gray-700 bg-white"
                  }`}
                >
                  {t("Profile.form.female")}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">
                {t("Profile.form.activityLevel")}
              </label>
              <select
                id="activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-soft-green focus:border-soft-green bg-white text-sm"
              >
                <option value="sedentary">{t("Profile.form.activityOptions.sedentary")}</option>
                <option value="light">{t("Profile.form.activityOptions.light")}</option>
                <option value="moderate">{t("Profile.form.activityOptions.moderate")}</option>
                <option value="active">{t("Profile.form.activityOptions.active")}</option>
                <option value="very_active">{t("Profile.form.activityOptions.very_active")}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-soft-green text-white font-semibold hover:bg-soft-green-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base"
          >
            {isSubmitting ? t("Profile.form.saving") : t("Profile.form.saveGoals")}
          </button>
        </form>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t("Profile.dailyTargets")}
            </h3>
            {hasTargets ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">{t("DailyProgress.macros.calories")}</p>
                  <p className="text-2xl font-bold text-soft-green">
                    {Math.round(existingGoals.caloriesTarget)} kcal
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("DailyProgress.macros.protein")}</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {Math.round(existingGoals.proteinTargetGrams)} g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("DailyProgress.macros.carbs")}</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {Math.round(existingGoals.carbsTargetGrams)} g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("DailyProgress.macros.fats")}</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {Math.round(existingGoals.fatTargetGrams)} g
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                {t("Profile.fillDetails")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
