import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-[#EAE5DC]/60 animate-pulse rounded-[4px]';

  if (variant === 'text') {
    return <div className={`h-4 w-full ${baseClasses} ${className}`} {...props} />;
  }

  if (variant === 'card') {
    return (
      <div className={`p-6 bg-white border border-[#EAE5DC] rounded-[8px] space-y-4 ${className}`} {...props}>
        <div className="h-48 w-full bg-[#EAE5DC]/50 rounded-[6px] animate-pulse" />
        <div className="h-5 w-2/3 bg-[#EAE5DC]/70 rounded-[4px] animate-pulse" />
        <div className="h-3 w-full bg-[#EAE5DC]/40 rounded-[4px] animate-pulse" />
        <div className="h-3 w-4/5 bg-[#EAE5DC]/40 rounded-[4px] animate-pulse" />
      </div>
    );
  }

  return <div className={`${baseClasses} ${className}`} {...props} />;
};
