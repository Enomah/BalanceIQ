"use client";

import React, { useState } from "react";
import {
  Plus,
  DollarSign,
  Type,
  FileText,
  Loader2,
  RefreshCcw,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { incomeCategories } from "@/constants/transaction";
import { FormErrors, FormField, FormDataTypes } from "@/types/expenseTypes";
import { useTransactionStore } from "@/store/transactionsStore";
// import { useToastStore } from "@/store/toastStore";
import { Transaction } from "@/types/dashboardTypes";
import { useAppMutation } from "@/hooks/useAppMutation";
import apiClient from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";

interface AddIncomeFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
  initialCategory?: string;
  isEditing?: boolean;
  transaction?: Transaction;
}

const AddIncomeForm: React.FC<AddIncomeFormProps> = ({
  onCancel,
  onSuccess,
  isLoading = false,
  isEditing = false,
  transaction,
  initialCategory,
}) => {
  const { userProfile, patchUserProfile } = useAuthStore();
  const queryClient = useQueryClient();
  // const { showToast } = useToastStore();
  const { patchTransaction } = useTransactionStore();

  const mutation = useAppMutation({
    mutationFn: async (data: Partial<FormDataTypes>) => {
      if (isEditing && transaction) {
        return apiClient.put(
          `/dashboard/transactions/${transaction.id || transaction._id}`,
          data
        );
      }
      return apiClient.post("/dashboard/incomes", data);
    },
    successMessage: isEditing
      ? "Income updated successfully"
      : "Income added successfully",
    onSuccess: (response: {
      data: { income?: Transaction; transaction?: Transaction };
    }) => {
      const data = response.data;
      const incomeOrTx = data.income || data.transaction;
      if (!incomeOrTx) return;
      const newTx: Transaction = {
        ...incomeOrTx,
        type: "income",
        id:
          incomeOrTx.id ||
          incomeOrTx._id ||
          transaction?.id ||
          transaction?._id ||
          "",
        createdAt:
          incomeOrTx.createdAt ||
          transaction?.createdAt ||
          new Date().toISOString(),
        amount: Number(incomeOrTx.amount),
        description: incomeOrTx.description || "",
        category: incomeOrTx.category || "others",
      };

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["recurring"] });

      // Update global balance immediately
      if (isEditing && transaction) {
        const oldAmount = transaction.amount;
        const newAmount = newTx.amount;
        patchUserProfile({
          accountBalance:
            (userProfile?.accountBalance || 0) - oldAmount + newAmount,
        });
        patchTransaction(newTx);
      } else {
        patchUserProfile({
          accountBalance: (userProfile?.accountBalance || 0) + newTx.amount,
        });
      }

      onSuccess?.();
    },
  });

  const [formData, setFormData] = useState<FormDataTypes>({
    amount: isEditing && transaction ? transaction.amount.toString() : "",
    category:
      isEditing && transaction
        ? transaction.category
        : initialCategory || "others",
    description: isEditing && transaction ? transaction.description : "",
    isRecurring: false,
    frequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
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
      options: incomeCategories.map((cat) => ({
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
      placeholder: "What was this income from?",
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
      newErrors.description = "Please briefly describe the income";
    }

    if (formData.isRecurring) {
      if (!formData.frequency) newErrors.frequency = "Choose frequency";
      if (!formData.startDate) newErrors.startDate = "Choose start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = <K extends keyof FormDataTypes>(
    field: K,
    value: FormDataTypes[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    mutation.mutate({
      amount: formData.amount,
      category: formData.category,
      description: formData.description.trim(),
      isRecurring: formData.isRecurring,
      frequency: formData.frequency,
      startDate: formData.startDate,
    });
  };

  const handleToggleRecurring = () => {
    setFormData((prev) => ({ ...prev, isRecurring: !prev.isRecurring }));
  };

  const isFormDisabled = isLoading || mutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-[10px] sm:space-y-6">
      {mutation.error && (
        <div className="p-3 bg-[var(--error-50)] border border-[var(--error-200)] rounded-lg text-[var(--error-700)] text-sm">
          {(mutation.error as { message?: string })?.message ||
            "An error occurred"}
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

      {/* Recurring Transaction Toggle */}
      {!isEditing && (
        <div className="bg-[var(--bg-tertiary)] p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCcw size={18} className="text-[var(--primary-500)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                Make this a recurring income
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleRecurring}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                formData.isRecurring
                  ? "bg-[var(--primary-50)] dark:bg-[var(--primary-900)] text-[var(--primary-500)]"
                  : "bg-[var(--neutral-200)]"
              } bg-opacity-20 dark:bg-opacity-40`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.isRecurring ? "translate-x-4" : ""
                }`}
              />
            </button>
          </div>

          <AnimatePresence>
            {formData.isRecurring && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                <FormSelect
                  id="frequency"
                  label="Frequency"
                  icon={RefreshCcw}
                  value={formData.frequency || "monthly"}
                  onChange={(val) =>
                    handleInputChange(
                      "frequency",
                      val as FormDataTypes["frequency"]
                    )
                  }
                  options={[
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                    { value: "yearly", label: "Yearly" },
                  ]}
                />
                <FormInput
                  id="startDate"
                  label="First Payment"
                  type="date"
                  icon={Calendar}
                  value={formData.startDate || ""}
                  onChange={(val) => handleInputChange("startDate", val)}
                  error={errors.startDate}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

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
          {mutation.isPending ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              {isEditing ? "Saving..." : "Adding..."}
            </>
          ) : (
            <>
              {isEditing ? (
                <FileText size={20} className="mr-2" />
              ) : (
                <Plus size={20} className="mr-2" />
              )}
              {isEditing ? "Save Changes" : "Add Income"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddIncomeForm;
