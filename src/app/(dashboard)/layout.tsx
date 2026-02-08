import { Sidebar } from "@/components/Sidebar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { DemoModeBanner } from "@/components/DemoModeBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DemoModeBanner />
      <div className="flex min-h-screen bg-light-gray">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 overflow-y-auto">
          {children}
        </main>
      </div>
      <MobileNavigation />
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 text-center text-xs text-gray-500 z-40">
        © {new Date().getFullYear()} IterioTech. All rights reserved.{" | "}
        <a href="https://iteriotech.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          iteriotech.com
        </a>
        {" | "}Building the future of application development, one iteration at a time.
      </footer>
    </>
  );
}
