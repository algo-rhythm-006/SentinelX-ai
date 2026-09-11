"use client";

import React from "react";
import { Terminal, Shield, Play, Cpu, Activity, Radar } from "lucide-react";

interface WorkflowHeroProps {
  repoUrl: string;
  setRepoUrl: (val: string) => void;
  branch: string;
  setBranch: (val: string) => void;
  githubToken: string;
  setGithubToken: (val: string) => void;
  createPR: boolean;
  setCreatePR: (val: boolean) => void;
  isScanning: boolean;
  isRemediating: boolean;
  onStartAudit: (e: React.FormEvent) => void;
}

export const WorkflowHero: React.FC<WorkflowHeroProps> = ({
  repoUrl,
  setRepoUrl,
  branch,
  setBranch,
  githubToken,
  setGithubToken,
  createPR,
  setCreatePR,
  isScanning,
  isRemediating,
  onStartAudit,
}) => {
  return (
    <section className="relative w-full border-b border-white/10 bg-[#050505] pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#B7FF00]/[0.03] blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto space-y-8 relative z-10">
        
        {/* Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D0F0D] border border-[#B7FF00]/30 text-[#B7FF00]">
              <span className="w-2 h-2 rounded-full bg-[#B7FF00] animate-pulse" />
              SYSTEM STATUS: ● AUTONOMOUS DEFENSE ONLINE
            </span>
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D0F0D] border border-white/10 text-ash">
              <Cpu className="w-3.5 h-3.5 text-[#B7FF00]" />
              MODEL: qwen2.5-coder:7b
            </span>
          </div>

          <div className="flex items-center gap-4 text-ash">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#B7FF00]" />
              10 SECURITY PHASES
            </span>
            <span className="hidden sm:inline-block text-white/20">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Radar className="w-3.5 h-3.5 text-[#FF5F56]" />
              MULTI-AGENT ENGINE
            </span>
            <span className="hidden sm:inline-block text-white/20">|</span>
            <span className="flex items-center gap-1.5 text-[#B7FF00]">
              <Shield className="w-3.5 h-3.5" />
              CONTINUOUS MONITORING
            </span>
          </div>
        </div>

        {/* Title Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#B7FF00] tracking-[0.3em] uppercase bg-[#B7FF00]/5 px-3 py-1 border border-[#B7FF00]/20">
            <Terminal className="w-3.5 h-3.5" />
            SENTINELX AI · AUTONOMOUS COMMAND CENTER
          </div>

          <h1 className="font-display font-bold uppercase tracking-tight text-4xl sm:text-6xl md:text-7xl leading-none text-fog">
            SENTINELX <span className="text-[#B7FF00] text-glow">AI</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-ash uppercase tracking-[0.2em] max-w-3xl">
            AUTONOMOUS AI CYBER DEFENSE PLATFORM — DISCOVER, ATTACK, DEFEND, HEAL, VALIDATE & MONITOR CONTINUOUSLY.
          </p>
        </div>

        {/* Form Panel */}
        <div className="bg-[#0D0F0D] border border-white/12 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-mono text-xs tracking-[0.25em] text-[#B7FF00] uppercase flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              01 // TARGET REPOSITORY INGESTION & AUDIT CONFIG
            </h2>
            <span className="font-mono text-[10px] text-ash tracking-widest uppercase hidden sm:inline-block">
              SECURE ISOLATED SANDBOX
            </span>
          </div>

          <form onSubmit={onStartAudit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label className="block font-mono text-[10px] tracking-[0.25em] text-ash uppercase">
                  GIT REPOSITORY URL
                </label>
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/target-repo.git"
                  className="w-full px-4 py-3 bg-[#050505] border border-white/15 text-fog text-xs font-mono placeholder:text-ash/40 focus:border-[#B7FF00] focus:outline-none transition-colors rounded-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] tracking-[0.25em] text-ash uppercase">
                  TARGET BRANCH
                </label>
                <input
                  type="text"
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="w-full px-4 py-3 bg-[#050505] border border-white/15 text-fog text-xs font-mono placeholder:text-ash/40 focus:border-[#B7FF00] focus:outline-none transition-colors rounded-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isScanning || isRemediating}
                  className="w-full py-3 px-6 bg-[#B7FF00] hover:bg-[#cfff4d] disabled:opacity-40 disabled:cursor-not-allowed text-[#050505] font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all lime-glow cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                      AUDITING REPO...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      START RED TEAM SCAN
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Optional GitHub PR Options */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex-1 min-w-[280px] space-y-1.5">
                <label className="block text-[10px] tracking-[0.2em] text-ash uppercase">
                  GITHUB PAT TOKEN (OPTIONAL FOR AUTOMATED PR)
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 bg-[#050505] border border-white/15 text-fog text-xs font-mono placeholder:text-ash/30 focus:border-[#B7FF00] focus:outline-none rounded-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 sm:pt-0">
                <label className="flex items-center gap-2 cursor-pointer select-none text-ash text-[11px] uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={createPR}
                    onChange={(e) => setCreatePR(e.target.checked)}
                    className="w-4 h-4 bg-[#050505] border border-white/20 accent-[#B7FF00]"
                  />
                  <span>AUTO-CREATE GITHUB PULL REQUEST ON REMEDIATION</span>
                </label>
              </div>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};
