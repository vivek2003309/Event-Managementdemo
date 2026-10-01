import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#77736D] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-label={props['aria-label'] || label}
            className={`w-full bg-white text-[#252525] placeholder:text-[#9C968C] text-[14px] leading-relaxed py-2.5 px-3.5 rounded-[4px] border border-[#EAE5DC] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] disabled:bg-[#F6F3ED] disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon ? 'pr-9' : ''} ${
              error ? 'border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/30' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#77736D] pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-[12px] text-[#BA1A1A] tracking-normal">{error}</span>}
        {!error && hint && <span className="text-[11px] text-[#77736D] tracking-normal">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
