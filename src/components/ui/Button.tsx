import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // 4px soft radius discipline, anti-slop single line
    const baseClasses =
      'inline-flex items-center justify-center font-medium uppercase tracking-[0.14em] transition-all duration-200 select-none whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A66B] rounded-[4px] cursor-pointer';

    const sizeClasses = {
      sm: 'text-[11px] py-2 px-3.5 gap-1.5',
      md: 'text-[12px] py-3 px-5 gap-2',
      lg: 'text-[13px] py-4 px-8 gap-2.5',
    };

    const variantClasses = {
      // Primary: Solid Deep Charcoal (#171717) with Warm Ivory (#F8F5EF) text
      primary:
        'bg-[#171717] text-[#F8F5EF] hover:bg-[#2D2D2D] active:bg-[#000000] shadow-[0_2px_8px_rgba(23,23,23,0.15)]',
      
      // Secondary: Hairline border in Charcoal, subtle hover wash
      secondary:
        'bg-transparent border border-[#171717] text-[#171717] hover:bg-[#171717]/[0.05] active:bg-[#171717]/[0.1]',
      
      // Accent: Muted Champagne Gold (#C6A66B) for flagship milestones
      accent:
        'bg-[#C6A66B] text-white hover:bg-[#B5955A] active:bg-[#A38349] shadow-[0_4px_16px_rgba(198,166,107,0.25)]',
      
      // Outline: Subtle hairline stone border
      outline:
        'bg-white border border-[#EAE5DC] text-[#252525] hover:border-[#C6A66B] hover:text-[#171717] hover:bg-[#F8F5EF]/60',
      
      // Ghost: Quiet text with hover state
      ghost:
        'bg-transparent text-[#252525] hover:text-[#C6A66B] hover:bg-[#171717]/[0.04]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
