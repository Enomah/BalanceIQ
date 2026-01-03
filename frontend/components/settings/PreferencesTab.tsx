"use client";

import { useAuthStore } from "@/store/authStore";
import { useAppMutation } from "@/hooks/useAppMutation";
import apiClient from "@/lib/api/client";
import { useState } from "react";
import FormInput from "../dashboard/FormInput";
import FormSelect from "../dashboard/FormSelect";
import { currencies, incomeSources } from "@/constants/user";
import { Settings, AlertCircle, Globe, Wallet, DollarSign } from "lucide-react";
import { useEffect } from "react";

export default function PreferencesTab() {
  const { userProfile, patchUserProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    currency: userProfile?.currency || "USD",
    incomeSource: userProfile?.incomeSource || "Salary",
    monthlyIncome: userProfile?.monthlyIncome?.toString() || "0",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        currency: userProfile.currency || "USD",
        incomeSource: userProfile.incomeSource || "Salary",
        monthlyIncome: userProfile.monthlyIncome?.toString() || "0",
      });
    }
  }, [userProfile]);

  const mutation = useAppMutation({
    mutationFn: (data: unknown) => apiClient.put("/user/settings", data),
    successMessage: "Settings updated successfully",
    onSuccess: (response) => {
      patchUserProfile(response.data.user);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
    });
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--primary-100)] text-[var(--primary-600)] rounded-lg">
          <Settings size={20} />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Financial Preferences
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormSelect
            id="currency"
            label="Primary Currency"
            icon={Globe}
            value={formData.currency}
            onChange={(val) => setFormData({ ...formData, currency: val })}
            options={currencies.map((c) => ({
              value: c.value,
              label: `${c.flag} ${c.label}`,
            }))}
          />

          <div className="p-4 bg-[var(--warning-50)] dark:bg-[var(--warning-900)]/20 border border-[var(--warning-200)] dark:border-[var(--warning-800)] rounded-xl flex gap-3">
            <AlertCircle
              className="text-[var(--warning-600)] shrink-0"
              size={20}
            />
            <p className="text-sm text-[var(--warning-700)] dark:text-[var(--warning-400)]">
              <b>Note:</b> Changing your primary currency will update the symbol
              for all past and future transactions. It does not perform currency
              conversion on your historical data.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormSelect
            id="incomeSource"
            label="Primary Income Source"
            icon={Wallet}
            value={formData.incomeSource}
            onChange={(val) => setFormData({ ...formData, incomeSource: val })}
            options={incomeSources.map((s) => ({
              value: s.value,
              label: s.label,
            }))}
          />
          <FormInput
            id="monthlyIncome"
            label="Estimated Monthly Income"
            type="number"
            icon={DollarSign}
            value={formData.monthlyIncome}
            onChange={(val) => setFormData({ ...formData, monthlyIncome: val })}
            currencySymbol={
              currencies.find((c) => c.value === formData.currency)?.symbol
            }
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full sm:w-auto px-6 py-2.5 bg-[var(--primary-500)] text-white rounded-xl font-medium hover:bg-[var(--primary-600)] transition-all focus:ring-4 focus:ring-[var(--primary-500)]/20 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
