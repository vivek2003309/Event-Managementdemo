import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'text' | 'soft' | 'gold' | 'charcoal';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'text',
  dot = false,
  className = '',
  ...props
}) => {
  // Anti-pill discipline: 4px soft radius max, no garish rounded-full capsules
  if (variant === 'text') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#77736D] ${className}`}
        {...props}
      >
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] shrink-0" />}
        {children}
      </span>
    );
  }

  const variantStyles = {
    soft: 'bg-[#F0EEE8] text-[#252525] border border-[#EAE5DC]',
    gold: 'bg-[#F9F5EB] text-[#745A27] border border-[#E4C284]/60',
    charcoal: 'bg-[#171717] text-[#F8F5EF]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] py-1 px-2.5 rounded-[4px] select-none ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B] shrink-0" />}
      {children}
    </span>
  );
};
