import os
import ast
import json
import time
import shutil
import difflib
import asyncio
import logging
import urllib.request
from typing import AsyncGenerator, Any, Optional

from schemas.security_audit import VulnerabilityFinding
from schemas.remediation import PatchItem, RemediationReport

logger = logging.getLogger(__name__)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen2.5-coder:7b"

async def call_ollama_remediation(prompt: str) -> str:
    """
    Helper function to invoke local Ollama API asynchronously for Blue Team patch generation.
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
        with urllib.request.urlopen(req, timeout=90) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            return res_json.get("response", "")

    try:
        return await asyncio.to_thread(_sync_post)
    except Exception as e:
        logger.error(f"Error calling Ollama for remediation: {e}")
        return ""

async def generate_code_patch(finding: VulnerabilityFinding, repo_path: Optional[str] = None) -> dict[str, Any]:
    """
    Reads affected code context and uses qwen2.5-coder:7b to generate a secure replacement patch.
    """
    code_context = finding.raw_snippet
    full_file_path = None

    if repo_path and finding.file_path:
        full_file_path = os.path.join(repo_path, finding.file_path)
        if os.path.isfile(full_file_path):
            try:
                with open(full_file_path, "r", encoding="utf-8", errors="ignore") as f:
                    code_context = f.read()
            except Exception as e:
                logger.warning(f"Could not read full file {full_file_path}: {e}")

    system_prompt = (
        "You are an expert secure software engineer and Blue Team remediation specialist.\n"
        "Your job is to fix the security vulnerability identified in the provided code without breaking business logic or external APIs.\n"
        "Rules:\n"
        "1. Output ONLY the replacement code block for the affected function or snippet.\n"
        "2. Provide clear developer notes breaking down:\n"
        "   - Root Cause\n"
        "   - Solution Applied\n"
        "   - Verification / Testing Recommendation\n"
        "3. Format your response in strict JSON conforming to:\n"
        "{\n"
        '  "patched_code": "<clean replacement code>",\n'
        '  "developer_note": {\n'
        '    "summary": "...",\n'
        '    "root_cause": "...",\n'
        '    "remediation_applied": "...",\n'
        '    "verification_steps": "..."\n'
        "  }\n"
        "}"
    )

    prompt = (
        f"{system_prompt}\n\n"
        f"Vulnerability Title: {finding.title}\n"
        f"CWE ID: {finding.cwe_id or 'N/A'}\n"
        f"File Path: {finding.file_path}\n"
        f"Line Number: {finding.line_number or 'N/A'}\n"
        f"Root Cause Analysis: {finding.root_cause_analysis}\n\n"
        f"Code Context / Snippet:\n{code_context}\n\n"
        "Respond strictly with the valid JSON object described above."
    )

    raw_response = await call_ollama_remediation(prompt)

    try:
        start_idx = raw_response.find("{")
        end_idx = raw_response.rfind("}")
        if start_idx != -1 and end_idx != -1:
            json_str = raw_response[start_idx:end_idx + 1]
            data = json.loads(json_str)
            return {
                "original_code": code_context,
                "patched_code": data.get("patched_code", code_context),
                "developer_note": data.get("developer_note", {
                    "summary": f"Remediation patch for {finding.title}",
                    "root_cause": finding.root_cause_analysis,
                    "remediation_applied": "Applied secure coding fix to resolve flagged flaw.",
                    "verification_steps": "Run unit tests and re-scan file."
                })
            }
    except Exception as e:
        logger.error(f"Failed to parse remediation patch JSON response: {e}")

    return {
        "original_code": code_context,
        "patched_code": code_context,
        "developer_note": {
            "summary": f"Automated patch generation unverified for {finding.title}",
            "root_cause": finding.root_cause_analysis,
            "remediation_applied": "None - automated patch parsing fallback triggered.",
            "verification_steps": "Manual review required."
        }
    }

def validate_syntax(file_path: str, code_content: str) -> tuple[bool, Optional[str]]:
    """
    Validates code syntax based on file extension.
    """
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".py":
        try:
            ast.parse(code_content)
            return True, None
        except SyntaxError as se:
            return False, f"Python SyntaxError: {se}"
    elif ext in [".js", ".ts", ".jsx", ".tsx", ".json"]:
        open_braces = code_content.count("{") - code_content.count("}")
        open_parens = code_content.count("(") - code_content.count(")")
        open_brackets = code_content.count("[") - code_content.count("]")
        if open_braces != 0 or open_parens != 0 or open_brackets != 0:
            return False, f"Unbalanced syntax delimiters (braces: {open_braces}, parens: {open_parens}, brackets: {open_brackets})"
    return True, None

def validate_and_build_diff(file_path: str, original_code: str, patched_code: str) -> tuple[str, bool]:
    """
    Generates unified git diff and checks syntax validity.
    """
    orig_lines = original_code.splitlines(keepends=True)
    patch_lines = patched_code.splitlines(keepends=True)
    diff_lines = list(difflib.unified_diff(
        orig_lines,
        patch_lines,
        fromfile=f"a/{file_path}",
        tofile=f"b/{file_path}"
    ))
    git_diff = "".join(diff_lines) if diff_lines else "No changes detected."
    valid, _ = validate_syntax(file_path, patched_code)
    return git_diff, valid

async def git_commit_patch(repo_path: str, branch_name: str, file_path: str, commit_msg: str):
    """
    Creates git branch if needed, stages updated file, and creates commit.
    """
    git_dir = os.path.join(repo_path, ".git")
    if not os.path.exists(git_dir):
        return

    try:
        # Create or checkout branch
        checkout_proc = await asyncio.create_subprocess_exec(
            "git", "checkout", "-b", branch_name,
            cwd=repo_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await checkout_proc.communicate()
        if checkout_proc.returncode != 0:
            # Branch might already exist, switch to it
            sw_proc = await asyncio.create_subprocess_exec(
                "git", "checkout", branch_name,
                cwd=repo_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await sw_proc.communicate()

        # Add file
        add_proc = await asyncio.create_subprocess_exec(
            "git", "add", file_path,
            cwd=repo_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await add_proc.communicate()

        # Commit
        commit_proc = await asyncio.create_subprocess_exec(
            "git", "commit", "-m", commit_msg,
            cwd=repo_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await commit_proc.communicate()
    except Exception as e:
        logger.warning(f"Git branch/commit operation warning: {e}")

async def execute_remediation_pipeline(
    findings: list[VulnerabilityFinding],
    repo_path: str,
    auto_apply: bool = True,
    create_git_branch: bool = True,
    branch_name: Optional[str] = "sentinelx/security-patches"
) -> AsyncGenerator[dict[str, Any], None]:
    """
    Sequentially processes vulnerability findings to generate patches, write files to disk,
    and commit changes to a Git branch while emitting SSE events.
    """
    start_time = time.time()
    patches: list[PatchItem] = []
    total_successful = 0

    for finding in findings:
        target_file_full = os.path.join(repo_path, finding.file_path) if repo_path else finding.file_path
        backup_file_path = None
        original_content = finding.raw_snippet

        if os.path.exists(target_file_full):
            backup_file_path = target_file_full + ".bak"
            try:
                shutil.copy2(target_file_full, backup_file_path)
                with open(target_file_full, "r", encoding="utf-8", errors="ignore") as f:
                    original_content = f.read()
                yield {
                    "event": "FILE_BACKUP_CREATED",
                    "finding_id": finding.id,
                    "file_path": finding.file_path,
                    "backup_path": backup_file_path
                }
            except Exception as e:
                logger.warning(f"Failed to create backup for {target_file_full}: {e}")

        yield {
            "event": "ANALYZING_AND_PATCHING",
            "finding_id": finding.id,
            "file_path": finding.file_path,
            "title": finding.title
        }

        patch_res = await generate_code_patch(finding, repo_path)
        patched_code = patch_res["patched_code"]
        dev_note = patch_res["developer_note"]

        # Replace code in file content
        updated_file_content = original_content
        if finding.raw_snippet in original_content:
            updated_file_content = original_content.replace(finding.raw_snippet, patched_code, 1)
        elif finding.raw_snippet.replace("\r\n", "\n") in original_content.replace("\r\n", "\n"):
            norm_orig = original_content.replace("\r\n", "\n")
            norm_snip = finding.raw_snippet.replace("\r\n", "\n")
            updated_file_content = norm_orig.replace(norm_snip, patched_code, 1)
        else:
            # Fallback replacement
            updated_file_content = patched_code

        # Validate syntax
        syntax_valid, error_details = validate_syntax(finding.file_path, updated_file_content)

        yield {
            "event": "SYNTAX_VERIFIED",
            "finding_id": finding.id,
            "file_path": finding.file_path,
            "syntax_valid": syntax_valid,
            "error_details": error_details
        }

        applied_to_disk = False
        if syntax_valid and auto_apply and os.path.exists(target_file_full):
            try:
                with open(target_file_full, "w", encoding="utf-8") as f:
                    f.write(updated_file_content)
                applied_to_disk = True
                total_successful += 1

                yield {
                    "event": "FILE_WRITTEN_TO_DISK",
                    "finding_id": finding.id,
                    "file_path": finding.file_path
                }

                if create_git_branch and branch_name:
                    commit_msg = f"fix(security): remediate {finding.title} via SentinelX Blue Team"
                    await git_commit_patch(repo_path, branch_name, finding.file_path, commit_msg)
                    yield {
                        "event": "GIT_COMMITTED",
                        "finding_id": finding.id,
                        "file_path": finding.file_path,
                        "branch_name": branch_name
                    }

            except Exception as e:
                applied_to_disk = False
                error_details = f"Failed writing to disk: {e}"
                # Restore backup
                if backup_file_path and os.path.exists(backup_file_path):
                    shutil.copy2(backup_file_path, target_file_full)
        elif not syntax_valid and backup_file_path and os.path.exists(backup_file_path):
            # Restore backup if syntax invalid
            shutil.copy2(backup_file_path, target_file_full)

        # Generate diff
        orig_lines = original_content.splitlines(keepends=True)
        patch_lines = updated_file_content.splitlines(keepends=True)
        diff_lines = list(difflib.unified_diff(
            orig_lines,
            patch_lines,
            fromfile=f"a/{finding.file_path}",
            tofile=f"b/{finding.file_path}"
        ))
        git_diff = "".join(diff_lines) if diff_lines else "No changes detected."

        patch_item = PatchItem(
            finding_id=finding.id,
            file_path=finding.file_path,
            cwe_id=finding.cwe_id,
            original_snippet=finding.raw_snippet,
            patched_snippet=patched_code,
            git_diff=git_diff,
            developer_note=dev_note,
            syntax_valid=syntax_valid,
            applied_to_disk=applied_to_disk,
            backup_file_path=backup_file_path,
            error_details=error_details
        )
        patches.append(patch_item)

        yield {
            "event": "REMEDIATION_COMPLETE",
            "finding_id": finding.id,
            "file_path": finding.file_path,
            "applied_to_disk": applied_to_disk,
            "syntax_valid": syntax_valid
        }

    duration = round(time.time() - start_time, 2)
    report = RemediationReport(
        total_attempted=len(findings),
        total_successful=total_successful,
        patches=patches,
        remediation_duration_sec=duration
    )

    yield {
        "event": "REMEDIATION_REPORT_READY",
        "data": report.model_dump()
    }
