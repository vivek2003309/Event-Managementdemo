import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange, className = '' }) => {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center p-1 bg-[#F0EEE8] rounded-[6px] border border-[#EAE5DC] overflow-x-auto max-w-full ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] rounded-[4px] transition-all duration-200 whitespace-nowrap cursor-pointer select-none flex items-center gap-1.5 ${
              isActive
                ? 'bg-[#171717] text-white shadow-sm'
                : 'text-[#77736D] hover:text-[#171717] hover:bg-white/50'
            }`}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className={`text-[10px] opacity-75 ${isActive ? 'text-[#E4C284]' : ''}`}>
                ({item.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
