"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { requireAuth } from "@/lib/requireAuth";
import BasicProfileStep from "./BasicProfileStep";
import FinancialBasicsStep from "./FinancialBasicsStep";
import FinancialGoalsStep from "./FinancialGoalsStep";
import SpendingHabitsStep from "./SpendingHabitsStep";
import CompletionStep from "./CompletionStep";
import ProgressHeader from "./ProgressHeader";
import NavigationFooter from "./NavigationFooter";
import { useAuthStore } from "@/store/authStore";
import { baseUrl } from "@/api/rootUrls";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const { accessToken } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OnboardingFormData>({
    avatar: null,
    currency: "USD",
    monthlyIncome: "",
    incomeSource: "Salary",
    primaryGoal: "emergency fund",
    targetAmount: "",
    targetDate: "",
    spendingCategories: ["food", "transport"],
    budgetingStyle: "flexible",
  });
  requireAuth();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      spendingCategories: prev.spendingCategories.includes(category)
        ? prev.spendingCategories.filter((c) => c !== category)
        : [...prev.spendingCategories, category],
    }));
  };

  const handleSubmit = useCallback(async () => {
    const formDataToSend = new FormData();

    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }
    formDataToSend.append("currency", formData.currency);
    formDataToSend.append("monthlyIncome", formData.monthlyIncome);
    formDataToSend.append("incomeSource", formData.incomeSource);
    formDataToSend.append("primaryGoal", formData.primaryGoal);
    formDataToSend.append("targetAmount", formData.targetAmount);
    formDataToSend.append("targetDate", formData.targetDate);
    formDataToSend.append(
      "spendingCategories",
      JSON.stringify(formData.spendingCategories)
    );
    formDataToSend.append("budgetingStyle", formData.budgetingStyle);

    // for (const [key, value] of formDataToSend.entries()) {
    //   if (value instanceof File) {
    //     console.log(`${key}:`, {
    //       name: value.name,
    //       type: value.type,
    //       size: `${(value.size / 1024).toFixed(2)} KB`,
    //     });
    //   } else {
    //     console.log(`${key}:`, value);
    //   }
    // }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`${baseUrl}/onboarding/onboard`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }

        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      if (data.proceed) {
        window.location.href = "/dashboard";
      } else {
        throw new Error(data.message || "Unknown response from server");
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error instanceof SyntaxError) {
        errorMessage = "Invalid response from server. Please try again.";
      } else if (error) {
        setError("An unexpected error occurred. Please try again.");
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, accessToken]);

  const steps = [
    <BasicProfileStep formData={formData} onChange={handleInputChange} />,

    <FinancialBasicsStep formData={formData} onChange={handleInputChange} />,

    <FinancialGoalsStep formData={formData} onChange={handleInputChange} />,

    <SpendingHabitsStep
      formData={formData}
      onChange={handleInputChange}
      onCategoryToggle={handleCategoryToggle}
    />,

    <CompletionStep formData={formData} onChange={handleInputChange} />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--neutral-950)] dark:to-[var(--primary-900)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-4xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="md:bg-white/95 md:dark:bg-[var(--neutral-900)]/95 md:backdrop-blur-md md:rounded-3xl md:shadow-2xl overflow-hidden md:border border-white/20 md:dark:border-[var(--neutral-700)] md:px-[10px] pb-[20px]"
        >
          <ProgressHeader progress={progress} />

          {steps[currentStep]}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-[var(--error-500)]/20 max-w-[400px] mx-auto mt-[20px] border border-[var(--error-500)]/30 rounded-lg text-[var(--error-300)] text-sm"
            >
              {error}
            </motion.div>
          )}
          <NavigationFooter
            currentStep={currentStep}
            prevStep={prevStep}
            nextStep={nextStep}
            setCurrentStep={setCurrentStep}
            handleSubmit={handleSubmit}
            totalSteps={totalSteps}
            isSubmitting={isSubmitting}
          />
        </motion.div>
      </div>
    </div>
  );
}
