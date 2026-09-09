import asyncio
import json
import logging
from typing import Any

logger = logging.getLogger(__name__)

async def run_semgrep(target_dir: str) -> list[dict[str, Any]]:
    """
    Executes semgrep scan --json --quiet asynchronously on target_dir.
    """
    try:
        proc = await asyncio.create_subprocess_exec(
            "semgrep", "scan", "--json", "--quiet", target_dir,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=target_dir
        )
        stdout, stderr = await proc.communicate()
        if stdout:
            data = json.loads(stdout.decode("utf-8", errors="ignore"))
            return data.get("results", []) if isinstance(data, dict) else []
    except Exception as e:
        logger.warning(f"Semgrep scanner execution error: {e}")
    return []

async def run_gitleaks(target_dir: str) -> list[dict[str, Any]]:
    """
    Executes gitleaks detect --source=. --report-format=json --no-git asynchronously on target_dir.
    """
    try:
        proc = await asyncio.create_subprocess_exec(
            "gitleaks", "detect", "--source=.", "--report-format=json", "--no-git",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=target_dir
        )
        stdout, stderr = await proc.communicate()
        if stdout:
            data = json.loads(stdout.decode("utf-8", errors="ignore"))
            return data if isinstance(data, list) else []
    except Exception as e:
        logger.warning(f"Gitleaks scanner execution error: {e}")
    return []

async def run_trivy(target_dir: str) -> list[dict[str, Any]]:
    """
    Executes trivy fs --format json . asynchronously on target_dir.
    """
    try:
        proc = await asyncio.create_subprocess_exec(
            "trivy", "fs", "--format", "json", ".",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=target_dir
        )
        stdout, stderr = await proc.communicate()
        if stdout:
            data = json.loads(stdout.decode("utf-8", errors="ignore"))
            results = []
            if isinstance(data, dict) and "Results" in data:
                for target_res in data["Results"]:
                    vulnerabilities = target_res.get("Vulnerabilities", [])
                    results.extend(vulnerabilities)
            return results
    except Exception as e:
        logger.warning(f"Trivy scanner execution error: {e}")
    return []
