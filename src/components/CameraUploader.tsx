"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
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
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setIsInitializing(false);
  }

  async function startCamera() {
    setError(null);
    setIsInitializing(true);
    
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera.notSupported");
      }

      // Show camera UI immediately
      setShowCamera(true);

      // Request camera access
      const constraints = {
        video: {
          facingMode: "environment",
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error("Video element not found"));
            return;
          }

          // If video is already ready, resolve immediately
          if (videoRef.current.readyState >= 2) {
            resolve();
            return;
          }

          // Otherwise wait for it to be ready
          const onLoaded = () => {
            videoRef.current?.removeEventListener("loadeddata", onLoaded);
            resolve();
          };

          const onError = () => {
            videoRef.current?.removeEventListener("error", onError);
            reject(new Error("Camera.playError"));
          };

          videoRef.current.addEventListener("loadeddata", onLoaded);
          videoRef.current.addEventListener("error", onError);

          // Timeout after 5 seconds
          setTimeout(() => {
            videoRef.current?.removeEventListener("loadeddata", onLoaded);
            videoRef.current?.removeEventListener("error", onError);
            reject(new Error("Camera.timeout"));
          }, 5000);
        });

        // Start playing
        await videoRef.current.play();
      }
      
      setIsInitializing(false);
    } catch (err: any) {
      console.error("[Camera] Error:", err);
      setIsInitializing(false);
      
      // Close camera UI on error
      setShowCamera(false);
      
      // Handle specific iOS errors
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera.permissionDenied");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("Camera.notFound");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setError("Camera.inUse");
      } else if (err.message === "Camera.notSupported") {
        setError("Camera.notSupported");
      } else if (err.message === "Camera.playError" || err.message === "Camera.timeout") {
        setError("Camera.unavailable");
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
          disabled={isAnalyzing || isInitializing}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-soft-green text-soft-green font-semibold hover:bg-soft-green/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Camera size={20} />
          {isInitializing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t("Common.loading")}
            </>
          ) : (
            t("Camera.takePhoto")
          )}
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
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-2xl bg-black"
              />
              
              {isInitializing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl">
                  <Loader2 size={40} className="animate-spin text-white mb-2" />
                  <p className="text-white text-sm">{t("Common.loading")}</p>
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex gap-3 justify-center mt-4">
              <button
                type="button"
                onClick={stopCamera}
                disabled={isInitializing}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-800 font-semibold hover:bg-gray-100 disabled:opacity-50"
              >
                {t("Camera.cancel")}
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                disabled={isInitializing}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-soft-green text-white font-semibold hover:bg-soft-green-hover disabled:opacity-50"
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
