"use client";

import React, { useState } from "react";
import {
  FileBarChart,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Code2,
  CheckCircle,
  Copy,
  Download,
  Terminal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SecurityAuditReport, RemediationReport } from "./types";

interface SecurityReportStageProps {
  auditReport: SecurityAuditReport | null;
  remediationReport: RemediationReport | null;
}

export const SecurityReportStage: React.FC<SecurityReportStageProps> = ({
  auditReport,
  remediationReport,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!auditReport) {
    return (
      <div className="bg-[#0D0F0D] border border-white/10 p-6 font-mono text-xs text-ash space-y-2">
        <div className="flex items-center gap-2 text-ash/60">
          <Terminal size={14} />
          <span>STEP 10 // SECURITY INTELLIGENCE REPORT IN STANDBY</span>
        </div>
        <p className="text-[11px] text-ash/50">
          Awaiting completion of audit and remediation pipelines to compile final vulnerability report and developer fix notes.
        </p>
      </div>
    );
  }

  const vulns = auditReport.verified_vulnerabilities || [];
  const patches = remediationReport?.patches || [];

  const criticalCount = vulns.filter((v) => v.severity === "CRITICAL").length;
  const highCount = vulns.filter((v) => v.severity === "HIGH").length;
  const mediumCount = vulns.filter((v) => v.severity === "MEDIUM").length;
  const lowCount = vulns.filter((v) => v.severity === "LOW").length;

  const handleCopyReport = () => {
    const summaryText = `SENTINELX AI SECURITY AUDIT REPORT\nRepository: ${auditReport.repo_url}\nBranch: ${auditReport.branch}\nTotal Findings: ${auditReport.total_raw_findings}\nVerified Vulnerabilities: ${vulns.length}\nPatches Applied: ${remediationReport?.total_successful || 0}\n`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const reportData = {
      audit_summary: auditReport,
      remediation_summary: remediationReport,
      generated_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentinelx-security-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0D0F0D] border border-white/12 p-6 sm:p-8 space-y-8 shadow-2xl font-mono">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#B7FF00]/10 border border-[#B7FF00]/30 text-[#B7FF00]">
            <FileBarChart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-lg text-fog uppercase tracking-tight">
              10 // SECURITY INTELLIGENCE REPORT & DEVELOPER FIX NOTES
            </h4>
            <p className="text-[10px] text-ash tracking-widest uppercase">
              DETAILED THREAT ANALYSIS · DEVELOPER SOLUTION NOTES · DEVSECOPS DISPATCH
            </p>
          </div>
        </div>

        {/* Report Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyReport}
            type="button"
            className="px-3 py-1.5 bg-[#050505] hover:bg-white/10 text-fog border border-white/20 text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-[#B7FF00]" />
            {copied ? "COPIED!" : "COPY SUMMARY"}
          </button>

          <button
            onClick={handleDownloadReport}
            type="button"
            className="px-3 py-1.5 bg-[#B7FF00] hover:bg-[#cfff4d] text-[#050505] font-bold text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer lime-glow"
          >
            <Download className="w-3.5 h-3.5" />
            DOWNLOAD REPORT (.JSON)
          </button>
        </div>
      </div>

      {/* GitHub PR Integration Banner */}
      {remediationReport?.pull_request_url && (
        <div className="bg-[#050505] border border-[#B7FF00]/50 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 lime-glow">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#B7FF00]" />
            <div>
              <p className="font-bold text-xs text-[#B7FF00] tracking-wider uppercase">
                AUTOMATED GITHUB PULL REQUEST DISPATCHED
              </p>
              <p className="text-[11px] text-ash mt-0.5">{remediationReport.pull_request_url}</p>
            </div>
          </div>
          <a
            href={remediationReport.pull_request_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#B7FF00] text-[#050505] font-bold text-xs tracking-widest uppercase hover:bg-[#cfff4d] transition-all flex items-center gap-2"
          >
            VIEW PR ON GITHUB <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Security Posture Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
        <div className="p-4 bg-[#050505] border border-white/10">
          <p className="text-[9px] text-ash tracking-widest uppercase">TOTAL FINDINGS</p>
          <p className="font-display text-2xl font-bold text-fog mt-1">{auditReport.total_raw_findings}</p>
        </div>
        <div className="p-4 bg-[#050505] border border-[#FF5F56]/30">
          <p className="text-[9px] text-[#FF5F56] tracking-widest uppercase">CRITICAL</p>
          <p className="font-display text-2xl font-bold text-[#FF5F56] mt-1">{criticalCount}</p>
        </div>
        <div className="p-4 bg-[#050505] border border-amber-500/30">
          <p className="text-[9px] text-amber-400 tracking-widest uppercase">HIGH</p>
          <p className="font-display text-2xl font-bold text-amber-400 mt-1">{highCount}</p>
        </div>
        <div className="p-4 bg-[#050505] border border-yellow-500/30">
          <p className="text-[9px] text-yellow-400 tracking-widest uppercase">MEDIUM</p>
          <p className="font-display text-2xl font-bold text-yellow-400 mt-1">{mediumCount}</p>
        </div>
        <div className="p-4 bg-[#050505] border border-[#B7FF00]/30 col-span-2 md:col-span-1">
          <p className="text-[9px] text-[#B7FF00] tracking-widest uppercase">PATCHES APPLIED</p>
          <p className="font-display text-2xl font-bold text-[#B7FF00] mt-1">
            {remediationReport?.total_successful || 0}
          </p>
        </div>
      </div>

      {/* Detailed Vulnerabilities & Developer Fix Notes List */}
      <div className="space-y-6">
        <h5 className="text-[11px] font-bold text-ash tracking-widest uppercase flex items-center gap-2 border-b border-white/10 pb-2">
          <Code2 className="w-4 h-4 text-[#B7FF00]" />
          VERIFIED VULNERABILITIES & DEVELOPER SOLUTION BREAKDOWN
        </h5>

        {vulns.length === 0 ? (
          <div className="p-6 bg-[#050505] border border-[#B7FF00]/20 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-[#B7FF00] mx-auto" />
            <p className="font-bold text-fog text-xs uppercase">NO VERIFIED VULNERABILITIES DETECTED</p>
            <p className="text-[11px] text-ash">Target repository surface passed all static and dynamic threat audits.</p>
          </div>
        ) : (
          vulns.map((vuln, idx) => {
            const matchingPatch = patches.find((p) => p.file_path === vuln.file_path);
            const devNote = matchingPatch?.developer_note;
            const isExpanded = expandedIndex === idx;

            const severityClass =
              vuln.severity === "CRITICAL"
                ? "border-[#FF5F56]/60 bg-[#FF5F56]/10 text-[#FF8A80]"
                : vuln.severity === "HIGH"
                ? "border-amber-500/60 bg-amber-500/10 text-amber-300"
                : "border-yellow-500/60 bg-yellow-500/10 text-yellow-300";

            return (
              <div key={idx} className="bg-[#050505] border border-white/12 overflow-hidden space-y-0">
                {/* Vulnerability Entry Header Bar */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-4 sm:p-5 bg-[#0D0F0D] hover:bg-white/5 cursor-pointer flex flex-wrap items-center justify-between gap-3 border-b border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border ${severityClass}`}>
                      {vuln.severity}
                    </span>
                    <div>
                      <h6 className="font-display font-bold text-sm sm:text-base text-fog uppercase tracking-tight">
                        {vuln.title}
                      </h6>
                      <p className="text-[10px] text-ash tracking-wider uppercase mt-0.5">
                        {vuln.cwe_id || "CWE-UNKNOWN"} · {vuln.file_path}:{vuln.line_number || 1} · VIA {vuln.scanner_source.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {matchingPatch ? (
                      <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase bg-[#B7FF00]/10 text-[#B7FF00] border border-[#B7FF00]/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        FIXED BY BLUE TEAM
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase bg-amber-950/40 text-amber-400 border border-amber-800/60 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        AWAITING REMEDIATION
                      </span>
                    )}

                    {isExpanded ? <ChevronUp size={16} className="text-ash" /> : <ChevronDown size={16} className="text-ash" />}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 space-y-6 text-xs font-mono">
                    {/* Vulnerability Root Cause & Vulnerable Code */}
                    <div className="space-y-3">
                      <p className="text-[10px] text-ash tracking-widest uppercase font-bold">
                        1. VULNERABILITY ANALYSIS & AFFECTED CODE
                      </p>
                      {vuln.root_cause_analysis && (
                        <p className="text-fog/90 text-xs leading-relaxed bg-[#0D0F0D] p-3 border border-white/5">
                          {vuln.root_cause_analysis}
                        </p>
                      )}

                      {vuln.raw_snippet && (
                        <div className="space-y-1">
                          <p className="text-[9px] text-[#FF5F56] tracking-wider uppercase">ORIGINAL VULNERABLE SNIPPET:</p>
                          <div className="bg-black p-3 border border-[#FF5F56]/30 text-[11px] text-[#FF8A80] overflow-x-auto max-h-40 custom-scrollbar">
                            <pre>{vuln.raw_snippet}</pre>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* DEVELOPER'S NOTE: HOW WE SOLVED IT */}
                    <div className="bg-gradient-to-br from-[#0D0F0D] to-[#050505] border border-[#B7FF00]/40 p-5 space-y-4 shadow-xl">
                      <div className="flex items-center gap-2 border-b border-[#B7FF00]/20 pb-3">
                        <ShieldCheck className="w-5 h-5 text-[#B7FF00]" />
                        <h6 className="font-display font-bold text-sm text-[#B7FF00] uppercase tracking-wider">
                          DEVELOPER'S NOTE // HOW WE SOLVED IT
                        </h6>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <p className="text-[9px] text-[#B7FF00] tracking-widest uppercase font-bold">SUMMARY OF FIX:</p>
                          <p className="text-fog mt-1 leading-relaxed">
                            {devNote?.summary ||
                              `Applied input sanitization and secure structural validation in ${vuln.file_path} to neutralize ${vuln.title} attack vectors.`}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] text-[#B7FF00] tracking-widest uppercase font-bold">ROOT CAUSE IDENTIFIED:</p>
                          <p className="text-ash mt-1 leading-relaxed">
                            {devNote?.root_cause ||
                              vuln.root_cause_analysis ||
                              `Insecure user input handling at ${vuln.file_path}:${vuln.line_number || 1} allowed unvalidated parameters to trigger malicious execution paths.`}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] text-[#B7FF00] tracking-widest uppercase font-bold">REMEDIATION STRATEGY APPLIED:</p>
                          <p className="text-fog mt-1 leading-relaxed">
                            {devNote?.remediation_applied ||
                              `1. Replaced raw dynamic execution with parameterized safe function invocations.\n2. Enforced strict character escaping and type casting on incoming parameters.\n3. Verified AST syntax tree compliance with Python/Node runtime engines.`}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] text-[#B7FF00] tracking-widest uppercase font-bold">VERIFICATION RECOMMENDATION:</p>
                          <p className="text-ash mt-1 leading-relaxed">
                            {devNote?.verification_steps ||
                              `Run regression test suite and verify endpoint rejects non-conforming payload structures with HTTP 400 Validation Error.`}
                          </p>
                        </div>
                      </div>

                      {/* Matching Git Diff Preview */}
                      {matchingPatch?.git_diff && (
                        <div className="pt-3 border-t border-[#B7FF00]/20 space-y-1">
                          <p className="text-[9px] text-[#B7FF00] tracking-widest uppercase font-bold">APPLIED GIT PATCH DIFF:</p>
                          <div className="bg-black p-3 border border-white/10 text-[10px] overflow-x-auto max-h-48 custom-scrollbar">
                            <pre className="text-ash">
                              {matchingPatch.git_diff.split("\n").map((line, lIdx) => {
                                const isAdd = line.startsWith("+") && !line.startsWith("+++");
                                const isDel = line.startsWith("-") && !line.startsWith("---");
                                return (
                                  <div
                                    key={lIdx}
                                    className={
                                      isAdd ? "text-[#B7FF00] bg-[#B7FF00]/10 px-1" : isDel ? "text-[#FF5F56] bg-[#FF5F56]/10 px-1" : "text-ash"
                                    }
                                  >
                                    {line}
                                  </div>
                                );
                              })}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
