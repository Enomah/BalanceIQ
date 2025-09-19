import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import FormInput from "../signup/FormInput";
import PasswordRequirements from "../signup/PasswordRequirments";

interface ResetPasswordFormContentProps {
  formData: { password: string; confirmPassword: string };
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const ResetPasswordFormContent: React.FC<ResetPasswordFormContentProps> = ({
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
          Back
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-white/80">Enter your new password</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="password"
            label="New Password"
            icon={Lock}
            type="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            showVisibilityToggle
          >
            <PasswordRequirements password={formData.password}/>
          </FormInput>
          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            icon={Lock}
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            showVisibilityToggle
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
                Resetting Password...
              </>
            ) : (
              <>
                Reset Password <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordFormContent;