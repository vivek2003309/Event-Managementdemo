import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none bg-white text-[#252525] text-[14px] py-2.5 pl-3.5 pr-10 rounded-[4px] border border-[#EAE5DC] transition-all duration-200 focus:outline-none focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B]/50 disabled:bg-[#F6F3ED] disabled:cursor-not-allowed cursor-pointer ${
              error ? 'border-[#BA1A1A] focus:border-[#BA1A1A]' : ''
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-[#77736D] flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <span className="text-[12px] text-[#BA1A1A]">{error}</span>}
        {!error && hint && <span className="text-[11px] text-[#77736D]">{hint}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
