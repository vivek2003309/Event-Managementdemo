import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  subtext?: string;
  fullscreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Curating Bespoke Experience...',
  subtext = 'Calibrating architectural details and scenography',
  fullscreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#C6A66B]/30 animate-ping opacity-60" />
        <Loader2 className="w-6 h-6 text-[#C6A66B] animate-spin" />
      </div>
      <div className="space-y-1">
        <h4 className="font-serif text-[20px] text-[#171717] font-normal tracking-wide">
          {message}
        </h4>
        <p className="text-[12px] text-[#77736D] tracking-wide">{subtext}</p>
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F8F5EF]/90 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="w-full py-16 flex items-center justify-center">{content}</div>;
};
