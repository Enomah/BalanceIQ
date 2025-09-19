import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export default function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-6"
    >
      {isSubmitting ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Creating Account...
        </>
      ) : (
        <>
          Create Account <ArrowRight className="ml-2 h-5 w-5" />
        </>
      )}
    </motion.button>
  );
}