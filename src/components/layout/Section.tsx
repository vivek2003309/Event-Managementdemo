import React from 'react';
import { useInView } from '../../hooks/useInView';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'ivory' | 'surface-low' | 'white' | 'charcoal';
  spacing?: 'sm' | 'md' | 'lg' | 'none';
  animate?: boolean;
  delay?: number;
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'ivory',
  spacing = 'lg',
  className = '',
  animate = false,
  delay = 0,
  style = {},
  ...props
}) => {
  const [ref, inView] = useInView<HTMLElement>({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
    triggerOnce: true,
  });

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

  const animatedStyle: React.CSSProperties = animate
    ? {
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
        ...style,
      }
    : style;

  return (
    <section
      ref={animate ? (ref as unknown as React.Ref<HTMLElement>) : undefined}
      className={`w-full ${variantClasses[variant]} ${spacingClasses[spacing]} ${className}`}
      style={animatedStyle}
      {...props}
    >
      {children}
    </section>
  );
};
