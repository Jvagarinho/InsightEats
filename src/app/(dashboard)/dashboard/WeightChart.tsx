"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/components/LanguageProvider";

export function WeightChart() {
  const { t, locale } = useLanguage();
  const history = useQuery(api.weight.getHistory);

  if (!history) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        {t("Dashboard.loadingChart")}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
        {t("Dashboard.noWeightData")}
      </div>
    );
  }

  // Format date for display (e.g., "Jan 15")
  const data = history.map((entry) => ({
    ...entry,
    displayDate: new Date(entry.date).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="displayDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            domain={["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#2D5A27" // soft-green
            strokeWidth={3}
            dot={{ fill: "#2D5A27", strokeWidth: 2, r: 4, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
