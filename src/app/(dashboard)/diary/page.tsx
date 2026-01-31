"use client";

import { useState } from "react";
import { FoodSearch } from "./FoodSearch";
import { DiaryDashboard } from "./DiaryDashboard";
import { DiaryList } from "./DiaryList";
import { CameraUploader } from "@/components/CameraUploader";
import { FoodVisionResults, type AnalyzedFood } from "@/components/FoodVisionResults";
import { useLanguage } from "@/components/LanguageProvider";
import { Camera, Sparkles } from "lucide-react";

export default function DiaryPage() {
  const { t } = useLanguage();
  const [, setCapturedImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visionResults, setVisionResults] = useState<{ foods: AnalyzedFood[]; summary?: string } | null>(null);

  async function handleImageCapture(file: File, previewUrl: string) {
    setCapturedImage({ file, previewUrl });
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/analyze-food", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            alert(`${t("FoodVision.analysisError")}: ${errorData.error}`);
          } else {
            alert(errorText);
          }
        } catch {
          alert(errorText);
        }
        
        setVisionResults(null);
        setCapturedImage(null);
        return;
      }

      const data = await response.json();
      setVisionResults(data);
    } catch (error) {
      console.error("Image analysis error:", error);
      const errorMsg = error instanceof Error ? error.message : t("FoodVision.analysisError");
      alert(errorMsg);
      setVisionResults(null);
      setCapturedImage(null);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function clearVision() {
    setVisionResults(null);
    setCapturedImage(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t("Diary.title")}</h2>
        <p className="text-gray-600">
          {t("Diary.subtitle")}
        </p>
      </div>

      <DiaryDashboard />

      <div className="bg-gradient-to-br from-soft-green/5 to-blue-50 rounded-2xl border border-soft-green/20 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-soft-green/20 rounded-xl">
            <Camera className="text-soft-green" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {t("FoodVision.title")}
            </h3>
            <p className="text-sm text-gray-600">
              {t("FoodVision.description")}
            </p>
          </div>
        </div>

        <CameraUploader onImageCapture={handleImageCapture} isAnalyzing={isAnalyzing} />

        {isAnalyzing && (
          <div className="flex items-center gap-2 text-soft-green mt-4">
            <Sparkles className="animate-pulse" size={20} />
            <span className="font-medium">{t("FoodVision.analyzing")}</span>
          </div>
        )}

        {visionResults && !isAnalyzing && (
          <FoodVisionResults
            foods={visionResults.foods}
            summary={visionResults.summary}
            onClose={clearVision}
          />
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("Diary.addToDiary")}</h3>
        <FoodSearch />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("Diary.todayLog")}</h3>
        <DiaryList />
      </div>
    </div>
  );
}
