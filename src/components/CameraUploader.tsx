"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

type ImagePreview = {
  url: string;
  file: File;
};

type CameraUploaderProps = {
  onImageCapture: (file: File, previewUrl: string) => void;
  isAnalyzing?: boolean;
};

export function CameraUploader({ onImageCapture, isAnalyzing }: CameraUploaderProps) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<ImagePreview | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 640 },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
        setError(null);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera.unavailable");
    }
  }

  function stopCamera() {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `food-${Date.now()}.jpg`, { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(file);

      setPreview({ url: previewUrl, file });
      stopCamera();
      onImageCapture(file, previewUrl);
    }, "image/jpeg", 0.95);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Camera.invalidFile");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview({ url: previewUrl, file });
    onImageCapture(file, previewUrl);
    setError(null);
  }

  function clearImage() {
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    setPreview(null);
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={startCamera}
          disabled={isAnalyzing}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-soft-green text-soft-green font-semibold hover:bg-soft-green/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Camera size={20} />
          {t("Camera.takePhoto")}
        </button>

        <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-soft-green text-soft-green font-semibold hover:bg-soft-green/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
          <Upload size={20} />
          {t("Camera.uploadFromGallery")}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isAnalyzing}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
          {t(`Camera.errors.${error}`)}
        </p>
      )}

      {preview && (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <div className="aspect-square max-h-64 w-full mx-auto">
            <img
              src={preview.url}
              alt="Food preview"
              className="w-full h-full object-contain"
            />
          </div>
          {!isAnalyzing && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          )}
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="w-full max-w-lg p-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-2xl"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3 justify-center mt-4">
              <button
                type="button"
                onClick={stopCamera}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-800 font-semibold hover:bg-gray-100"
              >
                {t("Camera.cancel")}
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-soft-green text-white font-semibold hover:bg-soft-green-hover"
              >
                <Camera size={20} />
                {t("Camera.capture")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
