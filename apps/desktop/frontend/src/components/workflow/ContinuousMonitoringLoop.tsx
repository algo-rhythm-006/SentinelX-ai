"use client";

import React from "react";
import { RefreshCw, ShieldCheck, Activity, Radio, Cpu, ArrowUp } from "lucide-react";

export const ContinuousMonitoringLoop: React.FC = () => {
  return (
    <section className="bg-[#050505] border-t border-b border-white/10 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Radial glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#B7FF00]/[0.04] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto text-center space-y-8 relative z-10">
        
        {/* Continuous Loop Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0D0F0D] border border-[#B7FF00]/40 rounded-full font-mono text-xs tracking-[0.3em] text-[#B7FF00] uppercase lime-glow">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
          CONTINUOUS MONITORING LOOP ACTIVE
        </div>

        {/* Title */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="font-display font-bold uppercase text-3xl sm:text-5xl text-fog tracking-tight">
            THE AUTONOMOUS <span className="text-[#B7FF00]">SECURITY LOOP NEVER STOPS</span>
          </h2>
          <p className="font-mono text-xs text-ash tracking-widest uppercase leading-relaxed">
            SENTINELX CONTINUOUSLY WATCHES, ATTACKS, DEFENDS, VERIFIES, HEALS, AND RE-EVALUATES THE APPLICATION IN PERPETUITY.
          </p>
        </div>

        {/* Visual Loop Representation */}
        <div className="pt-6 pb-2">
          <div className="max-w-4xl mx-auto bg-[#0D0F0D] border border-white/12 p-8 relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 font-mono text-[10px] font-bold tracking-wider text-fog uppercase">
              <div className="p-3 bg-[#050505] border border-white/10 flex flex-col items-center gap-1.5">
                <span className="text-[#B7FF00]">01</span>
                <span>INGEST</span>
              </div>
              <div className="p-3 bg-[#050505] border border-white/10 flex flex-col items-center gap-1.5">
                <span className="text-[#B7FF00]">02</span>
                <span>DISCOVER</span>
              </div>
              <div className="p-3 bg-[#050505] border border-white/10 flex flex-col items-center gap-1.5">
                <span className="text-[#B7FF00]">03-04</span>
                <span>TWIN & SCAN</span>
              </div>
              <div className="p-3 bg-[#050505] border border-[#FF5F56]/40 text-[#FF5F56] flex flex-col items-center gap-1.5">
                <span>05</span>
                <span>ATTACK</span>
              </div>
              <div className="p-3 bg-[#050505] border border-[#B7FF00]/40 text-[#B7FF00] flex flex-col items-center gap-1.5">
                <span>06</span>
                <span>DEFEND</span>
              </div>
              <div className="p-3 bg-[#050505] border border-white/10 flex flex-col items-center gap-1.5">
                <span>07-09</span>
                <span>HEAL & VERIFY</span>
              </div>
              <div className="p-3 bg-[#050505] border border-[#B7FF00]/60 text-[#B7FF00] flex flex-col items-center gap-1.5 col-span-2 sm:col-span-1">
                <span>10</span>
                <span>MONITOR</span>
              </div>
            </div>

            {/* Connecting Loop Line returning to 01 */}
            <div className="mt-6 flex items-center justify-between border-t border-dashed border-[#B7FF00]/40 pt-4 font-mono text-[10px] text-[#B7FF00] tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>POSTURE SECURED</span>
              </div>
              <div className="flex items-center gap-2">
                <span>LOOP BACK TO REPO INGESTION</span>
                <ArrowUp className="w-4 h-4 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Footer Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 font-mono text-xs text-ash tracking-widest uppercase">
          <span className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#B7FF00] animate-pulse" />
            REAL-TIME DRIFT DETECTION: ACTIVE
          </span>
          <span className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#B7FF00]" />
            SWARM AGENTS: STANDBY
          </span>
          <span className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#B7FF00]" />
            DEVSECOPS PIPELINE: PROTECTED
          </span>
        </div>

      </div>
    </section>
  );
};
