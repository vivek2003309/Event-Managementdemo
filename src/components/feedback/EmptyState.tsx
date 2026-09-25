import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`w-full py-16 px-6 bg-white border border-[#EAE5DC] rounded-[8px] flex flex-col items-center justify-center text-center max-w-xl mx-auto shadow-sm ${className}`}
    >
      <div className="w-14 h-14 rounded-[8px] bg-[#F8F5EF] border border-[#EAE5DC] flex items-center justify-center text-[#C6A66B] mb-5">
        {icon || <Compass className="w-6 h-6 stroke-[1.5]" />}
      </div>
      <h4 className="font-serif text-[24px] text-[#171717] font-normal tracking-tight mb-2">
        {title}
      </h4>
      <p className="text-[14px] text-[#77736D] leading-relaxed max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
