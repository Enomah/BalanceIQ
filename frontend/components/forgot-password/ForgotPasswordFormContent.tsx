import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import FormInput from "../signup/FormInput";

interface ForgotPasswordFormContentProps {
  formData: { email: string };
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const ForgotPasswordFormContent: React.FC<ForgotPasswordFormContentProps> = ({
  formData,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
  onBack,
}) => {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
        <motion.button
          onClick={onBack}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Sign In
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
          <p className="text-white/80">Enter your email to receive a password reset code</p>
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
                Sending Code...
              </>
            ) : (
              <>
                Send Reset Code <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordFormContent;