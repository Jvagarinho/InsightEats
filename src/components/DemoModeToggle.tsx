"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Play, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function DemoModeToggle() {
  const [isLoading, setIsLoading] = useState(false);
  const generateDemoData = useMutation(api.demo.generateDemoData);
  const clearDemoData = useMutation(api.demo.clearDemoData);

  async function handleGenerateDemo() {
    setIsLoading(true);
    try {
      console.log("Generating demo data...");
      const result = await generateDemoData();
      console.log("Demo data generated:", result);
      toast.success(
        `Demo mode activated! Added ${result.foodsAdded} foods, ${result.dailyLogsAdded} meal logs, and ${result.weightLogsAdded} weight entries.`
      );
      // Reload page to show new data
      window.location.reload();
    } catch (error: any) {
      console.error("Demo mode error:", error);
      const errorMessage = error?.message || "Unknown error";
      toast.error(`Failed to generate demo data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleClearDemo() {
    setIsLoading(true);
    try {
      const result = await clearDemoData();
      toast.success(
        `Demo data cleared! Removed ${result.logsRemoved} meal logs and ${result.weightLogsRemoved} weight entries.`
      );
      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Clear demo error:", error);
      toast.error("Failed to clear demo data.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="text-yellow-600" size={24} />
        <div>
          <h3 className="font-semibold text-yellow-800">Demo Mode</h3>
          <p className="text-sm text-yellow-600">
            Generate sample data for promotional screenshots and testing.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleGenerateDemo}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play size={16} />
          {isLoading ? "Generating..." : "Generate Demo Data"}
        </button>

        <button
          onClick={handleClearDemo}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-yellow-600 text-yellow-700 font-semibold hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 size={16} />
          Clear Demo Data
        </button>
      </div>

      <div className="text-xs text-yellow-600 space-y-1">
        <p className="flex items-center gap-1">
          <CheckCircle size={12} />
          Includes: 15 sample foods, 7 days of meal logs, 30 days of weight history
        </p>
        <p className="flex items-center gap-1">
          <CheckCircle size={12} />
          Perfect for taking promotional screenshots
        </p>
      </div>
    </div>
  );
}
