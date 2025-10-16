"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { baseUrl } from "@/api/rootUrls";
import { useAuthStore } from "@/store/authStore";
import BrandingSection from "./BrandingSection";
import FeatureHighlights from "./FeatureHighlights";
import LoginForm from "./LoginForm";

interface LoginFormProps {
  onToggleForm?: () => void;
}

const Login: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuthStore();

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log(data, baseUrl);

      if (!response.ok) {
        setErrors({
          submit:
            data.message || "Login failed. Please check your credentials.",
        });

        if (data.requiresVerification) {
          window.location.href = "/verification";
        }

        console.log(data.requiresVerification);
      } else {
        setAuth(data.accessToken, data.user);
        window.location.href = "/dashboard";
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center lg:justify-end"
        >
          <LoginForm
            formData={formData}
            showPassword={showPassword}
            errors={errors}
            isSubmitting={isSubmitting}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setShowPassword={setShowPassword}
            onToggleForm={onToggleForm}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
