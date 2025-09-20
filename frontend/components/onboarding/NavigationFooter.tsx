import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, SkipForward } from "lucide-react";
import React from "react";

interface ChildProps {
  currentStep: number;
  prevStep: () => void;
  nextStep: () => void;
  setCurrentStep: (value: number) => void;
  handleSubmit: () => void;
  totalSteps: number;
  isSubmitting: boolean;
}

export default function NavigationFooter({
  currentStep,
  prevStep,
  totalSteps,
  nextStep,
  handleSubmit,
  isSubmitting,
}: ChildProps) {
  return (
    <div className="px-[10px] py-[10px] border-t mt-[20px] border-[var(--border-light)]">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-[10px]">
        {currentStep > 0 && (
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-tertiary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </motion.button>
        )}

        {currentStep < totalSteps ? (
          <div className="flex items-center justify-center flex-col-reverse md:flex-row space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className="flex items-center space-x-2 px-[10px] md:px-6 py-[5px] md:py-3 bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--success-500)] to-[var(--success-600)] hover:from-[var(--success-600)] hover:to-[var(--success-700)] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span>Get Started</span>
           {isSubmitting ? <Loader2 className="animate-spin w-4 h-4"/> : <CheckCircle className="h-4 w-4" />}
          </motion.button>
        )}
      </div>
    </div>
  );
}
