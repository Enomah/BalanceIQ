"use client";

import React, { useState, useMemo } from "react";
import Sidebar from "../sidebar/Sidebar";
import WelcomeSection from "../dashboard/WelcomeSection";
import { useAuthStore } from "@/store/authStore";
import { useRequireAuth } from "@/lib/useRequireAuth";
import HelpHeader from "./HelpHeader";
import FAQSection from "./FAQSection";
import SupportTicket from "./SupportTicket";
import DocumentationSection from "./DocumentationSection";
import DocArticleViewer from "./DocArticleViewer";
import TicketHistory from "./TicketHistory";
import AdminSupportDashboard from "./AdminSupportDashboard";
import { articles, DocArticle } from "@/lib/help/docsData";
import { useTickets } from "@/hooks/useTickets";
import {
  HelpCircle,
  MessageSquare,
  BookOpen,
  AlertCircle,
  Clock,
  Plus,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

type HelpTab = "docs" | "faqs" | "support";

export default function HelpPage() {
  const { userProfile } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<DocArticle | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<HelpTab>("docs");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const { data: ticketData } = useTickets();
  const hasTickets = ticketData?.pages[0]?.totalTickets
    ? ticketData.pages[0].totalTickets > 0
    : false;

  // Allow switching to admin mode if user is admin OR in development mode
  const canAccessAdmin =
    userProfile?.role === "admin" || process.env.NODE_ENV === "development";

  useRequireAuth();

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;
    const lower = searchTerm.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        a.summary.toLowerCase().includes(lower) ||
        a.category.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  const handleArticleClick = (article: DocArticle) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs = [
    { id: "docs", label: "Documentation", icon: BookOpen },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "support", label: "Support", icon: MessageSquare },
  ] as const;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      <Sidebar currentPath="/dashboard/help" userProfile={userProfile} />

      <div className="flex-1 sm:overflow-y-auto">
        <div className="mx-auto">
          <div className="sticky z-[100] top-0 left-0">
            <WelcomeSection userProfile={userProfile} />
          </div>

          <div className="max-w-4xl mx-auto px-[10px] sm:px-6 py-8">
            {selectedArticle ? (
              <DocArticleViewer
                article={selectedArticle}
                onBack={() => setSelectedArticle(null)}
              />
            ) : (
              <>
                <HelpHeader searchTerm={searchTerm} onSearch={setSearchTerm} />

                {/* Tabs Navigation */}
                {!searchTerm && (
                  <div className="flex p-1 bg-[var(--bg-tertiary)] rounded-xl mb-12 border border-[var(--border-light)] overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsCreatingTicket(false);
                        }}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all min-w-[140px] flex-1 ${
                          activeTab === tab.id
                            ? "bg-[var(--bg-secondary)] text-[var(--primary-500)] shadow-sm border border-[var(--border-light)]"
                            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                        }`}
                      >
                        <tab.icon size={18} />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {searchTerm ? (
                    <div className="mb-16">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                          <BookOpen
                            className="text-[var(--primary-500)]"
                            size={24}
                          />
                          Search Results
                        </h2>
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-sm text-[var(--primary-500)] hover:underline font-medium"
                        >
                          Clear Search
                        </button>
                      </div>

                      {filteredArticles.length > 0 ? (
                        <DocumentationSection
                          articles={filteredArticles}
                          onArticleClick={handleArticleClick}
                        />
                      ) : (
                        <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-2xl border-2 border-dashed border-[var(--border-light)]">
                          <AlertCircle
                            size={48}
                            className="mx-auto mb-4 text-[var(--text-tertiary)] opacity-30"
                          />
                          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                            No results for &quot;{searchTerm}&quot;
                          </h3>
                          <p className="text-[var(--text-secondary)] mb-6">
                            We couldn&apos;t find any articles matching your
                            search. Try different keywords.
                          </p>
                          <button
                            onClick={() => setSearchTerm("")}
                            className="px-6 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] transition-all font-medium"
                          >
                            Browse All Documentation
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {activeTab === "docs" && (
                        <div className="space-y-6">
                          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2 mb-2">
                            <BookOpen
                              className="text-[var(--primary-500)]"
                              size={20}
                            />
                            Knowledge Base
                          </h2>
                          <DocumentationSection
                            articles={articles}
                            onArticleClick={handleArticleClick}
                          />
                        </div>
                      )}

                      {activeTab === "faqs" && (
                        <div className="space-y-6">
                          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2 mb-2">
                            <HelpCircle
                              className="text-[var(--primary-500)]"
                              size={20}
                            />
                            Frequently Asked Questions
                          </h2>
                          <FAQSection />
                        </div>
                      )}

                      {activeTab === "support" && (
                        <div className="space-y-8">
                          {/* Admin Mode Toggle */}
                          {canAccessAdmin && (
                            <div className="flex items-center justify-end px-2">
                              <button
                                onClick={() => setIsAdminMode(!isAdminMode)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                                  isAdminMode
                                    ? "bg-[var(--primary-500)] text-white border-[var(--primary-400)] shadow-md"
                                    : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border-[var(--border-light)]"
                                }`}
                              >
                                {isAdminMode ? (
                                  <ToggleRight size={14} />
                                ) : (
                                  <ToggleLeft size={14} />
                                )}
                                {canAccessAdmin && isAdminMode
                                  ? "Admin Dashboard Active"
                                  : "Switch to Admin View"}
                              </button>
                            </div>
                          )}

                          {isAdminMode ? (
                            <AdminSupportDashboard />
                          ) : (
                            <>
                              {!hasTickets || isCreatingTicket ? (
                                <div className="max-w-2xl mx-auto space-y-6">
                                  <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                                      <MessageSquare
                                        className="text-[var(--primary-500)]"
                                        size={20}
                                      />
                                      Submit a New Ticket
                                    </h2>
                                    {hasTickets && (
                                      <button
                                        onClick={() =>
                                          setIsCreatingTicket(false)
                                        }
                                        className="text-xs font-semibold flex items-center gap-1.5 text-[var(--text-tertiary)] hover:text-[var(--primary-500)] transition-colors"
                                      >
                                        <ArrowLeft size={14} /> Back to History
                                      </button>
                                    )}
                                  </div>
                                  <SupportTicket
                                    onSuccess={() => setIsCreatingTicket(false)}
                                  />
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                                      <Clock
                                        className="text-[var(--primary-500)]"
                                        size={20}
                                      />
                                      Support Ticket History
                                    </h2>
                                    <button
                                      onClick={() => setIsCreatingTicket(true)}
                                      className="px-4 py-2 bg-[var(--primary-500)] text-white text-xs font-bold rounded-lg hover:bg-[var(--primary-600)] transition-all flex items-center gap-2 shadow-sm"
                                    >
                                      <Plus size={14} /> Create New Ticket
                                    </button>
                                  </div>
                                  <TicketHistory />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
