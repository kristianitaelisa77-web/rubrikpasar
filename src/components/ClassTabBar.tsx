import React from 'react';
import { Users, GraduationCap } from 'lucide-react';

interface ClassTabBarProps {
  availableClasses: string[];
  activeClass: string;
  onSelectClass: (className: string) => void;
  studentCountsByClass: Record<string, number>;
}

export const ClassTabBar: React.FC<ClassTabBarProps> = ({
  availableClasses,
  activeClass,
  onSelectClass,
  studentCountsByClass,
}) => {
  return (
    <div className="no-print bg-white border border-slate-200 rounded-xl p-2 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-700">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <span>Pilih Kelas:</span>
        </div>

        {/* Tab Buttons for 7A to 7G */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {availableClasses.map(cls => {
            const count = studentCountsByClass[cls] || 0;
            const isActive = activeClass === cls;

            return (
              <button
                key={cls}
                type="button"
                onClick={() => onSelectClass(cls)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>Kelas {cls}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono tabular-nums ${
                    isActive
                      ? 'bg-emerald-700 text-emerald-100'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
