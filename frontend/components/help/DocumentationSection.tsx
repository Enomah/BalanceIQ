"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { DocArticle } from "@/lib/help/docsData";

interface DocumentationSectionProps {
  articles: DocArticle[];
  onArticleClick: (article: DocArticle) => void;
}

export default function DocumentationSection({
  articles,
  onArticleClick,
}: DocumentationSectionProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl border border-dashed border-[var(--border-light)]">
        <p className="text-[var(--text-secondary)]">
          No matching articles found. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] shadow-sm hover:shadow-md transition-all group cursor-pointer"
            onClick={() => onArticleClick(article)}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[var(--primary-50)] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[var(--primary-500)] transition-colors">
                <article.icon
                  className="text-[var(--primary-500)] group-hover:text-white transition-colors"
                  size={24}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--primary-500)] transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-light)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded border border-[var(--border-light)]">
                {article.category}
              </span>
              <button className="flex items-center gap-2 text-sm font-medium text-[var(--primary-500)] hover:gap-3 transition-all">
                Read Guide
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
