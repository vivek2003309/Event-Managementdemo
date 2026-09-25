import React from 'react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  hint,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
          {label} {required && <span className="text-[#C6A66B]">*</span>}
        </label>
      </div>
      <div>{children}</div>
      {error && <span className="text-[12px] text-[#BA1A1A] tracking-normal">{error}</span>}
      {!error && hint && <span className="text-[11px] text-[#77736D] tracking-normal">{hint}</span>}
    </div>
  );
};
