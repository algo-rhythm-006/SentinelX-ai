"use client";

import { HardDrive, Cpu, Info, CheckCircle2 } from "lucide-react";

export default function SystemRequirements() {
  return (
    <section className="w-full">
      <div className="rounded-2xl bg-[#0D0F0D] border border-white/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F0]">
              System Requirements
            </h2>
            <p className="mt-1 text-xs font-mono text-[#9CA3AF]">
              Ensure your computer meets the specifications for optimal local analysis performance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#8B8F88] bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-[#B7FF00]" />
            <span>Cross-platform support</span>
          </div>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* OS Support */}
          <div className="p-5 rounded-xl bg-[#050505] border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-[#B7FF00]" />
              <h3 className="font-display text-sm font-bold text-[#F5F5F0]">Supported OS</h3>
            </div>
            <ul className="space-y-2 font-mono text-xs text-[#9CA3AF]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00]" />
                <span>Windows 10 / 11 (64-bit)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00]" />
                <span>macOS 12+ (Apple Silicon & Intel)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00]" />
                <span>Linux (Ubuntu, Debian, Fedora, Arch)</span>
              </li>
            </ul>
          </div>

          {/* Minimum Specs */}
          <div className="p-5 rounded-xl bg-[#050505] border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="w-4 h-4 text-[#9CA3AF]" />
              <h3 className="font-display text-sm font-bold text-[#F5F5F0]">Minimum Specs</h3>
            </div>
            <ul className="space-y-2 font-mono text-xs text-[#9CA3AF]">
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>RAM:</span>
                <span className="text-[#F5F5F0] font-semibold">8 GB</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>Disk Space:</span>
                <span className="text-[#F5F5F0] font-semibold">10 GB free</span>
              </li>
              <li className="flex justify-between">
                <span>Architecture:</span>
                <span className="text-[#F5F5F0] font-semibold">x86_64 / ARM64</span>
              </li>
            </ul>
          </div>

          {/* Recommended Specs */}
          <div className="p-5 rounded-xl bg-[#050505] border border-[#B7FF00]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#B7FF00]/10 border-b border-l border-[#B7FF00]/30 font-mono text-[9px] text-[#B7FF00] uppercase font-bold">
              Optimal
            </div>
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="w-4 h-4 text-[#B7FF00]" />
              <h3 className="font-display text-sm font-bold text-[#F5F5F0]">Recommended Specs</h3>
            </div>
            <ul className="space-y-2 font-mono text-xs text-[#9CA3AF]">
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>RAM:</span>
                <span className="text-[#B7FF00] font-semibold">16 GB+</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-1">
                <span>Disk Space:</span>
                <span className="text-[#B7FF00] font-semibold">20 GB+ free</span>
              </li>
              <li className="flex justify-between">
                <span>GPU Acceleration:</span>
                <span className="text-[#F5F5F0] font-semibold">Metal / CUDA / Vulkan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Model Note */}
        <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#B7FF00] shrink-0 mt-0.5" />
          <p className="font-mono text-xs text-[#9CA3AF] leading-relaxed">
            <strong className="text-[#F5F5F0]">Note:</strong> AI model hardware requirements may vary depending on the local model selected (e.g., quantized models vs full precision LLMs).
          </p>
        </div>
      </div>
    </section>
  );
}
