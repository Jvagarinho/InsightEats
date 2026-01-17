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

type WeightChartProps = {
  days: number;
};

export function WeightChart({ days }: WeightChartProps) {
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - (days - 1));

  const filtered = history.filter((entry) => {
    const d = new Date(entry.date);
    d.setHours(0, 0, 0, 0);
    return d >= start;
  });

  if (filtered.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
        {t("Dashboard.noWeightData")}
      </div>
    );
  }

  const first = filtered[0];
  const last = filtered[filtered.length - 1];
  const startWeight = first.weight;
  const currentWeight = last.weight;
  const delta = currentWeight - startWeight;
  const deltaPercent =
    startWeight > 0 ? (delta / startWeight) * 100 : 0;

  // Format date for display (e.g., "Jan 15")
  const data = filtered.map((entry) => ({
    ...entry,
    displayDate: new Date(entry.date).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="w-full h-72 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-4 text-sm">
        <div className="flex items-baseline gap-1">
          <span className="text-gray-500">{t("Dashboard.rangeStart")}:</span>
          <span className="font-semibold text-gray-800">
            {startWeight.toFixed(1)} kg
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-gray-500">
            {t("Dashboard.rangeCurrent")}:
          </span>
          <span className="font-semibold text-gray-800">
            {currentWeight.toFixed(1)} kg
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-gray-500">
            {t("Dashboard.rangeChange")}:
          </span>
          <span
            className={`font-semibold ${
              delta === 0
                ? "text-gray-500"
                : delta < 0
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)} kg
            {startWeight > 0 && (
              <>
                {" "}
                ({deltaPercent > 0 ? "+" : ""}
                {deltaPercent.toFixed(1)}%)
              </>
            )}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
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
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#2D5A27"
            strokeWidth={3}
            dot={{
              fill: "#2D5A27",
              strokeWidth: 2,
              r: 4,
              stroke: "#fff",
            }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
