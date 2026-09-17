import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id: string;
  title: string;
  count: number;
  icon: LucideIcon;
  colorClass: string;
  iconBgClass: string;
  onClick?: () => void;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  count,
  icon: Icon,
  colorClass,
  iconBgClass,
  onClick,
  description,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${colorClass}`}>
              {count}
            </span>
            {description && (
              <span className="text-xs font-medium text-slate-400">{description}</span>
            )}
          </div>
        </div>

        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBgClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
