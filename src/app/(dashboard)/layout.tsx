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
    </>
  );
}
