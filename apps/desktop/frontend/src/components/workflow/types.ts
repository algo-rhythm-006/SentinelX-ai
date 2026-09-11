export interface VulnerabilityFinding {
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  cwe_id?: string;
  file_path: string;
  line_number?: number;
  scanner_source: string;
  root_cause_analysis?: string;
  raw_snippet?: string;
}

export interface SecurityAuditReport {
  repo_url: string;
  branch: string;
  total_raw_findings: number;
  verified_vulnerabilities: VulnerabilityFinding[];
  scan_duration_sec: number;
}

export interface DeveloperNote {
  summary?: string;
  root_cause?: string;
  remediation_applied?: string;
  verification_steps?: string;
}

export interface PatchItem {
  file_path: string;
  syntax_valid: boolean;
  developer_note: DeveloperNote;
  git_diff: string;
}

export interface RemediationReport {
  total_successful: number;
  patches: PatchItem[];
  pull_request_url?: string;
}

export interface TimelineStep {
  number: string;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  iconName: string;
  category: string;
}

export interface SecurityLogEvent {
  id: string;
  ts: string;
  side: "red" | "blue";
  text: string;
  type?: string;
}
