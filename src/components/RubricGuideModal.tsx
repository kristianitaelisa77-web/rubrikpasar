import React from 'react';
import { X, CheckCircle2, Award, BookOpen, Layers } from 'lucide-react';
import { RUBRIC_CRITERIA, ASPECTS_A, ASPECTS_B } from '../data/rubricCriteria';

interface RubricGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RubricGuideModal: React.FC<RubricGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Pedoman Rubrik Penilaian Sumatif Proyek
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Proyek Buku Cerita Digital (Canva) &middot; &ldquo;Mengungkap Cerita di Balik Sebuah Pasar&rdquo; &middot; Kelas 7 SMP
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8 text-sm">
          {/* Formula Callout */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-700" /> Rumus Perhitungan Nilai:
              </span>
              <p className="text-xs text-emerald-800 mt-1">
                Total Skor = Subtotal A (Maks 16) + Subtotal B (Maks 16) = Maksimal 32
                <br />
                <span className="font-semibold">Nilai Akhir = (Total Skor / 32) &times; 100</span>
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-emerald-300">
                <span className="font-bold text-slate-900">A (91 - 100)</span>
                <span className="block text-[11px] text-slate-600">Sangat Baik</span>
              </div>
              <div className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-emerald-300">
                <span className="font-bold text-slate-900">B (81 - 90)</span>
                <span className="block text-[11px] text-slate-600">Baik</span>
              </div>
              <div className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-emerald-300">
                <span className="font-bold text-slate-900">C (71 - 80)</span>
                <span className="block text-[11px] text-slate-600">Cukup</span>
              </div>
              <div className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-emerald-300">
                <span className="font-bold text-slate-900">D (&lt; 71)</span>
                <span className="block text-[11px] text-slate-600">Perlu Bimbingan</span>
              </div>
            </div>
          </div>

          {/* Section A */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                A
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                A. Diskusi & Kerja Sama Kelompok (Skor 1 - 4 per aspek, Total Maksimal 16)
              </h3>
            </div>
            <div className="space-y-4">
              {ASPECTS_A.map(aspectKey => {
                const crit = RUBRIC_CRITERIA[aspectKey];
                return (
                  <div key={crit.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {crit.number}. {crit.title}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                      {[4, 3, 2, 1].map(lvl => {
                        const levelData = crit.levels[lvl as 1 | 2 | 3 | 4];
                        return (
                          <div
                            key={lvl}
                            className={`p-2.5 rounded-lg border ${
                              lvl === 4
                                ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                                : lvl === 3
                                ? 'bg-blue-50/60 border-blue-200 text-slate-900'
                                : lvl === 2
                                ? 'bg-amber-50/60 border-amber-200 text-slate-900'
                                : 'bg-rose-50/60 border-rose-200 text-slate-900'
                            }`}
                          >
                            <span className="font-bold block mb-1">
                              Skor {lvl} ({levelData.label})
                            </span>
                            <p className="text-slate-600 leading-relaxed">
                              {levelData.descriptor}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                B
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                B. Produk Buku Cerita Digital (Canva) (Skor 1 - 4 per aspek, Total Maksimal 16)
              </h3>
            </div>
            <div className="space-y-4">
              {ASPECTS_B.map(aspectKey => {
                const crit = RUBRIC_CRITERIA[aspectKey];
                return (
                  <div key={crit.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {crit.number}. {crit.title}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                      {[4, 3, 2, 1].map(lvl => {
                        const levelData = crit.levels[lvl as 1 | 2 | 3 | 4];
                        return (
                          <div
                            key={lvl}
                            className={`p-2.5 rounded-lg border ${
                              lvl === 4
                                ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                                : lvl === 3
                                ? 'bg-blue-50/60 border-blue-200 text-slate-900'
                                : lvl === 2
                                ? 'bg-amber-50/60 border-amber-200 text-slate-900'
                                : 'bg-rose-50/60 border-rose-200 text-slate-900'
                            }`}
                          >
                            <span className="font-bold block mb-1">
                              Skor {lvl} ({levelData.label})
                            </span>
                            <p className="text-slate-600 leading-relaxed">
                              {levelData.descriptor}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Tutup Pedoman
          </button>
        </div>
      </div>
    </div>
  );
};
