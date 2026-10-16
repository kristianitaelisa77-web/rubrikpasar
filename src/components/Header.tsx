import React from 'react';
import { ActiveAppMode } from '../types/rubric';
import { BookOpen, Table, Printer, HelpCircle, Settings, Users } from 'lucide-react';

interface HeaderProps {
  currentMode: ActiveAppMode;
  onSelectMode: (mode: ActiveAppMode) => void;
  onOpenRubricGuide: () => void;
  onOpenSettings: () => void;
  totalStudents: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenRubricGuide,
  onOpenSettings,
  totalStudents,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                Rubrik Pasar Digital SMP 7
              </span>
              <span className="text-xs text-slate-500 whitespace-nowrap">
                Buku Cerita Digital &middot; Sumatif Proyek
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Mode Switcher) */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => onSelectMode('interactive')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentMode === 'interactive'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Mode 1: Input Interaktif</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode('batch')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentMode === 'batch'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Table className="w-4 h-4 text-emerald-600" />
              <span>Mode 2: Rekapitulasi & Impor</span>
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono tabular-nums">
                {totalStudents}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode('print')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentMode === 'print'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>Mode 3: Cetak Lembar</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action / Utilities */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenRubricGuide}
              title="Panduan Kriteria Rubrik Lengkap"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Pedoman Rubrik</span>
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              title="Pengaturan Tanggal & Kota Cetak"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Atur Tanggal Cetak</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
