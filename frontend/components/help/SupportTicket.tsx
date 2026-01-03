"use client";

import React, { useState } from "react";
import { Send, Loader2, Tag, MessageSquare } from "lucide-react";
import FormInput from "../dashboard/FormInput";
import FormSelect from "../dashboard/FormSelect";
import { useToastStore } from "@/store/toastStore";

import { useAppMutation } from "@/hooks/useAppMutation";
import apiClient from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";

interface SupportTicketProps {
  onSuccess?: () => void;
}

export default function SupportTicket({ onSuccess }: SupportTicketProps) {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    subject: "",
    category: "general",
    message: "",
  });

  const mutation = useAppMutation({
    mutationFn: (data: typeof formData) => apiClient.post("/support", data),
    successMessage: "Ticket submitted!",
    onSuccess: () => {
      setFormData({ subject: "", category: "general", message: "" });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      if (onSuccess) onSuccess();
    },
  });

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Issue" },
    { value: "billing", label: "Billing/Subscription" },
    { value: "feature", label: "Feature Request" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-light)] shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="subject"
          label="Subject"
          icon={MessageSquare}
          placeholder="What can we help you with?"
          value={formData.subject}
          onChange={(v) => setFormData((prev) => ({ ...prev, subject: v }))}
          required
        />

        <FormSelect
          id="category"
          label="Category"
          icon={Tag}
          value={formData.category}
          options={categories}
          onChange={(v) => setFormData((prev) => ({ ...prev, category: v }))}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Message
          </label>
          <textarea
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent text-[var(--text-primary)] min-h-[150px] resize-none"
            placeholder="Please describe your issue in detail..."
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3 px-6 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Send size={20} />
              Submit Ticket
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
        <p className="text-xs text-[var(--text-tertiary)] text-center">
          Our support team typically responds within 24-48 hours. For urgent
          security issues, please visit our Security Center.
        </p>
      </div>
    </div>
  );
}
