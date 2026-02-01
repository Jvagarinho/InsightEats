"use client";

import { useState, useRef, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setIsLoading(false);
  }, []);

  async function startCamera() {
    setError(null);
    setIsLoading(true);
    
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera.notSupported");
      }

      // iOS Safari requires facingMode and specific constraints
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      };

      console.log("[Camera] Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log("[Camera] Stream obtained, tracks:", stream.getTracks().length);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready before showing camera UI
        videoRef.current.onloadedmetadata = () => {
          console.log("[Camera] Video metadata loaded");
          videoRef.current?.play().then(() => {
            console.log("[Camera] Video playing");
            setShowCamera(true);
            setIsLoading(false);
          }).catch((err) => {
            console.error("[Camera] Error playing video:", err);
            setError("Camera.playError");
            stopCamera();
          });
        };

        // Fallback timeout in case loadedmetadata doesn't fire
        setTimeout(() => {
          if (!showCamera && streamRef.current) {
            console.log("[Camera] Fallback: forcing show camera");
            setShowCamera(true);
            setIsLoading(false);
          }
        }, 1000);
      }
    } catch (err: any) {
      console.error("[Camera] Error:", err);
      setIsLoading(false);
      
      // Handle specific iOS errors
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera.permissionDenied");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("Camera.notFound");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setError("Camera.inUse");
      } else if (err.message === "Camera.notSupported") {
        setError("Camera.notSupported");
      } else {
        setError("Camera.unavailable");
      }
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Use video dimensions
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
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
          disabled={isAnalyzing || isLoading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-soft-green text-soft-green font-semibold hover:bg-soft-green/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Camera size={20} />
          {isLoading ? t("Common.loading") : t("Camera.takePhoto")}
        </button>

        <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-soft-green text-soft-green font-semibold hover:bg-soft-green/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
          <Upload size={20} />
          {t("Camera.uploadFromGallery")}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            disabled={isAnalyzing}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
          {t(error)}
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
              style={{ transform: "scaleX(-1)" }}
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
