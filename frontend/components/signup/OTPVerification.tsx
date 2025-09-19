import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, RefreshCw, CheckCircle } from "lucide-react";
import { baseUrl } from "@/api/rootUrls";
import { useAuthStore } from "@/store/authStore";

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
  onNext?: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onBack,
  onNext,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
      const lastFilledIndex = Math.min(newOtp.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit code" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`${baseUrl}/auth/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.message || "Invalid verification code" });
      } else {
        if (onNext) {
          onNext();
        } else {
          setTimeout(() => {
            window.location.href = "/onboarding";
            setVerificationSuccess(true);
            setAuth(data.accessToken, data.user);
          }, 2000);
        }
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsResending(true);
    setErrors({});

    try {
      const response = await fetch(`${baseUrl}/auth/request-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ resend: data.message || "Failed to resend OTP" });
      } else {
        setTimeLeft(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setErrors({ resend: "Failed to resend OTP. Please try again." });
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (verificationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"
      >
        <CheckCircle className="h-16 w-16 text-[var(--success-500)] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Verification Successful!
        </h2>
        <p className="text-white/80 mb-6">
          Your email has been verified successfully.
        </p>
        <p className="text-white/60">Redirecting...</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
        <motion.button
          onClick={onBack}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </motion.button>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--primary-500)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-white/80 mb-2">
            We've sent a 6-digit code to{" "}
            <span className="font-semibold">{email}</span>
          </p>
          <p className="text-white/60">Enter the code below to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">
              Verification Code
            </label>
            <div className="flex justify-center space-x-2 mb-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[var(--primary-400)] focus:border-transparent text-white"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-[var(--error-300)] text-sm text-center">
                {errors.otp}
              </p>
            )}
          </div>
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-white/70 text-sm">
                Code expires in{" "}
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-[var(--primary-400)] hover:text-[var(--primary-300)] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Resend code
                  </>
                )}
              </button>
            )}
            {errors.resend && (
              <p className="text-[var(--error-300)] text-sm mt-2">
                {errors.resend}
              </p>
            )}
          </div>
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
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </motion.button>
        </form>
        <div className="mt-6 text-center text-sm text-white/60">
          <p>
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
