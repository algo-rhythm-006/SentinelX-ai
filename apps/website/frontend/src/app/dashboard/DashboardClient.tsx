"use client";

import { Download, Monitor, Command, Terminal, Shield } from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import DownloadSection from "./components/DownloadSection";
import SetupSteps from "./components/SetupSteps";
import SystemRequirements from "./components/SystemRequirements";
import HowItWorks from "./components/HowItWorks";
import HelpSection from "./components/HelpSection";
import DashboardFooter from "./components/DashboardFooter";

interface DashboardClientProps {
  user: {
    email: string;
    name?: string;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const scrollToDownload = () => {
    const el = document.getElementById("download");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] flex flex-col font-sans selection:bg-[#B7FF00] selection:text-[#050505] relative overflow-x-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(183,255,0,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Top Header */}
      <DashboardHeader user={user} />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 sm:py-16 space-y-16 sm:space-y-24 relative z-10">
        
        {/* Welcome Hero */}
        <section className="text-center max-w-4xl mx-auto pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#9CA3AF] mb-6">
            <Shield className="w-3.5 h-3.5 text-[#B7FF00]" />
            <span>Authenticated Workspace</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F5F5F0] leading-[1.08]">
            Welcome to Sentinel-X
          </h1>

          <p className="mt-4 text-base sm:text-xl text-[#9CA3AF] font-sans max-w-2xl mx-auto leading-relaxed">
            Your local AI-powered security engineering workspace.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToDownload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-xl hover:bg-[#cfff4d] transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Sentinel-X Desktop</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-[#8B8F88]">
            <Monitor className="w-3.5 h-3.5" />
            <span>Windows</span>
            <span className="text-white/20">•</span>
            <Command className="w-3.5 h-3.5" />
            <span>macOS</span>
            <span className="text-white/20">•</span>
            <Terminal className="w-3.5 h-3.5" />
            <span>Linux</span>
          </div>
        </section>

        {/* Download Section (Primary Focus) */}
        <DownloadSection id="download" />

        {/* Get Started Steps */}
        <SetupSteps />

        {/* System Requirements */}
        <SystemRequirements />

        {/* How Sentinel-X Works */}
        <HowItWorks />

        {/* Need Help? */}
        <HelpSection />

      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
