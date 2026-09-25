import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'ivory' | 'surface-low' | 'white' | 'charcoal';
  spacing?: 'sm' | 'md' | 'lg' | 'none';
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'ivory',
  spacing = 'lg',
  className = '',
  ...props
}) => {
  const variantClasses = {
    ivory: 'bg-[#F8F5EF] text-[#252525]',
    'surface-low': 'bg-[#F6F3ED] text-[#252525]',
    white: 'bg-white text-[#252525]',
    charcoal: 'bg-[#171717] text-[#F8F5EF]',
  };

  const spacingClasses = {
    none: 'py-0',
    sm: 'py-12 sm:py-16',
    md: 'py-16 sm:py-20',
    lg: 'py-20 sm:py-28',
  };

  return (
    <section className={`w-full ${variantClasses[variant]} ${spacingClasses[spacing]} ${className}`} {...props}>
      {children}
    </section>
  );
};
