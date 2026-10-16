import React, { useState, useMemo, useRef } from 'react';
import { StudentScoreRecord, TeacherProfile } from '../types/rubric';
import {
  generatePrintHtml,
  generateTwoStudentsA4Html,
  downloadPdfFromElement
} from '../utils/exportUtils';
import { X, Printer, Scissors, FileText, FileDown, Loader2 } from 'lucide-react';

interface BatchPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentScoreRecord[];
  teacherProfile: TeacherProfile;
}

export const BatchPrintModal: React.FC<BatchPrintModalProps> = ({
  isOpen,
  onClose,
  students,
  teacherProfile,
}) => {
  const [layoutMode, setLayoutMode] = useState<'two_per_sheet' | 'single'>('two_per_sheet');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Group students in pairs for 2-per-sheet mode
  const studentPairs = useMemo(() => {
    const pairs: [StudentScoreRecord, StudentScoreRecord | null][] = [];
    for (let i = 0; i < students.length; i += 2) {
      pairs.push([students[i], students[i + 1] || null]);
    }
    return pairs;
  }, [students]);

  if (!isOpen) return null;

  const handlePrintAll = () => {
    window.print();
  };

  const handleDownloadAllPdf = async () => {
    if (!containerRef.current) return;
    try {
      setIsDownloadingPdf(true);
      const className = students[0]?.className || 'Kelas';
      const filename = `Cetak_Massal_${className}_${layoutMode === 'two_per_sheet' ? 'A4_2SiswaPerLembar' : 'A4_Standar'}_${students.length}Siswa`;
      await downloadPdfFromElement(containerRef.current, filename, 'portrait');
    } catch (e) {
      console.error('Failed to download batch PDF', e);
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const totalSheetsNeeded = layoutMode === 'two_per_sheet'
    ? Math.ceil(students.length / 2)
    : students.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col">
      {/* Top action bar - Hidden on print */}
      <div className="no-print bg-white px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Cetak Massal Lembar Penilaian ({students.length} Siswa)
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Butuh {totalSheetsNeeded} Lembar A4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {layoutMode === 'two_per_sheet'
              ? `Mode Hemat Kertas Aktif: 2 Siswa per Lembar A4 (Menghemat ${students.length - totalSheetsNeeded} lembar kertas / 50%)`
              : 'Mode Standar: 1 Siswa per 1 Lembar A4 Penuh'}
          </p>
        </div>

        {/* Layout Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Format Switcher */}
          <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100">
            <button
              type="button"
              onClick={() => setLayoutMode('two_per_sheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                layoutMode === 'two_per_sheet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>2 Siswa / A4</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1 py-0.2 rounded-full font-semibold">
                Hemat Kertas
              </span>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                layoutMode === 'single'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1 Siswa / A4</span>
            </button>
          </div>

          {/* Download PDF button */}
          <button
            type="button"
            onClick={handleDownloadAllPdf}
            disabled={isDownloadingPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            title="Download Seluruh Lembar dalam 1 Berkas PDF"
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Download Semua PDF</span>
              </>
            )}
          </button>

          {/* Print button */}
          <button
            type="button"
            onClick={handlePrintAll}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Semua ({totalSheetsNeeded} Lembar)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Body - On screen it's scrollable, on print it outputs clean sheets */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-slate-200/80"
      >
        {layoutMode === 'two_per_sheet' ? (
          // 2 Students per A4 Sheet
          studentPairs.map(([std1, std2], idx) => {
            const rawHtml = generateTwoStudentsA4Html(std1, std2, teacherProfile);
            return (
              <div key={`pair_${std1.id}_${std2 ? std2.id : 'none'}`} className="relative max-w-[820px] mx-auto">
                {/* On-screen separator badge */}
                <div className="no-print text-center mb-2 flex items-center justify-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-800 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lembar Kertas A4 ke-{idx + 1} dari {studentPairs.length}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-emerald-300">
                      {std1.name} (Absen {std1.studentNo})
                      {std2 ? ` & ${std2.name} (Absen ${std2.studentNo})` : ' (Satu siswa)'}
                    </span>
                  </span>
                </div>

                {/* Printable container */}
                <div
                  className="rubric-print-sheet-2up shadow-lg bg-white p-4 page-break rounded-md"
                  dangerouslySetInnerHTML={{ __html: rawHtml }}
                />
              </div>
            );
          })
        ) : (
          // 1 Student per A4 Sheet (Standard)
          students.map((student, idx) => {
            const rawHtml = generatePrintHtml(student, teacherProfile);
            return (
              <div key={student.id} className="relative max-w-[800px] mx-auto">
                {/* On-screen separator badge */}
                <div className="no-print text-center mb-2">
                  <span className="text-xs font-mono font-bold bg-slate-800 text-white px-2.5 py-0.5 rounded-full">
                    Lembar {idx + 1} dari {students.length} &middot; {student.name} ({student.studentNo})
                  </span>
                </div>

                {/* Printable container */}
                <div
                  className="rubric-print-sheet shadow-lg bg-white page-break rounded-md"
                  dangerouslySetInnerHTML={{ __html: rawHtml }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
