"use client";

import { Download, LogIn, Sliders, ShieldCheck, ArrowRight } from "lucide-react";

export default function SetupSteps() {
  const steps = [
    {
      number: "01",
      title: "Download Sentinel-X Desktop",
      description: "Download and install the Sentinel-X desktop application on your computer.",
      icon: Download,
    },
    {
      number: "02",
      title: "Sign in",
      description: "Open Sentinel-X Desktop and sign in using your Sentinel-X account.",
      icon: LogIn,
    },
    {
      number: "03",
      title: "Complete setup",
      description: "Follow the setup wizard to prepare Sentinel-X for local security analysis.",
      icon: Sliders,
    },
    {
      number: "04",
      title: "Start securing your code",
      description: "Once setup is complete, you can begin using Sentinel-X to analyze and secure your projects.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="w-full">
      <div className="mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F0]">
          Get Started with Sentinel-X
        </h2>
        <p className="mt-2 text-xs sm:text-sm font-mono text-[#9CA3AF]">
          Four simple steps to initialize your local AI security engineering workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative p-6 rounded-2xl bg-[#0D0F0D] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold text-[#B7FF00] bg-[#B7FF00]/10 border border-[#B7FF00]/20 px-2.5 py-1 rounded-lg">
                    Step {step.number}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9CA3AF] group-hover:text-[#F5F5F0] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-display text-base font-bold text-[#F5F5F0] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-white/20 pointer-events-none">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
