"use client";

import React, { useState } from "react";
import {
  Plus,
  Calendar,
  DollarSign,
  Type,
  FileText,
  Loader2,
} from "lucide-react";
import { expenseCategories } from "@/constants/transaction";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/api/rootUrls";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { FormErrors, FormField, FormDataTypes } from "@/types/expenseTypes";
import { useDashboardStore } from "@/store/dashboardStore";
import { MonthlySummary, Transaction } from "@/types/dashboardTypes";

interface AddExpenseFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  onCancel,
  onSuccess,
  isLoading = false,
}) => {
  const { userProfile, accessToken } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const { updateMonthlySummary, dashboardData, addRecentTransaction } =
    useDashboardStore();

  const [formData, setFormData] = useState<FormDataTypes>({
    amount: "",
    category: "others",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const formFields: FormField[] = [
    {
      id: "amount",
      label: "Amount",
      type: "number",
      icon: DollarSign,
      placeholder: "0.00",
      required: true,
      min: 0,
      step: "0.01",
      currencySymbol: userProfile?.currency,
      value: formData.amount,
      error: errors.amount,
    },
    {
      id: "category",
      label: "Category",
      type: "select",
      icon: Type,
      options: expenseCategories.map((cat) => ({
        value: cat.key,
        label: cat.label,
        icon: cat.icon,
      })),
      required: true,
      value: formData.category,
      error: errors.category,
    },
    {
      id: "description",
      label: "Description",
      type: "textarea",
      icon: FileText,
      placeholder: "What was this expense for?",
      rows: 3,
      value: formData.description,
      error: errors.description,
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.description) {
      newErrors.description = "Please briefly describe the expense";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormDataTypes, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/dashboard/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description.trim(),
        }),
      });

      const data = await response.json();

      // console.log(data);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      if (dashboardData) {
        onSuccess?.();
        const expense = data.expense;
        const transaction: Transaction = {
          ...expense,
          type: "expense",
          id: expense.id || crypto.randomUUID(),
          createdAt: expense.createdAt || new Date().toISOString(),
          amount: parseFloat(expense.amount),
          description: expense.description,
          category: expense.category,
        };

        const newMonthlySummary: MonthlySummary = {
          ...dashboardData?.monthlySummary,
          expenses: (dashboardData.monthlySummary.expenses +=
            transaction.amount),
          balance: (dashboardData.monthlySummary.balance -= transaction.amount),
          expenseCategoryTotals: {
            ...dashboardData.monthlySummary.expenseCategoryTotals,
            [transaction.category]: (dashboardData.monthlySummary.expenseCategoryTotals[transaction.category] || 0) + transaction.amount,
          },
        };

        addRecentTransaction(transaction);
        updateMonthlySummary(newMonthlySummary);
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to add expense. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-[10px] sm:space-y-6">
      {submitError && (
        <div className="p-3 bg-[var(--error-50)] border border-[var(--error-200)] rounded-lg text-[var(--error-700)] text-sm">
          {submitError}
        </div>
      )}

      {formFields.map((field) => (
        <div key={field.id}>
          {field.type === "select" ? (
            <FormSelect
              id={field.id}
              label={field.label}
              icon={field.icon}
              value={field.value}
              onChange={(value) => handleInputChange(field.id, value)}
              error={field.error}
              required={field.required}
              options={field.options || []}
            />
          ) : (
            <FormInput
              id={field.id}
              label={field.label}
              icon={field.icon}
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(value) => handleInputChange(field.id, value)}
              error={field.error}
              required={field.required}
              min={field.min}
              step={field.step}
              currencySymbol={field.currencySymbol}
              rows={field.rows}
            />
          )}
        </div>
      ))}

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 border border-[var(--border-light)] rounded-lg font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isFormDisabled}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex-1 py-3 px-6 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isFormDisabled}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Adding...
            </>
          ) : (
            <>
              <Plus size={20} className="mr-2" />
              Add Expense
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
