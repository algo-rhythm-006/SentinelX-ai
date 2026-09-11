"use client";

import React from "react";
import { CheckCircle2, AlertOctagon, GitPullRequest, Code, FileText, Check, ShieldCheck, Terminal } from "lucide-react";
import { RemediationReport, PatchItem } from "./types";

interface SelfHealingStageProps {
  remediationReport: RemediationReport | null;
  isRemediating: boolean;
  onTriggerBlueTeam: () => void;
  hasVerifiedVulns: boolean;
}

export const SelfHealingStage: React.FC<SelfHealingStageProps> = ({
  remediationReport,
  isRemediating,
  onTriggerBlueTeam,
  hasVerifiedVulns,
}) => {
  const formatGitDiff = (diffStr: string) => {
    if (!diffStr) return null;

    return diffStr.split("\n").map((line, idx) => {
      let colorClass = "text-[#8B8F88]";
      if (line.startsWith("+") && !line.startsWith("+++")) {
        colorClass = "text-[#B7FF00] bg-[#B7FF00]/10 font-semibold";
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        colorClass = "text-[#FF5F56] bg-[#FF5F56]/10 font-semibold";
      } else if (line.startsWith("@@")) {
        colorClass = "text-cyan-400 font-bold bg-cyan-950/20";
      }

      return (
        <div key={idx} className={`px-2 py-0.5 whitespace-pre font-mono text-xs ${colorClass}`}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="bg-[#0D0F0D] border border-white/12 p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Stage Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none bg-[#B7FF00]/10 border border-[#B7FF00]/30 flex items-center justify-center text-[#B7FF00]">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold tracking-[0.25em] text-[#B7FF00] uppercase">
              08 // SELF-HEALING ENGINE & PATCH GENERATION
            </h3>
            <p className="font-mono text-[9px] text-ash tracking-widest uppercase">
              DETERMINISTIC & LLM CODE REMEDIATION
            </p>
          </div>
        </div>

        {remediationReport && (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#B7FF00]/10 border border-[#B7FF00]/30 text-[#B7FF00] font-mono text-xs font-bold uppercase">
              {remediationReport.total_successful} PATCH(ES) GENERATED & APPLIED
            </span>
          </div>
        )}
      </div>

      {/* GitHub PR Notification Banner if PR created */}
      {remediationReport?.pull_request_url && (
        <div className="bg-[#050505] border border-[#B7FF00]/40 p-4 flex flex-wrap items-center justify-between gap-4 lime-glow">
          <div className="flex items-center gap-3">
            <GitPullRequest className="w-5 h-5 text-[#B7FF00]" />
            <div>
              <p className="font-mono text-xs font-bold text-[#B7FF00] uppercase tracking-wider">
                GITHUB PULL REQUEST CREATED SUCCESSFULLY
              </p>
              <p className="font-mono text-[10px] text-ash uppercase">
                AUTOMATED PATCH BRANCH MERGED & SENTINELX PR DISPATCHED
              </p>
            </div>
          </div>
          <a
            href={remediationReport.pull_request_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#cfff4d] transition-colors"
          >
            VIEW PR ON GITHUB →
          </a>
        </div>
      )}

      {/* Content Body */}
      {!remediationReport ? (
        <div className="bg-[#050505] border border-white/10 p-8 text-center space-y-4">
          <Terminal className="w-8 h-8 text-ash mx-auto" />
          <div className="max-w-md mx-auto space-y-2">
            <p className="font-mono text-xs font-bold text-fog uppercase tracking-wider">
              SELF-HEALING ENGINE STANDBY
            </p>
            <p className="font-mono text-[11px] text-ash leading-relaxed">
              Trigger AI Blue Team remediation to generate syntax-verified code patches, root-cause summaries, and unified Git diffs.
            </p>
          </div>

          {hasVerifiedVulns && (
            <button
              onClick={onTriggerBlueTeam}
              disabled={isRemediating}
              className="mt-2 px-6 py-3 bg-[#B7FF00] hover:bg-[#cfff4d] text-[#050505] font-mono text-xs font-bold tracking-[0.2em] uppercase transition-colors lime-glow cursor-pointer"
            >
              {isRemediating ? "GENERATING PATCHES..." : "RUN BLUE TEAM AUTO-FIX ENGINE"}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {remediationReport.patches.map((patch: PatchItem, idx: number) => (
            <div key={idx} className="bg-[#050505] border border-white/10 p-5 space-y-4">
              {/* Patch File Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#B7FF00]" />
                  <span className="font-mono text-xs font-bold text-fog">{patch.file_path}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                    patch.syntax_valid
                      ? "bg-[#B7FF00]/10 text-[#B7FF00] border-[#B7FF00]/30"
                      : "bg-[#FF5F56]/10 text-[#FF5F56] border-[#FF5F56]/30"
                  }`}
                >
                  {patch.syntax_valid ? "SYNTAX VERIFIED (AST / NODE)" : "SYNTAX ERROR"}
                </span>
              </div>

              {/* Developer Note Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-[#0D0F0D] p-4 border border-white/10">
                <div className="space-y-1">
                  <span className="text-[#B7FF00] font-bold block uppercase text-[10px]">
                    PATCH SUMMARY
                  </span>
                  <p className="text-ash">{patch.developer_note.summary || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#B7FF00] font-bold block uppercase text-[10px]">
                    ROOT CAUSE IDENTIFIED
                  </span>
                  <p className="text-ash">{patch.developer_note.root_cause || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#B7FF00] font-bold block uppercase text-[10px]">
                    REMEDIATION APPLIED
                  </span>
                  <p className="text-ash">{patch.developer_note.remediation_applied || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#B7FF00] font-bold block uppercase text-[10px]">
                    VERIFICATION STEPS
                  </span>
                  <p className="text-ash">{patch.developer_note.verification_steps || "N/A"}</p>
                </div>
              </div>

              {/* Unified Git Diff Container */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-[0.2em] text-ash uppercase">
                  UNIFIED GIT DIFF PREVIEW:
                </span>
                <div className="bg-black p-3 border border-white/10 font-mono text-xs overflow-x-auto max-h-60 custom-scrollbar">
                  {formatGitDiff(patch.git_diff)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
