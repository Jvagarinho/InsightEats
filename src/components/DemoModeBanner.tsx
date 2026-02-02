"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export function DemoModeBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const demoStatus = useQuery(api.demo.checkDemoStatus);

  if (isDismissed || !demoStatus?.hasDemoData) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle size={18} />
          <span className="text-sm font-medium">
            Demo Mode Active: {demoStatus.foodCount} foods, {demoStatus.logCount} logs, {demoStatus.weightLogCount} weight entries
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-yellow-700 hover:text-yellow-900 p-1"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
