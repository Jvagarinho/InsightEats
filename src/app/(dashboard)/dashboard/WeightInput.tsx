"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useLanguage } from "@/components/LanguageProvider";
import { weightInputSchema } from "@/lib/validations";
import { z } from "zod";

export function WeightInput() {
  const { t } = useLanguage();
  const [weight, setWeight] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const logWeight = useMutation(api.weight.logWeight);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const validatedWeight = weightInputSchema.parse(weight);

      setIsSubmitting(true);
      await logWeight({ weight: validatedWeight });
      toast.success(t("Dashboard.toasts.weightLogged"));
      setWeight("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        toast.error(firstError.message);
      } else {
        toast.error(t("Dashboard.toasts.weightError"));
        console.error(error);
      }
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
