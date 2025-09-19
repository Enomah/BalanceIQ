import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import FormInput from "../signup/FormInput";
import OTPVerification from "../signup/OTPVerification";

interface VerifyEmailFormContentProps {
  formData: { email: string };
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  showOTPForm: boolean;
  setShowOTPForm: (value: boolean) => void;
}

const VerifyEmailFormContent: React.FC<VerifyEmailFormContentProps> = ({
  formData,
  errors,
  isSubmitting,
  handleChange,
  handleSubmit,
  showOTPForm,
  setShowOTPForm,
}) => {

  if (showOTPForm) {
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
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
          <p className="text-white/80">Enter your email to receive a verification code</p>
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
                Send Verification Code <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailFormContent;