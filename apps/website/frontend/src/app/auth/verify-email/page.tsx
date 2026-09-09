"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { KeyRound, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("Verification code sent to your email.");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyEmail(email, otp);
      setMessage("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login?verified=true");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setError("");
    setMessage("");
    setResending(true);

    try {
      await authApi.resendOtp(email);
      setMessage("A new 6-digit verification code has been sent to your email.");
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#B7FF00]/10 border border-[#B7FF00]/20 flex items-center justify-center mb-3">
          <KeyRound className="w-6 h-6 text-[#B7FF00]" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Verify Your Email</h1>
        <p className="text-xs text-[#9CA3AF] mt-2 max-w-xs">
          Enter the 6-digit verification code sent to{" "}
          <span className="text-[#F5F5F0] font-mono">{email || "your email"}</span>.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-lg bg-[#B7FF00]/10 border border-[#B7FF00]/20 text-[#B7FF00] text-xs font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        {!searchParams.get("email") && (
          <div>
            <label className="block text-xs font-mono text-[#9CA3AF] uppercase mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F5F5F0] placeholder-[#6B7280] focus:border-[#B7FF00] focus:outline-none transition-colors"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-mono text-[#9CA3AF] uppercase mb-1.5">6-Digit Verification Code</label>
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-[#B7FF00] placeholder-[#6B7280] focus:border-[#B7FF00] focus:outline-none transition-colors"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="mt-2 w-full bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#cfff4d] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Verifying..." : <>Verify Email <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5 text-xs text-[#9CA3AF]">
        <span>Didn't receive code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="text-[#B7FF00] hover:underline font-mono flex items-center gap-1 disabled:opacity-50 disabled:no-underline cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
          {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-[#9CA3AF]">
        Back to{" "}
        <Link href="/auth/login" className="text-[#F5F5F0] hover:underline font-mono">
          Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F0] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,255,0,0.04)_0%,transparent_60%)] pointer-events-none" />
      <Suspense fallback={<div className="text-ash font-mono">Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}
