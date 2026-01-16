"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageProvider";

export function WeightInput() {
  const { t } = useLanguage();
  const [weight, setWeight] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const logWeight = useMutation(api.weight.logWeight);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(weight);
    
    if (!value || value <= 0 || value > 500) {
      toast.error(t("Dashboard.toasts.invalidWeight"));
      return;
    }

    setIsSubmitting(true);
    try {
      await logWeight({ weight: value });
      toast.success(t("Dashboard.toasts.weightLogged"));
      setWeight("");
    } catch (error) {
      toast.error(t("Dashboard.toasts.weightError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1">
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
          {t("Dashboard.weightInputLabel")}
        </label>
        <input
          id="weight"
          type="number"
          step="0.1"
          placeholder={t("Dashboard.weightInputPlaceholder")}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-soft-green focus:border-soft-green bg-white text-lg"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !weight}
        className="px-6 py-3 rounded-xl bg-soft-green text-white font-semibold hover:bg-soft-green-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[52px]"
      >
        {isSubmitting ? t("Dashboard.saving") : t("Dashboard.logAction")}
      </button>
    </form>
  );
}
