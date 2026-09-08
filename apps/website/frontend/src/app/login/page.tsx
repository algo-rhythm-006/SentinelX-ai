"use client";

import AuthFlow from "../../../auth/AuthFlow";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-ink flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-20"></div>
                {/* Subtle radial gradient to focus on center */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,255,0,0.03)_0%,transparent_50%)]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-6">
                <AuthFlow />
            </div>
        </main>
    );
}
