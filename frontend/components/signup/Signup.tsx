"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SignupForm from "./SignupForm";
import FeatureHighlights from "./FeatureHighlights";
import BackgroundDecor from "./BackgroundDecor";
import BrandingSection from "./BrandingSection";
import StatsSection from "../login/StatsSection";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--neutral-950)] dark:to-[var(--primary-900)] flex items-center justify-center p-4 overflow-hidden">
      <BackgroundDecor />
      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex flex-col justify-center space-y-8 text-white"
        >
          <BrandingSection />
          <FeatureHighlights />
          <StatsSection />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center lg:justify-end"
        >
          <SignupForm
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            errors={errors}
            setErrors={setErrors}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </motion.div>
      </div>
    </div>
  );
}