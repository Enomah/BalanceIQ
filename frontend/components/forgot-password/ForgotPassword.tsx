"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { baseUrl } from "@/api/rootUrls";
import BrandingSection from "../signup/BrandingSection";
import FeatureHighlights from "../login/FeatureHighlights";
import StatsSection from "../login/StatsSection";
import ForgotPasswordFormContent from "./ForgotPasswordFormContent";
import ResetPasswordFormContent from "./ResetPasswordFormContent";
import OTPVerification from "../signup/OTPVerification";

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateEmailForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/auth/request-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();


      if (!response.ok) {
        setErrors({ submit: data.message || "Failed to send OTP. Please try again." });
      } else {
        setShowOTPForm(true);
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateResetForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/auth/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      // console.log(data)

      if (!response.ok) {
        setErrors({
          submit: data.message || "Failed to reset password. Please try again.",
        });
      } else {
        setFormData({ email: "", password: "", confirmPassword: "" });
        setShowResetForm(false);
        setShowOTPForm(false);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] dark:from-[var(--neutral-950)] dark:to-[var(--primary-900)] flex items-center justify-center p-4 overflow-hidden">
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
          {showOTPForm && !showResetForm ? (
            <OTPVerification
              email={formData.email}
              onBack={() => setShowOTPForm(false)}
              onNext={() => {
                setShowOTPForm(false);
                setShowResetForm(true);
              }}
            />
          ) : showResetForm ? (
            <ResetPasswordFormContent
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
              handleSubmit={handleResetSubmit}
              onBack={() => setShowResetForm(false)}
            />
          ) : (
            <ForgotPasswordFormContent
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
              handleSubmit={handleEmailSubmit}
              onBack={() => (window.location.href = "/login")}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;