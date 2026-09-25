import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D] select-none"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full bg-white text-[#252525] placeholder:text-[#9C968C] text-[14px] leading-relaxed p-3.5 rounded-[4px] border border-[#EAE5DC] transition-all duration-200 focus:outline-none focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B]/50 disabled:bg-[#F6F3ED] disabled:cursor-not-allowed resize-y ${
            error ? 'border-[#BA1A1A] focus:border-[#BA1A1A]' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-[12px] text-[#BA1A1A]">{error}</span>}
        {!error && hint && <span className="text-[11px] text-[#77736D]">{hint}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
