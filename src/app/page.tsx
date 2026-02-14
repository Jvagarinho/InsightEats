"use client";

import Link from "next/link";
import Image from "next/image";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useLanguage } from "@/components/LanguageProvider";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-3xl space-y-8">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="InsightEats Logo" width={120} height={120} className="mb-4" />
        </div>
        <h1 className="text-5xl font-extrabold text-soft-green tracking-tight">
          {t("Landing.title")}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t("Landing.description")}
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-soft-green text-white rounded-full font-semibold hover:bg-soft-green-hover transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {t("Landing.signIn")}
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-white text-soft-green border-2 border-soft-green rounded-full font-semibold hover:bg-gray-50 transition-colors">
                {t("Landing.getStarted")}
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-soft-green text-white rounded-full font-semibold hover:bg-soft-green-hover transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t("Landing.goToDashboard")}
            </Link>
          </SignedIn>
        </div>
      </div>

      <footer className="absolute bottom-8 text-gray-400 text-sm">
        {t("Landing.copyright").replace("{year}", new Date().getFullYear().toString())}
      </footer>
    </div>
  );
}

