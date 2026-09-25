import React from 'react';

export interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  inverted?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  subtitle,
  align = 'center',
  inverted = false,
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`mb-12 sm:mb-16 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'} ${className}`}
    >
      {kicker && (
        <div className={`inline-flex items-center gap-2.5 mb-3 ${isCenter ? 'justify-center' : ''}`}>
          <span className="w-6 h-[1px] bg-[#C6A66B]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C6A66B]">
            {kicker}
          </span>
          {isCenter && <span className="w-6 h-[1px] bg-[#C6A66B]" />}
        </div>
      )}

      <h2
        className={`font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-normal leading-[1.12] tracking-tight text-balance ${
          inverted ? 'text-white' : 'text-[#171717]'
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 text-[14px] sm:text-[15px] leading-relaxed font-light ${
            inverted ? 'text-white/80' : 'text-[#77736D]'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
