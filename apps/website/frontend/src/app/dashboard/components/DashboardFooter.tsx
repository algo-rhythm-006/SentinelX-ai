"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export default function DashboardFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#050505] text-[#F5F5F0] py-8 px-6 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#B7FF00]/10 border border-[#B7FF00]/20 flex items-center justify-center text-[#B7FF00]">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[#F5F5F0]">
              Sentinel-X
            </span>
            <p className="font-mono text-[11px] text-[#8B8F88]">
              AI-powered security engineering.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[#9CA3AF]">
          <Link href="/docs/setup" className="hover:text-[#F5F5F0] transition-colors">
            Setup Guide
          </Link>
          <Link href="/" className="hover:text-[#F5F5F0] transition-colors">
            Home
          </Link>
          <a href="#" className="hover:text-[#F5F5F0] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#F5F5F0] transition-colors">
            Terms of Service
          </a>
        </div>

        <div className="font-mono text-[11px] text-[#8B8F88]">
          © {new Date().getFullYear()} Sentinel-X Security. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
