import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ArrowRight,
  User,
  Mail,
  Lock,
} from "lucide-react";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import FormFooter from "./FormFooter";
import PasswordRequirements from "./PasswordRequirments";
import { baseUrl } from "@/api/rootUrls";
import OTPVerification from "./OTPVerification";

interface SignupFormProps {
  formData: {
    fullName: string;
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      nickname: string;
      email: string;
      password: string;
      confirmPassword: string;
    }>
  >;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignupForm({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  errors,
  setErrors,
  isSubmitting,
  setIsSubmitting,
}: SignupFormProps) {
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const otpStatus = localStorage.getItem('otpVerificationInProgress');
    const userDataStr = localStorage.getItem('userData');
    
    if (otpStatus === 'true' && userDataStr) {
      setShowOTPForm(true);
      setUserData(JSON.parse(userDataStr));
    }
  }, []);

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = "Nickname is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data);
      } else {
        setUserData(data.user);
        setShowOTPForm(true);
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showOTPForm && userData) {
    return (
      <OTPVerification 
        email={formData.email}
        onBack={() => {
          setShowOTPForm(false);
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="md:bg-white/10 md:backdrop-blur-xl rounded-3xl md:p-8 md:border md:border-white/20 md:shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text- mb-[10px]"
        >
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-white/80">Join BalanceIQ today</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-[2px]">
          {[
            {
              id: "fullName",
              label: "Full Name",
              icon: User,
              type: "text",
              placeholder: "Enter your full name",
            },
            {
              id: "nickname",
              label: "Nickname",
              icon: User,
              type: "text",
              placeholder: "Choose a nickname",
            },
            {
              id: "email",
              label: "Email Address",
              icon: Mail,
              type: "email",
              placeholder: "Enter your email",
            },
          ].map((field) => (
            <FormInput
              key={field.id}
              id={field.id}
              label={field.label}
              icon={field.icon}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id as keyof typeof formData]}
              onChange={handleChange}
              error={errors[field.id]}
            />
          ))}

          <FormInput
            id="password"
            label="Password"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            toggleVisibility={() => setShowPassword(!showPassword)}
            showVisibilityToggle={true}
          >
            <PasswordRequirements password={formData.password} />
          </FormInput>

          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            icon={Lock}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            showVisibilityToggle={true}
          />

          <AnimatePresence>
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-[var(--error-500)]/20 border border-[var(--error-500)]/30 rounded-lg text-[var(--error-300)] text-sm"
              >
                {errors.submit}
              </motion.div>
            )}
          </AnimatePresence>

          <SubmitButton isSubmitting={isSubmitting} />
        </form>

        <FormFooter />
      </div>
    </div>
  );
}