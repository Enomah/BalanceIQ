"use client";

import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center animate-pulse">
            <FileQuestion size={48} className="text-[var(--text-secondary)]" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            Page Not Found
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-dark)] transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <Home size={20} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
