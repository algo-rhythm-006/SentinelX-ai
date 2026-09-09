"use client";

import { Download, Monitor, Command, Terminal, Sparkles, AlertCircle } from "lucide-react";

interface DownloadSectionProps {
  id?: string;
}

export default function DownloadSection({ id = "download" }: DownloadSectionProps) {
  const downloadConfig = {
    windows: process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL || "",
    macos: process.env.NEXT_PUBLIC_MACOS_DOWNLOAD_URL || "",
    linux: process.env.NEXT_PUBLIC_LINUX_DOWNLOAD_URL || "",
  };

  const platforms = [
    {
      id: "windows",
      name: "Windows",
      icon: Monitor,
      subtitle: "Windows 10 / 11 (64-bit)",
      url: downloadConfig.windows,
      note: "Installer (.msi / .exe)",
    },
    {
      id: "macos",
      name: "macOS",
      icon: Command,
      subtitle: "macOS 12+ (Apple Silicon & Intel)",
      url: downloadConfig.macos,
      note: "Universal Binary (.dmg)",
    },
    {
      id: "linux",
      name: "Linux",
      icon: Terminal,
      subtitle: "Ubuntu, Debian, Fedora, Arch",
      url: downloadConfig.linux,
      note: "Package (.deb / .AppImage)",
    },
  ];

  return (
    <section id={id} className="w-full scroll-mt-24">
      {/* Primary Download Focus Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0D0F0D] to-[#050505] border border-white/12 p-8 sm:p-12 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B7FF00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7FF00]/10 border border-[#B7FF00]/20 text-[#B7FF00] font-mono text-xs uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Local Security Workspace</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            Download Sentinel-X Desktop
          </h2>
          
          <p className="mt-4 text-sm sm:text-base text-[#9CA3AF] max-w-xl mx-auto leading-relaxed">
            Run Sentinel-X locally and keep your development environment and source code under your control.
          </p>

          {/* OS Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-10 text-left">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const hasUrl = Boolean(platform.url && platform.url.trim().length > 0);

              return (
                <div
                  key={platform.id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-[#050505]/80 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F5F5F0] group-hover:border-[#B7FF00]/40 group-hover:text-[#B7FF00] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[10px] uppercase text-[#8B8F88] tracking-wider">
                        {platform.note}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-[#F5F5F0]">
                      {platform.name}
                    </h3>
                    <p className="font-mono text-xs text-[#9CA3AF] mt-1 mb-6">
                      {platform.subtitle}
                    </p>
                  </div>

                  <div>
                    {hasUrl ? (
                      <a
                        href={platform.url}
                        download
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#B7FF00] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl hover:bg-[#cfff4d] transition-all shadow-md cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </a>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-white/[0.03] border border-white/10 py-3 px-4 rounded-xl font-mono text-xs text-[#8B8F88]">
                        <span className="flex items-center gap-1.5 text-xs text-[#8B8F88]">
                          <AlertCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          Coming soon
                        </span>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10">
                          Build in progress
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-xs font-mono text-[#8B8F88]">
            Need automated deployment scripts or enterprise distribution options? Check out our setup documentation below.
          </p>
        </div>
      </div>
    </section>
  );
}
