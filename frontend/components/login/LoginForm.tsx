import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import FormInput from "../signup/FormInput";
import FormFooter from "./FormFooter";

interface LoginFormContentProps {
  formData: { email: string; password: string };
  showPassword: boolean;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  onToggleForm?: () => void;
}

const LoginForm: React.FC<LoginFormContentProps> = ({
  formData,
  showPassword,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
  setShowPassword,
  onToggleForm,
}) => {
  return (
    <div className="w-full max-w-md">
      <div className="md:bg-white/10 md:backdrop-blur-xl rounded-3xl md:p-8 md:border md:border-white/20 md:shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/80">Sign in to your BalanceIQ account</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="email"
            label="Email Address"
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <FormInput
            id="password"
            label="Password"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            toggleVisibility={() => setShowPassword(!showPassword)}
            showVisibilityToggle
          />
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-[var(--primary-400)] hover:text-[var(--primary-300)] text-sm font-medium transition-colors"
            >
              Forgot your password?
            </Link>
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
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>

        <FormFooter onToggleForm={onToggleForm} />
      </div>
    </div>
  );
};

export default LoginForm;