"use client";

import React from "react";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { DocArticle } from "@/lib/help/docsData";

interface DocArticleViewerProps {
  article: DocArticle;
  onBack: () => void;
}

export default function DocArticleViewer({
  article,
  onBack,
}: DocArticleViewerProps) {
  // Simple markdown parser for bold, headers, and lists
  const parseContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Headers
      if (line.startsWith("## ")) {
        return (
          <h2
            key={i}
            className="text-2xl font-bold text-[var(--text-primary)] mt-10 mb-6 pb-2 border-b border-[var(--border-light)]"
          >
            {line.replace("## ", "")}
          </h2>
        );
      }

      // Ordered Lists
      if (line.match(/^\d+\.\s/)) {
        const parts = line.split(". ");
        const num = parts[0];
        const text = parts.slice(1).join(". ");
        return (
          <div key={i} className="flex gap-4 items-start pl-2 my-4">
            <span className="w-6 h-6 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {num}
            </span>
            <p className="text-[var(--text-secondary)] flex-1">
              {renderBold(text)}
            </p>
          </div>
        );
      }

      // Empty Lines
      if (line.trim() === "") return <div key={i} className="h-4" />;

      // Normal Paragraphs
      return (
        <p
          key={i}
          className="text-[var(--text-secondary)] leading-relaxed mb-4"
        >
          {renderBold(line)}
        </p>
      );
    });
  };

  // Helper to render bold text: **text** -> <strong>text</strong>
  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-[var(--text-primary)]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 border-b border-[var(--border-light)]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[var(--primary-500)] hover:gap-3 transition-all mb-6 text-sm font-medium group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Help Center
        </button>

        <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)] mb-4">
          <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded-full border border-[var(--border-light)] flex items-center gap-1 font-medium">
            <Tag size={12} />
            {article.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />5 min read
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          {article.title}
        </h1>
        <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-2xl">
          {article.summary}
        </p>
      </div>

      <div className="p-8 pb-12">
        <div className="max-w-none">{parseContent(article.content)}</div>
      </div>
    </div>
  );
}
