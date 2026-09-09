"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, User, LogOut, ChevronDown, CheckCircle2 } from "lucide-react";
import { authApi } from "@/lib/api";

interface DashboardHeaderProps {
  user: {
    email: string;
    name?: string;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const displayName = user.name || user.email.split("@")[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/auth/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-xl border-b border-white/10 w-full px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#B7FF00]/10 border border-[#B7FF00]/20 flex items-center justify-center group-hover:border-[#B7FF00]/40 transition-colors">
            <Shield className="w-4 h-4 text-[#B7FF00]" />
          </div>
          <span className="font-display font-bold tracking-tight text-sm text-[#F5F5F0]">
            SENTINEL<span className="text-[#B7FF00]">-</span>X
          </span>
          <span className="hidden sm:inline-block font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-[#B7FF00]/10 border border-[#B7FF00]/20 text-[#B7FF00]">
            Workspace
          </span>
        </Link>

        {/* Right: User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-[#F5F5F0] cursor-pointer"
            aria-expanded={dropdownOpen}
            aria-label="User profile menu"
          >
            <div className="w-6 h-6 rounded-full bg-[#B7FF00]/20 border border-[#B7FF00]/30 flex items-center justify-center text-[#B7FF00]">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono text-[#F5F5F0] max-w-[140px] truncate">
              {displayName}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0D0F0D] border border-white/10 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <p className="text-xs font-mono font-semibold text-[#F5F5F0] truncate">{displayName}</p>
                <p className="text-[11px] font-mono text-[#9CA3AF] truncate mt-0.5">{user.email}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-[#B7FF00]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Authenticated Session</span>
                </div>
              </div>

              <div className="p-1.5 space-y-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowProfileModal(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono text-[#F5F5F0] hover:bg-white/5 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span>Profile Info</span>
                </button>

                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0F0D] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#B7FF00]" />
                <h3 className="font-display text-lg font-bold text-[#F5F5F0]">User Profile</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-[#9CA3AF] hover:text-[#F5F5F0] text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-[#9CA3AF] uppercase text-[10px] tracking-wider block mb-1">Name</label>
                <div className="p-3 bg-[#050505] border border-white/10 rounded-xl text-[#F5F5F0]">
                  {displayName}
                </div>
              </div>

              <div>
                <label className="text-[#9CA3AF] uppercase text-[10px] tracking-wider block mb-1">Email Address</label>
                <div className="p-3 bg-[#050505] border border-white/10 rounded-xl text-[#F5F5F0]">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="text-[#9CA3AF] uppercase text-[10px] tracking-wider block mb-1">Account Status</label>
                <div className="p-3 bg-[#050505] border border-[#B7FF00]/20 rounded-xl text-[#B7FF00] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified & Active</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase rounded-xl hover:bg-[#cfff4d] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
