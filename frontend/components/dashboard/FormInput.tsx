import React from 'react';
import { LucideIcon } from 'lucide-react';

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
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  min,
  step,
  rows,
  maxLength,
  currencySymbol
}) => {
  const inputClass = `w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] outline-none transition-colors ${
    error ? 'border-[var(--error-500)]' : 'border-[var(--border-light)]'
  }`;

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows || 3}
          className={`${inputClass} resize-none pl-10`}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} appearance-none pl-10`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {/* Options will be passed as children */}
        </select>
      );
    }

    return (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={min}
        step={step}
        className={`${inputClass} ${currencySymbol ? 'pl-13' : 'pl-10'}`}
      />
    );
  };

  return (
    <div className='flex flex-col items-start'>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
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
      </div>

      {error && (
        <p className="mt-1 text-sm text-[var(--error-500)]">{error}</p>
      )}
    </div>
  );
};

export default FormInput;