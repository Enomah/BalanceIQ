"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How do I create a new budget?",
    answer:
      "Go to the Budgeting page from the sidebar, click on 'Create Monthly Budget', enter your total limit and allocate it across categories like Food, Transport, etc.",
  },
  {
    question: "How do I track my progress towards a goal?",
    answer:
      "On the Financial Goals page, each goal card shows a progress bar. You can update your saved amount by editing the goal or through relevant transactions.",
  },
  {
    question: "Can I change my currency settings?",
    answer:
      "Yes, go to Settings > Preferences to change your primary currency. Please note this only changes the display symbol and doesn't convert historical data.",
  },
  {
    question: "How can I export my data?",
    answer:
      "Data export functionality (CSV/PDF) is currently in our roadmap and will be available in a future update.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "We use industry-standard encryption and secure authentication to ensure your data stays private and protected at all times.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <span className="font-medium text-[var(--text-primary)]">
              {faq.question}
            </span>
            {openIndex === index ? (
              <ChevronUp className="text-[var(--text-tertiary)]" size={20} />
            ) : (
              <ChevronDown className="text-[var(--text-tertiary)]" size={20} />
            )}
          </button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-6 pb-4 text-[var(--text-secondary)] text-sm leading-relaxed border-t border-[var(--border-light)] pt-4">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
