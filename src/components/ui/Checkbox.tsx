import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', id, checked, onChange, disabled, ...props }, ref) => {
    const checkboxId = id || `chk-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <label
        htmlFor={checkboxId}
        className={`group flex items-start gap-3 select-none cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`w-[18px] h-[18px] rounded-[3px] border transition-all duration-200 flex items-center justify-center ${
              checked
                ? 'bg-[#171717] border-[#171717] text-white shadow-sm'
                : 'bg-white border-[#C6A66B]/60 group-hover:border-[#C6A66B]'
            }`}
          >
            {checked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] text-[#252525] font-normal leading-snug group-hover:text-[#171717]">
            {label}
          </span>
          {description && (
            <span className="text-[11px] text-[#77736D] leading-normal mt-0.5">{description}</span>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
