"use client";

import React, { useState } from "react";
import {
  Target,
  Calendar,
  DollarSign,
  Type,
  FileText,
  Loader2,
  Sparkles,
  TrendingUp,
  Focus,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/api/rootUrls";
import { goalCategories } from "@/constants/goal";
import { FormErrors, FormField } from "@/types/goalTypes";
import FormSelect from "@/components/dashboard/FormSelect";
import FormInput from "@/components/dashboard/FormInput";
import { useDashboardStore } from "@/store/dashboardStore";
import { useGoalStore } from "@/store/goalsStore";

interface AddGoalFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

interface FormData {
  title: string;
  targetAmount: string;
  targetDate: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onCancel, onSuccess }) => {
  const { userProfile, accessToken } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { dashboardData, addGoal } = useDashboardStore();
  const { addGoal: generalAddGoal, setStats, stats } = useGoalStore();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    targetAmount: "",
    targetDate: "",
    description: "",
    category: "savings",
    priority: "medium",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const priorities = [
    { value: "low", label: "Low Priority", icon: null },
    { value: "medium", label: "Medium Priority", icon: null },
    { value: "high", label: "High Priority", icon: null },
  ];

  const formFields: FormField[] = [
    {
      id: "title",
      label: "Goal Title",
      type: "text",
      icon: Type,
      placeholder: "e.g., Emergency Fund, Vacation to Hawaii",
      required: true,
      value: formData.title,
      error: errors.title,
      maxLength: 50,
    },
    {
      id: "targetAmount",
      label: "Target Amount",
      type: "number",
      icon: DollarSign,
      placeholder: "0.00",
      required: true,
      min: 0.01,
      step: "0.01",
      currencySymbol: userProfile?.currency,
      value: formData.targetAmount,
      error: errors.targetAmount,
      max: 1000000000,
    },
    {
      id: "category",
      label: "Category",
      type: "select",
      icon: Target,
      options: goalCategories.map((cat) => ({
        value: cat.value,
        label: cat.label,
        // icon: cat.icon,
      })),
      required: true,
      value: formData.category,
      error: errors.category,
    },
    {
      id: "priority",
      label: "Priority",
      type: "select",
      icon: Focus,
      options: priorities,
      required: true,
      value: formData.priority,
      error: errors.priority,
    },
    {
      id: "targetDate",
      label: "Target Date (Optional)",
      type: "date",
      icon: Calendar,
      placeholder: "",
      value: formData.targetDate,
      error: errors.targetDate,
      min: new Date().toISOString().split("T")[0],
      max: new Date(new Date().getFullYear() + 10, 11, 31)
        .toISOString()
        .split("T")[0],
    },
    {
      id: "description",
      label: "Description (Optional)",
      type: "textarea",
      icon: FileText,
      placeholder: "Describe your goal... Why is this important to you?",
      rows: 3,
      value: formData.description,
      error: errors.description,
      maxLength: 500,
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Goal title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.trim().length > 50) {
      newErrors.title = "Title must be less than 50 characters";
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Please enter a valid target amount";
    } else if (parseFloat(formData.targetAmount) > 1000000000) {
      newErrors.targetAmount = "Amount seems too large. Please verify.";
    }

    if (formData.targetDate) {
      const selectedDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.targetDate = "Target date must be in the future";
      } else if (
        selectedDate >
        new Date(today.getFullYear() + 10, today.getMonth(), today.getDate())
      ) {
        newErrors.targetDate =
          "Target date cannot be more than 10 years in the future";
      }
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.priority) {
      newErrors.priority = "Please select a priority";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const calculateMonthlySavings = () => {
    if (!formData.targetAmount || !formData.targetDate) return null;
    const targetAmount = parseFloat(formData.targetAmount);
    const targetDate = new Date(formData.targetDate);
    const today = new Date();
    const monthsDiff =
      (targetDate.getFullYear() - today.getFullYear()) * 12 +
      (targetDate.getMonth() - today.getMonth());
    if (monthsDiff <= 0) return null;
    return targetAmount / monthsDiff;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const goalData = {
        title: formData.title.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        targetDate: formData.targetDate
          ? new Date(formData.targetDate).toISOString()
          : undefined,
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
      };

      const response = await fetch(`${baseUrl}/dashboard/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(goalData),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      setShowSuccess(true);
      setShowSuccess(false);
      onSuccess?.();

      generalAddGoal(data.goal);

      const updatedStats = {
        totalGoals: (stats.totalGoals += 1),
        totalActive: (stats.totalActive += 1),
        totalTarget: (stats.totalTarget += data.goal.targetAmount),
        totalSaved: stats.totalSaved,
      };

      setStats(updatedStats);

      if (dashboardData) {
        // console.log(data.goal)
        addGoal(data.goal);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create goal. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const monthlySavings = calculateMonthlySavings();
  const isFormDisabled = isSubmitting;

  if (showSuccess) {
    return (
      <div className="text-center py-8">
        <div className="animate-bounce mb-4">
          <Sparkles size={48} className="text-[var(--success-600)] mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-[var(--success-600)] mb-2">
          Goal Created Successfully! 🎉
        </h3>
        <p className="text-[var(--text-secondary)]">
          Your financial goal has been set up successfully.
        </p>
        <div className="mt-4 p-3 bg-[var(--success-50)] rounded-lg">
          <p className="text-sm text-[var(--success-700)]">
            💡 <strong>Tip:</strong> Start funding your goal regularly to stay
            on track!
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-[10px] sm:space-y-6 max-h-[70vh] overflow-y-auto pr-2"
    >
      {submitError && (
        <div className="p-3 bg-[var(--error-50)] border border-[var(--error-200)] rounded-lg text-[var(--error-700)] text-sm">
          {submitError}
        </div>
      )}

      {monthlySavings && (
        <div className="p-4 bg-[var(--primary-50)] rounded-lg border border-[var(--primary-200)]">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp size={16} className="text-[var(--primary-600)]" />
            <span className="text-sm font-medium text-[var(--primary-700)]">
              Savings Plan
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            To reach your goal, save{" "}
            <strong>
              {userProfile?.currency}
              {monthlySavings.toFixed(2)}
            </strong>{" "}
            per month
          </p>
        </div>
      )}

      {formFields.map((field) => (
        <div key={field.id} className="">
          {field.type === "select" ? (
            <FormSelect
              id={field.id}
              label={field.label}
              icon={field.icon}
              value={field.value}
              onChange={(value) =>
                handleInputChange(field.id as keyof FormData, value)
              }
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
              onChange={(value) =>
                handleInputChange(field.id as keyof FormData, value)
              }
              error={field.error}
              required={field.required}
              min={field.min}
              step={field.step}
              currencySymbol={field.currencySymbol}
              rows={field.rows}
              maxLength={field.maxLength}
              max={field.max}
            />
          )}
          {field.id === "title" && (
            <div className="text-right text-xs text-[var(--text-tertiary)] mt-1">
              {formData.title.length}/50 characters
            </div>
          )}
          {field.id === "description" && (
            <div className="text-right text-xs text-[var(--text-tertiary)] mt-1">
              {formData.description.length}/500 characters
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-col sm:flex-row gap-3 pt-4 sticky bottom-0 bg-[var(--bg-secondary)] pb-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 border border-[var(--border-light)] rounded-lg font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] disabled:opacity-50"
          disabled={isFormDisabled}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 px-6 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2 flex items-center justify-center disabled:opacity-50"
          disabled={isFormDisabled}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Creating...
            </>
          ) : (
            <>
              <Target size={20} className="mr-2" />
              Create Goal
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddGoalForm;
