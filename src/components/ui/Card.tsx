import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padded = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-[8px] border border-[#EAE5DC] text-[#252525] transition-all duration-300 ${
        hoverable ? 'hover:border-[#D6CEBE] hover:shadow-[0_12px_32px_-8px_rgba(23,23,23,0.06)]' : 'shadow-[0_4px_20px_-4px_rgba(23,23,23,0.03)]'
      } ${padded ? 'p-6 sm:p-8' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => <div className={`flex flex-col space-y-1.5 mb-4 ${className}`} {...props}>{children}</div>;

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3 className={`font-serif text-[22px] sm:text-[26px] font-normal text-[#171717] tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`text-[13px] sm:text-[14px] text-[#77736D] leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => <div className={`space-y-4 ${className}`} {...props}>{children}</div>;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`mt-6 pt-4 border-t border-[#EAE5DC] flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);
