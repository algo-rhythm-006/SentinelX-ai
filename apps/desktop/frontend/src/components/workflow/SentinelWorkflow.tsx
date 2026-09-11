"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { WorkflowHero } from "./WorkflowHero";
import { SentinelTimeline } from "./SentinelTimeline";
import { SecurityAuditReport, RemediationReport } from "./types";

export const SentinelWorkflow: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState("https://github.com/OWASP/NodeGoat.git");
  const [branch, setBranch] = useState("master");
  const [githubToken, setGithubToken] = useState("");
  const [createPR, setCreatePR] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [isRemediating, setIsRemediating] = useState(false);

  const [progressPct, setProgressPct] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [logs, setLogs] = useState<{ ts: string; msg: string; type?: string }[]>([]);

  const [auditReport, setAuditReport] = useState<SecurityAuditReport | null>(null);
  const [remediationReport, setRemediationReport] = useState<RemediationReport | null>(null);

  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const progressRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const getBackendUrl = () => {
    if (typeof window !== "undefined" && window.location.origin && window.location.origin.startsWith("http")) {
      return window.location.origin;
    }
    return "http://localhost:8000";
  };

  const addLog = (msg: string, type: "info" | "success" | "error" | "warning" = "info") => {
    const ts = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { ts, msg, type }].slice(-50));
  };

  // Automatic Smooth Scroll to Active Stage / Battle Arena / Log Progress
  useEffect(() => {
    if (isScanning && progressRef.current) {
      progressRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isScanning, progressText]);

  useEffect(() => {
    if (activeStageIndex >= 4 && timelineRef.current) {
      const battleEl = document.getElementById("step-05") || document.getElementById("battle-arena-box");
      if (battleEl) {
        battleEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeStageIndex]);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsScanning(true);
    setProgressPct(10);
    setProgressText("Initializing Security Audit...");
    setLogs([]);
    setAuditReport(null);
    setRemediationReport(null);
    setActiveStageIndex(0);

    const backendUrl = getBackendUrl();
    addLog(`Initiating security audit for ${repoUrl} (branch: ${branch})...`, "info");

    try {
      const sseUrl = `${backendUrl}/api/v1/audit/scan/stream?repo_url=${encodeURIComponent(
        repoUrl.trim()
      )}&branch=${encodeURIComponent(branch.trim() || "main")}`;
      const eventSource = new EventSource(sseUrl);

      eventSource.addEventListener("RECON_STARTED", (e: any) => {
        const data = JSON.parse(e.data);
        setProgressPct(25);
        setProgressText(data.message || "Recon phase active...");
        addLog(data.message || "Recon agent started", "info");
        setActiveStageIndex(1);
      });

      eventSource.addEventListener("SCANNERS_RUNNING", (e: any) => {
        const data = JSON.parse(e.data);
        setProgressPct(50);
        setProgressText("Running static scanners (Semgrep, Gitleaks, Trivy)...");
        addLog(data.message || "Static scanners running", "info");
        setActiveStageIndex(3);
      });

      eventSource.addEventListener("HEURISTIC_FALLBACK_ENGAGED", (e: any) => {
        const data = JSON.parse(e.data);
        addLog(data.message || "CLI missing. Defaulting to internal heuristic regex scanner.", "warning");
      });

      eventSource.addEventListener("AI_TRIAGE_ACTIVE", (e: any) => {
        const data = JSON.parse(e.data);
        setProgressPct(75);
        setProgressText("AI Triage evaluating false positives with qwen2.5-coder:7b...");
        addLog(data.message || "AI triage active", "info");
        setActiveStageIndex(4);
      });

      eventSource.addEventListener("REPORT_READY", (e: any) => {
        const payload = JSON.parse(e.data);
        const report: SecurityAuditReport = payload.data;
        eventSource.close();
        setAuditReport(report);
        setProgressPct(100);
        setProgressText("Audit complete!");
        addLog("Security audit report generated successfully.", "success");
        setIsScanning(false);
        setActiveStageIndex(6);
      });

      eventSource.onerror = async () => {
        eventSource.close();
        addLog("SSE Stream disconnected. Executing REST fallback audit...", "warning");
        try {
          const res = await fetch(`${backendUrl}/api/v1/audit/scan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ repo_url: repoUrl, branch }),
          });
          if (!res.ok) {
            throw new Error(`Server returned HTTP ${res.status}`);
          }
          const report: SecurityAuditReport = await res.json();
          setAuditReport(report);
          setProgressPct(100);
          setProgressText("Audit complete!");
          addLog("Audit report retrieved successfully via REST fallback.", "success");
          setActiveStageIndex(6);
        } catch (postErr: any) {
          addLog(`Audit error: ${postErr.message}`, "error");
        } finally {
          setIsScanning(false);
        }
      };
    } catch (err: any) {
      addLog(`Audit error: ${err.message}`, "error");
      setIsScanning(false);
    }
  };

  const handleTriggerBlueTeam = async () => {
    if (!auditReport || !auditReport.verified_vulnerabilities.length) return;

    setIsRemediating(true);
    addLog("Triggering Blue Team Self-Healing Remediation Agent...", "info");
    const backendUrl = getBackendUrl();

    // Auto-scroll to step 08 Self Healing
    const step08El = document.getElementById("step-08");
    if (step08El) {
      step08El.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    try {
      const res = await fetch(`${backendUrl}/api/v1/remediation/patch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_path: auditReport.repo_url,
          auto_apply: true,
          create_git_branch: true,
          branch_name: "sentinelx/security-patches",
          create_pull_request: createPR,
          github_token: githubToken.trim() || null,
          findings: auditReport.verified_vulnerabilities,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const report: RemediationReport = await res.json();
      setRemediationReport(report);
      addLog(`Generated ${report.total_successful} developer patch(es) successfully!`, "success");
      setActiveStageIndex(9);
    } catch (err: any) {
      addLog(`Remediation error: ${err.message}`, "error");
    } finally {
      setIsRemediating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-fog font-sans antialiased selection:bg-[#B7FF00] selection:text-[#050505]">
      {/* Hero Header Section */}
      <WorkflowHero
        repoUrl={repoUrl}
        setRepoUrl={setRepoUrl}
        branch={branch}
        setBranch={setBranch}
        githubToken={githubToken}
        setGithubToken={setGithubToken}
        createPR={createPR}
        setCreatePR={setCreatePR}
        isScanning={isScanning}
        isRemediating={isRemediating}
        onStartAudit={handleStartAudit}
      />

      {/* Progress Telemetry Banner with Auto Scroll Anchor */}
      {(isScanning || isRemediating || logs.length > 0) && (
        <section ref={progressRef} className="bg-[#050505] border-b border-white/10 py-6 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1400px] mx-auto bg-[#0D0F0D] border border-white/12 p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#B7FF00] font-bold tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B7FF00] animate-pulse" />
                {progressText || "SYSTEM AUDIT STREAM ACTIVE"}
              </span>
              <span className="text-ash tracking-widest">{progressPct}%</span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-[#050505] h-2 border border-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-[#B7FF00] via-cyan-400 to-[#FF5F56] h-full"
              />
            </div>

            {/* Live Stream Terminal Logs */}
            <div className="bg-[#050505] border border-white/10 p-3 h-28 overflow-y-auto font-mono text-xs space-y-1.5 custom-scrollbar">
              {logs.map((l, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-ash/40 text-[10px]">[{l.ts}]</span>
                  <span
                    className={
                      l.type === "error"
                        ? "text-[#FF5F56] font-semibold"
                        : l.type === "success"
                        ? "text-[#B7FF00] font-semibold"
                        : l.type === "warning"
                        ? "text-[#FFB020] font-semibold"
                        : "text-fog"
                    }
                  >
                    {l.type === "warning" && "⚠️ "}
                    {l.msg}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Main 10-Step Cyber-Defense Timeline */}
      <div ref={timelineRef}>
        <SentinelTimeline
          auditReport={auditReport}
          remediationReport={remediationReport}
          isScanning={isScanning}
          isRemediating={isRemediating}
          activeStageIndex={activeStageIndex}
          onTriggerBlueTeam={handleTriggerBlueTeam}
        />
      </div>
    </div>
  );
};
