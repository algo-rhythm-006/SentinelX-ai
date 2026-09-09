"use client";

import { Laptop, Shield, Cpu, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const flowSteps = [
    {
      label: "Your Computer",
      detail: "Source code & local env",
      icon: Laptop,
    },
    {
      label: "Sentinel-X Desktop",
      detail: "Isolated desktop client",
      icon: Shield,
    },
    {
      label: "Security Analysis",
      detail: "SAST & local scanners",
      icon: Cpu,
    },
    {
      label: "AI-assisted Security",
      detail: "On-device security models",
      icon: Sparkles,
    },
    {
      label: "Security Results",
      detail: "Actionable remediation",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="w-full">
      <div className="rounded-2xl bg-[#0D0F0D] border border-white/10 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#B7FF00] uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00]" />
            Local Privacy First
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F0]">
            How Sentinel-X Works
          </h2>
          <p className="mt-2 text-sm text-[#9CA3AF] leading-relaxed">
            <strong className="text-[#F5F5F0]">Your code stays on your machine.</strong> Sentinel-X Desktop performs security analysis locally, using local security tools and AI models.
          </p>
        </div>

        {/* Visual Flow Pipeline */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 relative">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="relative flex flex-col items-center text-center">
                  <div className="w-full p-4 rounded-xl bg-[#050505] border border-white/10 hover:border-[#B7FF00]/30 transition-all flex flex-col items-center group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#B7FF00] mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-xs font-bold text-[#F5F5F0]">
                      {step.label}
                    </h3>
                    <p className="font-mono text-[10px] text-[#8B8F88] mt-1">
                      {step.detail}
                    </p>
                  </div>

                  {index < flowSteps.length - 1 && (
                    <div className="hidden md:flex items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#B7FF00]/40">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
