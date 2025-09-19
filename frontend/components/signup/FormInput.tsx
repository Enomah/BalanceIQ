import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface FormInputProps {
  id: string;
  label: string;
  icon: LucideIcon;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  toggleVisibility?: () => void;
  showVisibilityToggle?: boolean;
  children?: React.ReactNode;
}

export default function FormInput({
  id,
  label,
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  error,
  toggleVisibility,
  showVisibilityToggle,
  children,
}: FormInputProps) {
  return (
    <div className="mb-[10px]">
      <label htmlFor={id} className="block text-sm font-medium text-white/90">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 ${
            showVisibilityToggle ? "pr-12" : "pr-4"
          } py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[var(--primary-400)] focus:border-transparent transition-colors text-white placeholder-white/50 ${
            error ? "border-[var(--error-500)]" : "border-white/20"
          }`}
          placeholder={placeholder}
        />
        {showVisibilityToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {type === "text" ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[var(--error-300)] text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}