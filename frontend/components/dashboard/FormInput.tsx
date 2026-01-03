import React, { useState } from "react";
import { LucideIcon, Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  id: string;
  label: string;
  icon?: LucideIcon;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  step?: string;
  rows?: number;
  maxLength?: number;
  currencySymbol?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  min,
  step,
  rows,
  maxLength,
  currencySymbol,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClass = `w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] outline-none transition-colors ${
    error ? "border-[var(--error-500)]" : "border-[var(--border-light)]"
  } ${
    disabled
      ? "bg-[var(--bg-tertiary)] cursor-not-allowed opacity-70"
      : "bg-[var(--bg-primary)]"
  }`;

  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows || 3}
          maxLength={maxLength}
          disabled={disabled}
          className={`${inputClass} resize-none pl-10`}
        />
      );
    }

    if (type === "select") {
      return (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${inputClass} appearance-none pl-10`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {/* Options will be passed as children */}
        </select>
      );
    }

    const isPassword = type === "password";
    const currentType = isPassword && showPassword ? "text" : type;

    return (
      <input
        id={id}
        type={currentType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={min}
        step={step}
        maxLength={maxLength}
        disabled={disabled}
        className={`${inputClass} ${currencySymbol ? "pl-13" : "pl-10"} ${
          isPassword ? "pr-12" : ""
        }`}
      />
    );
  };

  return (
    <div className="flex flex-col items-start">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
      >
        {label}
        {required && <span className="text-[var(--error-500)] ml-1">*</span>}
      </label>

      <div className="relative w-full">
        {/* Icon or Currency Symbol */}
        {currencySymbol ? (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-tertiary)]">
            {currencySymbol}
          </div>
        ) : Icon ? (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-tertiary)]">
            <Icon size={20} />
          </div>
        ) : null}

        {renderInput()}

        {type === "password" && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-tertiary)] hover:text-[var(--primary-600)] transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-[var(--error-500)]">{error}</p>}
    </div>
  );
};

export default FormInput;
