import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface OptionType {
  value: string;
  label: string;
  icon?: string;
}

interface FormSelectProps {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  options: OptionType[];
  placeholder?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  icon,
  value,
  onChange,
  error,
  required = false,
  options,
  placeholder
}) => {
  return (
    <div className='flex flex-col items-start'>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
        {label}
        {required && <span className="text-[var(--error-500)] ml-1">*</span>}
      </label>
      
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-tertiary)]">
          {React.createElement(icon, { size: 20 })}
        </div>

        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] outline-none transition-colors appearance-none pl-10 ${
            error ? 'border-[var(--error-500)]' : 'border-[var(--border-light)]'
          }`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mt-1 text-sm text-[var(--error-500)]">{error}</p>
      )}
    </div>
  );
};

export default FormSelect;