"use client";

import Link from "next/link";
import { HelpCircle, ArrowRight, BookOpen } from "lucide-react";

export default function HelpSection() {
  return (
    <section className="w-full">
      <div className="rounded-2xl bg-gradient-to-r from-[#0D0F0D] via-[#050505] to-[#0D0F0D] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#B7FF00]/10 border border-[#B7FF00]/20 flex items-center justify-center text-[#B7FF00] shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-[#F5F5F0]">
              Need Help?
            </h2>
            <p className="mt-1 text-sm text-[#9CA3AF]">
              Follow the setup guide to get Sentinel-X running on your system.
            </p>
          </div>
        </div>

        <Link
          href="/docs/setup"
          className="inline-flex items-center gap-2 bg-[#121212] border border-white/10 hover:border-[#B7FF00]/40 hover:bg-white/5 text-[#F5F5F0] font-mono text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all hover:text-[#B7FF00] cursor-pointer whitespace-nowrap"
        >
          <BookOpen className="w-4 h-4" />
          <span>View Setup Guide</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
