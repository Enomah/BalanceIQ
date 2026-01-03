"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "../sidebar/Sidebar";
import WelcomeSection from "../dashboard/WelcomeSection";
import { useAuthStore } from "@/store/authStore";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { Shield, Lock, Eye, Key, FileDown } from "lucide-react";

export default function PrivacyPage() {
  const { userProfile } = useAuthStore();

  useRequireAuth();

  const sections = [
    {
      icon: Lock,
      title: "Data Encryption",
      description:
        "Your data is encrypted both in transit and at rest using industry-standard protocols (AES-256).",
    },
    {
      icon: Eye,
      title: "Privacy First",
      description:
        "We never sell your data to third parties. Your financial information is yours alone.",
    },
    {
      icon: Key,
      title: "Secure Authentication",
      description:
        "We use secure session management and hashing for all passwords.",
    },
  ];

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar currentPath="/dashboard/privacy" userProfile={userProfile} />

      <div className="flex-1 sm:overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

          <div className="max-w-4xl mx-auto px-[10px] sm:px-6 py-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-[var(--primary-50)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-[var(--primary-600)]" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                Privacy & Security
              </h1>
              <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
                We take your security seriously. Learn more about how we protect
                your financial data and privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {sections.map((section, i) => (
                <div
                  key={i}
                  className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm"
                >
                  <section.icon
                    className="text-[var(--primary-500)] mb-4"
                    size={24}
                  />
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[var(--bg-secondary)] p-8 rounded-xl border border-[var(--border-light)] shadow-sm">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Shield className="text-[var(--success-500)]" size={20} />
                  Account Integrity
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-[var(--border-light)]">
                    <span className="text-sm text-[var(--text-secondary)]">
                      Member Since
                    </span>
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {userProfile
                        ? new Date(userProfile.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[var(--border-light)]">
                    <span className="text-sm text-[var(--text-secondary)]">
                      Verification Status
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        userProfile?.isVerified
                          ? "bg-[var(--success-50)] text-[var(--success-600)]"
                          : "bg-[var(--warning-50)] text-[var(--warning-600)]"
                      }`}
                    >
                      {userProfile?.isVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[var(--border-light)]">
                    <span className="text-sm text-[var(--text-secondary)]">
                      Encryption Protocol
                    </span>
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      AES-256
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] p-8 rounded-xl border border-[var(--border-light)] shadow-sm flex flex-col justify-center">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  Secure Export
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  Download your data in a secure, encrypted format. We recommend
                  storing it on a secure physical drive.
                </p>
                <Link
                  href="/dashboard/export"
                  className="w-full py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg font-medium hover:bg-[var(--neutral-200)] dark:hover:bg-[var(--neutral-600)] transition-all flex items-center justify-center gap-2 border border-[var(--border-light)] shadow-sm"
                >
                  <FileDown size={18} className="text-[var(--primary-500)]" />
                  Generate Data Export
                </Link>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none bg-[var(--bg-secondary)] p-8 rounded-xl border border-[var(--border-light)] shadow-sm">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                Security Policy
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                BalanceIQ uses a multi-layered security approach to protect your
                information. Our platform is built on modern security
                principles, ensuring that your account remains accessible only
                to you.
              </p>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Password Standards
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                We enforce strong password requirements and use bcrypt for
                secure hashing. We recommend using a unique password for
                BalanceIQ.
              </p>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Data Integrity
              </h3>
              <p className="text-[var(--text-secondary)]">
                Regular backups are performed automatically to ensure that your
                financial history is always preserved and retrievable in case of
                system failures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
