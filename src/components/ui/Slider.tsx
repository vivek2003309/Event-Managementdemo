import React from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  valueDisplay?: string | number;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChangeValue?: (val: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  valueDisplay,
  min,
  max,
  step = 1,
  value,
  onChangeValue,
  className = '',
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`w-full flex flex-col space-y-2 ${className}`}>
      {(label || valueDisplay !== undefined) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#77736D]">
              {label}
            </span>
          )}
          {valueDisplay !== undefined && (
            <span className="font-serif text-[18px] text-[#171717] font-medium">
              {valueDisplay}
            </span>
          )}
        </div>
      )}
      <div className="relative py-2 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChangeValue && onChangeValue(Number(e.target.value))}
          className="w-full h-1.5 bg-[#EAE5DC] rounded-lg appearance-none cursor-pointer accent-[#C6A66B] focus:outline-none"
          style={{
            background: `linear-gradient(to right, #C6A66B 0%, #C6A66B ${percentage}%, #EAE5DC ${percentage}%, #EAE5DC 100%)`,
          }}
          {...props}
        />
      </div>
    </div>
  );
};
