import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl font-extrabold text-soft-green tracking-tight">
          InsightEats
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Take control of your nutrition with intelligent tracking. 
          Log meals, monitor your macros, and achieve your goals with ease.
        </p>
        
        <div className="flex gap-4 justify-center pt-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-soft-green text-white rounded-full font-semibold hover:bg-soft-green-hover transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-white text-soft-green border-2 border-soft-green rounded-full font-semibold hover:bg-gray-50 transition-colors">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link 
              href="/dashboard"
              className="px-8 py-3 bg-soft-green text-white rounded-full font-semibold hover:bg-soft-green-hover transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-gray-400 text-sm">
        © {new Date().getFullYear()} InsightEats. All rights reserved.
      </footer>
    </div>
  );
}
