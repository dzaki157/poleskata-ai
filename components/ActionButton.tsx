import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled: boolean;
  isActive: boolean;
  colorClass: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  disabled, 
  isActive,
  colorClass 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
        ${isActive 
          ? `bg-white border-transparent ring-2 ring-offset-1 shadow-md ${colorClass.replace('text-', 'ring-')}` 
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : 'cursor-pointer'}
      `}
    >
      <div className={`mb-2 p-2 rounded-full bg-opacity-10 ${isActive ? 'bg-slate-100' : 'bg-slate-50'}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );
};