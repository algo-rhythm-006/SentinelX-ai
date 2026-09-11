"use client";

import React, { useState } from "react";
import {
  Upload,
  Search,
  Box,
  Radar,
  Swords,
  Shield,
  Target,
  Code,
  CheckSquare,
  FileBarChart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { TimelineStep, SecurityAuditReport, RemediationReport } from "./types";
import { BattleArena } from "./BattleArena";
import { SelfHealingStage } from "./SelfHealingStage";
import { PatchValidationStage } from "./PatchValidationStage";
import { SecurityReportStage } from "./SecurityReportStage";
import { ContinuousMonitoringLoop } from "./ContinuousMonitoringLoop";

const STEPS_DATA: TimelineStep[] = [
  {
    number: "01",
    id: "step-01",
    title: "INPUT",
    subtitle: "Target Surface Ingestion",
    description: "Feed SentinelX with the target application codebase, public GitHub repository, website URL, or Docker image.",
    capabilities: ["Git / GitHub Repo Parsing", "Web Application URL Ingestion", "Container / Docker Image Unpacking"],
    iconName: "Upload",
    category: "INGESTION",
  },
  {
    number: "02",
    id: "step-02",
    title: "ANALYZE & DISCOVER",
    subtitle: "Architecture & Stack Mapping",
    description: "Build a complete technical map of the target application structure, active frameworks, dependencies, and entrypoints.",
    capabilities: ["Tech Stack Detection", "Framework & Library Discovery", "Dependency Tree Mapping", "Application Structure Profiling"],
    iconName: "Search",
    category: "RECONNAISSANCE",
  },
  {
    number: "03",
    id: "step-03",
    title: "CREATE DIGITAL TWIN",
    subtitle: "Isolated Sandbox Environment",
    description: "Reproduce the application inside an isolated, ephemeral sandbox environment for safe non-production vulnerability verification.",
    capabilities: ["Isolated Docker Runtime", "Secure Environment Replica", "Safe Exploit Execution", "Controlled Attack Sandbox"],
    iconName: "Box",
    category: "CONTAINMENT",
  },
  {
    number: "04",
    id: "step-04",
    title: "MULTI-AGENT SCANNING",
    subtitle: "Parallel Threat Surface Analysis",
    description: "Deploy specialized static and dynamic scanning agents across code, dependencies, hardcoded secrets, and API endpoints.",
    capabilities: ["Static Code Analysis (Semgrep)", "Secret Detection (Gitleaks)", "Dependency Scan (Trivy)", "API Attack Surface Mapping"],
    iconName: "Radar",
    category: "SCANNING",
  },
  {
    number: "05",
    id: "step-05",
    title: "AI RED TEAM ATTACK & BLUE TEAM DEFENSE",
    subtitle: "Adversarial Autonomous Simulation",
    description: "Autonomous AI Red Team agents attempt to exploit potential vulnerabilities while Blue Team defenders detect and intercept attacks in real-time.",
    capabilities: ["Penetration Testing", "Attack Interception", "API & Logic Fuzzing", "Automated Mitigation"],
    iconName: "Swords",
    category: "ADVERSARIAL BATTLE",
  },
  {
    number: "06",
    id: "step-06",
    title: "THREAT MITIGATION & INTERCEPTION",
    subtitle: "Defensive Countermeasures",
    description: "Blue Team agents actively deploy countermeasures, blocking exploitable attack vectors and updating firewall rules.",
    capabilities: ["Behavioral Anomaly Analysis", "Payload Neutralization", "Automated Shielding"],
    iconName: "Shield",
    category: "DEFENSE",
  },
  {
    number: "07",
    id: "step-07",
    title: "EXPLOIT VERIFICATION",
    subtitle: "False Positive Elimination",
    description: "Replay exploits in the isolated twin to prove whether vulnerabilities are truly exploitable and eliminate non-actionable noise.",
    capabilities: ["Exploit Replay Engine", "Dynamic Proof-of-Concept", "Confidence Scoring", "False Positive Filtering"],
    iconName: "Target",
    category: "VERIFICATION",
  },
  {
    number: "08",
    id: "step-08",
    title: "SELF-HEALING ENGINE",
    subtitle: "Automated Code Remediation",
    description: "AI self-healing agents generate precise, minimal code patches and unified diffs for all verified vulnerabilities.",
    capabilities: ["AST-Aware Code Fixes", "LLM Patch Synthesis", "Deterministic Regex Fallback", "Unified Git Diff Generation"],
    iconName: "Code",
    category: "REMEDIATION",
  },
  {
    number: "09",
    id: "step-09",
    title: "PATCH VALIDATION",
    subtitle: "Regression & Syntax Verification",
    description: "Execute Node.js syntax checks, Python AST parsing, build validation, and regression tests to guarantee patches don't break code.",
    capabilities: ["Node --check Syntax Verification", "Python ast.parse Validation", "Regression Test Execution", "Build Integrity Check"],
    iconName: "CheckSquare",
    category: "VALIDATION",
  },
  {
    number: "10",
    id: "step-10",
    title: "REPORTS & INTEGRATION",
    subtitle: "Actionable Intelligence & PR Dispatch",
    description: "Generate comprehensive security intelligence reports, update risk scores, create automated GitHub Pull Requests, and sync CI/CD.",
    capabilities: ["Detailed Security Report", "Risk Prioritization Matrix", "Automated GitHub PR Creation", "DevSecOps CI/CD Integration"],
    iconName: "FileBarChart",
    category: "INTEGRATION",
  },
];

interface SentinelTimelineProps {
  auditReport: SecurityAuditReport | null;
  remediationReport: RemediationReport | null;
  isScanning: boolean;
  isRemediating: boolean;
  activeStageIndex: number;
  onTriggerBlueTeam: () => void;
}

export const SentinelTimeline: React.FC<SentinelTimelineProps> = ({
  auditReport,
  remediationReport,
  isScanning,
  isRemediating,
  activeStageIndex,
  onTriggerBlueTeam,
}) => {
  const [expandedStep, setExpandedStep] = useState<string | null>("step-05");

  const renderIcon = (name: string) => {
    switch (name) {
      case "Upload": return <Upload className="w-4 h-4" />;
      case "Search": return <Search className="w-4 h-4" />;
      case "Box": return <Box className="w-4 h-4" />;
      case "Radar": return <Radar className="w-4 h-4" />;
      case "Swords": return <Swords className="w-4 h-4 text-[#FF5F56]" />;
      case "Shield": return <Shield className="w-4 h-4 text-[#B7FF00]" />;
      case "Target": return <Target className="w-4 h-4" />;
      case "Code": return <Code className="w-4 h-4" />;
      case "CheckSquare": return <CheckSquare className="w-4 h-4" />;
      case "FileBarChart": return <FileBarChart className="w-4 h-4" />;
      default: return <Radar className="w-4 h-4" />;
    }
  };

  return (
    <section className="bg-[#050505] py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Section Title */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#B7FF00] tracking-[0.25em] uppercase bg-[#B7FF00]/5 px-3 py-1 border border-[#B7FF00]/20">
            <span>WORKFLOW PIPELINE</span>
            <span>·</span>
            <span>10 SEQUENTIAL PHASES</span>
          </div>

          <h2 className="font-display font-bold uppercase text-3xl sm:text-5xl md:text-6xl text-fog tracking-tight">
            AUTONOMOUS CYBER <span className="text-[#B7FF00]">WORKFLOW ENGINE</span>
          </h2>
          <p className="font-mono text-xs text-ash tracking-widest uppercase max-w-2xl">
            FROM CODE INGESTION TO RED/BLUE BATTLE, EXPLOIT VERIFICATION, SELF-HEALING, AND CONTINUOUS MONITORING.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l border-[#B7FF00]/30 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          
          {/* Animated Spine Line Pulse */}
          <div className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-gradient-to-b from-[#B7FF00] via-cyan-400 to-[#FF5F56] opacity-70 pointer-events-none" />

          {STEPS_DATA.map((step, idx) => {
            const isActive = idx <= activeStageIndex || isScanning;
            const isCompleted = auditReport !== null && idx < 5;
            const isExpanded = expandedStep === step.id || (idx === 4 && auditReport !== null);

            return (
              <div key={step.id} id={step.id} className="relative group space-y-4">
                
                {/* Node Bullet / Circle */}
                <div
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className={`absolute -left-[31px] sm:-left-[47px] top-0 w-10 h-10 rounded-none bg-[#0D0F0D] border cursor-pointer transition-all duration-300 flex items-center justify-center font-mono text-xs font-bold ${
                    isActive
                      ? "border-[#B7FF00] text-[#B7FF00] shadow-[0_0_20px_rgba(183,255,0,0.3)] bg-[#050505]"
                      : "border-white/20 text-ash hover:border-white/40"
                  }`}
                >
                  <span>{step.number}</span>
                </div>

                {/* Main Step Header Card */}
                <div
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className={`bg-[#0D0F0D] border p-6 cursor-pointer transition-all ${
                    isExpanded ? "border-[#B7FF00]/60 bg-[#0D0F0D]" : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#050505] border border-white/10 text-[#B7FF00]">
                        {renderIcon(step.iconName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] tracking-[0.2em] text-[#B7FF00] uppercase">
                            PHASE {step.number} // {step.category}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-xl sm:text-2xl text-fog uppercase tracking-tight">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider border ${
                          isCompleted
                            ? "bg-[#B7FF00]/10 text-[#B7FF00] border-[#B7FF00]/30"
                            : isActive
                            ? "bg-cyan-950/40 text-cyan-400 border-cyan-800/60 animate-pulse"
                            : "bg-[#050505] text-ash border-white/10"
                        }`}
                      >
                        {isCompleted ? "COMPLETED" : isActive ? "ACTIVE SCANNING" : "STANDBY"}
                      </span>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-ash" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-ash" />
                      )}
                    </div>
                  </div>

                  <p className="font-sans text-sm text-ash mt-3 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Capabilities List */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                    {step.capabilities.map((cap, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-1 bg-[#050505] border border-white/10 font-mono text-[10px] text-fog tracking-wider uppercase"
                      >
                        + {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* SINGLE UNIFIED BATTLE ARENA (Rendered ONCE at Step 05 with smaller compact Blue Team trigger button) */}
                {step.number === "05" && (
                  <div className="pt-2">
                    <BattleArena
                      auditReport={auditReport}
                      remediationReport={remediationReport}
                      isScanning={isScanning}
                      isRemediating={isRemediating}
                      onTriggerBlueTeam={onTriggerBlueTeam}
                    />
                  </div>
                )}

                {/* Step 08: SELF HEALING */}
                {step.number === "08" && (
                  <div className="pt-4">
                    <SelfHealingStage
                      remediationReport={remediationReport}
                      isRemediating={isRemediating}
                      onTriggerBlueTeam={onTriggerBlueTeam}
                      hasVerifiedVulns={(auditReport?.verified_vulnerabilities.length ?? 0) > 0}
                    />
                  </div>
                )}

                {/* Step 09: PATCH VALIDATION */}
                {step.number === "09" && (
                  <div className="pt-4">
                    <PatchValidationStage
                      remediationReport={remediationReport}
                      isRemediating={isRemediating}
                    />
                  </div>
                )}

                {/* Step 10: REPORTS & INTEGRATION */}
                {step.number === "10" && (
                  <div className="pt-4">
                    <SecurityReportStage
                      auditReport={auditReport}
                      remediationReport={remediationReport}
                    />
                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* Continuous Monitoring Loop Section */}
        <ContinuousMonitoringLoop />

      </div>
    </section>
  );
};
