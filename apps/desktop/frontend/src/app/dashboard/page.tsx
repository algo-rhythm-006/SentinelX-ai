import DesktopSidebar from "@/components/DesktopSidebar";
import DesktopHeader from "@/components/DesktopHeader";
import { SentinelWorkflow } from "@/components/workflow/SentinelWorkflow";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex text-fog antialiased">
      {/* Fixed Left Sidebar */}
      <DesktopSidebar />

      {/* Main App Workspace */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <DesktopHeader title="SentinelX Autonomous Cyber Defense Command Center" />

        <main className="flex-1 w-full mx-auto space-y-8">
          <SentinelWorkflow />
        </main>
      </div>
    </div>
  );
}
