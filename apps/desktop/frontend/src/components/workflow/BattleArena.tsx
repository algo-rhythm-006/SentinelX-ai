"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swords, ShieldCheck, ShieldAlert } from "lucide-react";
import { SecurityAuditReport, RemediationReport, SecurityLogEvent } from "./types";

interface BattleArenaProps {
  auditReport: SecurityAuditReport | null;
  remediationReport: RemediationReport | null;
  isScanning: boolean;
  isRemediating: boolean;
  onTriggerBlueTeam?: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  auditReport,
  remediationReport,
  isScanning,
  isRemediating,
  onTriggerBlueTeam,
}) => {
  const [feed, setFeed] = useState<SecurityLogEvent[]>([]);

  // Dynamically build REAL-TIME events from actual backend audit and remediation reports
  useEffect(() => {
    const events: SecurityLogEvent[] = [];
    const now = new Date();

    if (auditReport && auditReport.verified_vulnerabilities.length > 0) {
      auditReport.verified_vulnerabilities.forEach((vuln, i) => {
        const timeRed = new Date(now.getTime() - (i * 2000)).toTimeString().slice(0, 8);
        const timeBlue = new Date(now.getTime() - (i * 2000) + 500).toTimeString().slice(0, 8);

        // 1. Red Team Attack Event (Left)
        events.push({
          id: `red-${i}-${vuln.file_path}`,
          ts: timeRed,
          side: "red",
          text: `RED TEAM ATTACK → EXPLOITING ${vuln.severity} ${vuln.title.toUpperCase()} IN ${vuln.file_path}:${vuln.line_number || 1}`,
          type: vuln.severity,
        });

        // 2. Blue Team Defense Interception Event (Right)
        const matchingPatch = remediationReport?.patches.find((p) => p.file_path === vuln.file_path);
        
        events.push({
          id: `blue-${i}-${vuln.file_path}`,
          ts: timeBlue,
          side: "blue",
          text: matchingPatch
            ? `BLUE TEAM DEFENSE → ${matchingPatch.syntax_valid ? 'SYNTAX VERIFIED' : 'CODE'} PATCH APPLIED TO ${vuln.file_path}`
            : `BLUE TEAM DEFENSE → THREAT DETECTED & INTERCEPTED IN TWIN SANDBOX (${vuln.file_path})`,
          type: matchingPatch ? "RESOLVED" : "INTERCEPTED",
        });
      });
    }

    // Live active scanning state events
    if (isScanning && events.length === 0) {
      const ts = new Date().toTimeString().slice(0, 8);
      events.push({
        id: `scan-red-${Date.now()}`,
        ts,
        side: "red",
        text: "RED TEAM AGENT → PROBING TARGET REPOSITORY ATTACK SURFACE...",
      });
      events.push({
        id: `scan-blue-${Date.now()}`,
        ts,
        side: "blue",
        text: "BLUE TEAM AGENT → STANDBY. REAL-TIME DEFENSIVE SHIELD ACTIVE.",
      });
    }

    if (isRemediating) {
      const ts = new Date().toTimeString().slice(0, 8);
      events.push({
        id: `rem-blue-${Date.now()}`,
        ts,
        side: "blue",
        text: "BLUE TEAM AGENT → GENERATING SYNTAX-CHECKED REMEDIATION PATCHES...",
      });
    }

    // Default standby message if empty
    if (events.length === 0) {
      events.push({
        id: "standby-1",
        ts: new Date().toTimeString().slice(0, 8),
        side: "red",
        text: "RED TEAM AGENT → STANDBY. AWAITING TARGET SCAN INITIATION.",
      });
      events.push({
        id: "standby-2",
        ts: new Date().toTimeString().slice(0, 8),
        side: "blue",
        text: "BLUE TEAM AGENT → STANDBY. DEFENSIVE MONITORING ACTIVE.",
      });
    }

    setFeed(events);
  }, [auditReport, remediationReport, isScanning, isRemediating]);

  // Compute Real-time Telemetry Stats from actual backend findings & patches
  const rawAttacks = auditReport ? auditReport.total_raw_findings : 0;
  const verifiedVulns = auditReport ? auditReport.verified_vulnerabilities.length : 0;
  const patchesApplied = remediationReport ? remediationReport.total_successful : 0;
  
  // Calculate real-time Security Posture Score
  let score = 100;
  if (verifiedVulns > 0) {
    const fixedRatio = patchesApplied / verifiedVulns;
    score = Math.min(100, Math.round(60 + (fixedRatio * 38)));
  }

  const STATS = [
    { label: "ATTACKS SIMULATED", value: rawAttacks, testId: "battle-attacks" },
    { label: "BLOCKED", value: patchesApplied, testId: "battle-blocked" },
    { label: "VERIFIED", value: verifiedVulns, testId: "battle-verified" },
    { label: "SECURITY SCORE", value: score, suffix: "%", testId: "battle-score", isLime: true },
  ];

  return (
    <div
      data-testid="battle-arena"
      className="relative mt-8 border border-white/10 bg-[#0D0F0D] overflow-hidden shadow-2xl"
    >
      {/* Top Header Row matching Battle.jsx */}
      <div className="relative z-10 grid grid-cols-3 border-b border-white/10 bg-black/40">
        {/* Red Team Left */}
        <div className="p-5 flex items-center gap-3 border-r border-white/10">
          <Swords size={16} className="text-[#FF5F56]" />
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-[#FF5F56] uppercase">RED TEAM</p>
            <p className="font-mono text-[9px] text-ash mt-0.5 uppercase">ATTACK</p>
          </div>
        </div>

        {/* Live Battle Center */}
        <div className="p-4 sm:p-5 text-center border-r border-white/10 flex flex-col items-center justify-center space-y-1">
          <p className="font-mono text-[10px] tracking-[0.25em] text-fog flex items-center justify-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00] animate-pulse" /> LIVE BATTLE
          </p>
          <p className="font-mono text-[9px] text-ash tracking-widest uppercase">
            TWIN SANDBOX · {auditReport ? auditReport.repo_url.split("/").pop() : "STANDBY"}
          </p>

          {/* Smaller, compact Trigger AI Blue Team button embedded right inside Live Battle section */}
          {auditReport && auditReport.verified_vulnerabilities.length > 0 && onTriggerBlueTeam && (
            <button
              type="button"
              onClick={onTriggerBlueTeam}
              disabled={isRemediating}
              className="mt-1 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-[10px] font-bold tracking-[0.15em] uppercase border border-emerald-400/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              {isRemediating ? (
                <>
                  <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  REMEDIATING...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3 h-3 text-[#B7FF00]" />
                  TRIGGER AI BLUE TEAM (AUTO-FIX)
                </>
              )}
            </button>
          )}
        </div>

        {/* Blue Team Right */}
        <div className="p-5 flex items-center justify-end gap-3">
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-[0.25em] text-[#B7FF00] uppercase">BLUE TEAM</p>
            <p className="font-mono text-[9px] text-ash mt-0.5 uppercase">DEFEND</p>
          </div>
          <ShieldCheck size={16} className="text-[#B7FF00]" />
        </div>
      </div>

      {/* Live Event Stream Feed matching Battle.jsx */}
      <div
        data-testid="battle-feed"
        className="relative p-6 md:p-8 h-[380px] font-mono text-xs md:text-sm space-y-3 overflow-y-auto custom-scrollbar"
        style={{
          maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        }}
      >
        <AnimatePresence initial={false}>
          {feed.map((ev) => {
            const isRed = ev.side === "red";
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: isRed ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`relative z-10 flex gap-4 ${isRed ? "justify-start" : "justify-end"}`}
              >
                <span className="text-ash/50 text-[10px] pt-1 shrink-0">[{ev.ts}]</span>
                <span
                  className={`px-3 py-1.5 border max-w-md backdrop-blur-md ${
                    isRed
                      ? "border-[#FF5F56]/30 text-[#FF8A80] bg-[#FF5F56]/10"
                      : "border-[#B7FF00]/30 text-[#B7FF00] bg-[#B7FF00]/10"
                  }`}
                >
                  <span className="text-[9px] tracking-[0.2em] mr-2 opacity-60 uppercase">
                    {isRed ? "ATTACK" : "DEFEND"}
                  </span>
                  {ev.text}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom 4-Column Stats Grid matching Battle.jsx */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 border-t border-white/10 divide-x divide-white/10 bg-[#0D0F0D]">
        {STATS.map((s) => (
          <div key={s.label} data-testid={s.testId} className="p-5 md:p-6 text-center bg-black/20">
            <p className={`font-display text-3xl md:text-4xl font-bold ${s.isLime ? "text-[#B7FF00]" : "text-fog"}`}>
              {s.value}{s.suffix || ""}
            </p>
            <p className="font-mono text-[9px] tracking-[0.2em] text-ash mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
