import os
import json
import time
import shutil
import tempfile
import asyncio
import logging
import urllib.request
from typing import AsyncGenerator, Any

from schemas.security_audit import VulnerabilityFinding, SecurityAuditReport
from services.scanners import run_semgrep, run_gitleaks, run_trivy

logger = logging.getLogger(__name__)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen2.5-coder:7b"

async def run_recon(target_dir: str) -> dict[str, Any]:
    """
    Inspects project manifests to determine tech stack and metadata.
    """
    tech_stack: dict[str, Any] = {
        "languages": [],
        "frameworks": [],
        "manifests_found": []
    }

    manifest_map = {
        "package.json": ("JavaScript/Node.js", "npm"),
        "requirements.txt": ("Python", "pip"),
        "pom.xml": ("Java", "Maven"),
        "go.mod": ("Go", "Go Modules"),
        "Dockerfile": ("Docker", "Container")
    }

    for filename, (lang, fw) in manifest_map.items():
        if os.path.exists(os.path.join(target_dir, filename)):
            tech_stack["manifests_found"].append(filename)
            if lang not in tech_stack["languages"]:
                tech_stack["languages"].append(lang)
            if fw not in tech_stack["frameworks"]:
                tech_stack["frameworks"].append(fw)

    return tech_stack

async def call_ollama_triage(prompt: str) -> str:
    """
    Helper function to invoke local Ollama API asynchronously.
    """
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }

    def _sync_post():
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            OLLAMA_API_URL,
            data=data,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=60) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            return res_json.get("response", "")

    try:
        return await asyncio.to_thread(_sync_post)
    except Exception as e:
        logger.error(f"Error communicating with Ollama: {e}")
        return "[]"

async def run_triage(findings: list[dict[str, Any]], target_dir: str) -> list[VulnerabilityFinding]:
    """
    Uses qwen2.5-coder:7b via local Ollama to evaluate candidate scanner alerts
    and filter out false positives.
    """
    if not findings:
        return []

    system_instruction = (
        "You are an expert DevSecOps code reviewer. Evaluate the static scanner alerts and the surrounding code snippet. "
        "Filter out false positives (e.g., test mocks, safely sanitized inputs). For true positives, explain the root cause "
        "of the vulnerability and output a strict JSON array matching the VulnerabilityFinding schema."
    )

    findings_prompt_str = json.dumps(findings[:20], indent=2)
    full_prompt = f"{system_instruction}\n\nCandidate Findings:\n{findings_prompt_str}\n\nRespond strictly with JSON array."

    raw_llm_response = await call_ollama_triage(full_prompt)

    verified: list[VulnerabilityFinding] = []
    try:
        start_idx = raw_llm_response.find("[")
        end_idx = raw_llm_response.rfind("]")
        if start_idx != -1 and end_idx != -1:
            json_str = raw_llm_response[start_idx:end_idx + 1]
            parsed_list = json.loads(json_str)
            for item in parsed_list:
                if isinstance(item, dict):
                    verified.append(VulnerabilityFinding(**item))
    except Exception as e:
        logger.error(f"Failed to parse LLM triage output: {e}")

    return verified

async def execute_audit_pipeline(repo_url: str, branch: str) -> AsyncGenerator[dict[str, Any], None]:
    """
    Orchestrates cloning, recon, multi-tool scanning, and AI triage while streaming progress updates.
    """
    start_time = time.time()
    temp_dir = tempfile.mkdtemp(prefix="sentinelx_audit_")

    try:
        yield {"event": "RECON_STARTED", "message": f"Cloning repository {repo_url} (branch: {branch})..."}

        clone_proc = await asyncio.create_subprocess_exec(
            "git", "clone", "--depth", "1", "--branch", branch, repo_url, temp_dir,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await clone_proc.communicate()

        tech_stack = await run_recon(temp_dir)

        yield {"event": "SCANNERS_RUNNING", "message": "Executing static code & dependency analysis tools..."}

        semgrep_results, gitleaks_results, trivy_results = await asyncio.gather(
            run_semgrep(temp_dir),
            run_gitleaks(temp_dir),
            run_trivy(temp_dir)
        )

        all_findings = []
        for s in semgrep_results:
            all_findings.append({"scanner_source": "semgrep", "data": s})
        for g in gitleaks_results:
            all_findings.append({"scanner_source": "gitleaks", "data": g})
        for t in trivy_results:
            all_findings.append({"scanner_source": "trivy", "data": t})

        total_raw = len(all_findings)

        yield {"event": "AI_TRIAGE_ACTIVE", "message": f"Running AI Triage on {total_raw} raw finding(s)..."}

        verified_findings = await run_triage(all_findings, temp_dir)

        scan_duration = round(time.time() - start_time, 2)

        report = SecurityAuditReport(
            repo_url=repo_url,
            tech_stack=tech_stack,
            total_raw_findings=total_raw,
            verified_vulnerabilities=verified_findings,
            scan_duration_sec=scan_duration
        )

        yield {"event": "REPORT_READY", "data": report.model_dump()}

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
