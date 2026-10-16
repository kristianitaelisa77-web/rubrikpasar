import React, { useState, useRef, useMemo } from 'react';
import { StudentScoreRecord, TeacherProfile } from '../types/rubric';
import {
  generatePrintHtml,
  generateTwoStudentsA4Html,
  downloadHtmlFile,
  downloadPdfFromElement
} from '../utils/exportUtils';
import {
  Printer,
  Copy,
  ChevronLeft,
  ChevronRight,
  Settings,
  Check,
  Edit,
  Eye,
  Code,
  FileDown,
  Loader2,
  Scissors,
  FileText
} from 'lucide-react';

interface ModePrintSheetProps {
  students: StudentScoreRecord[];
  activeClass: string;
  selectedStudentId: string | null;
  onSelectStudentId: (id: string) => void;
  teacherProfile: TeacherProfile;
  onOpenSettings: () => void;
  onEditStudent: (student: StudentScoreRecord) => void;
  onOpenBatchPrint: (studentsToPrint: StudentScoreRecord[]) => void;
}

export const ModePrintSheet: React.FC<ModePrintSheetProps> = ({
  students,
  activeClass,
  selectedStudentId,
  onSelectStudentId,
  teacherProfile,
  onOpenSettings,
  onEditStudent,
  onOpenBatchPrint,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw_html'>('preview');
  
  // Layout option: 'two_per_sheet' (Hemat Kertas 2 in 1 A4) vs 'single' (1 Siswa per A4)
  const [printLayout, setPrintLayout] = useState<'two_per_sheet' | 'single'>('two_per_sheet');

  const sheetContainerRef = useRef<HTMLDivElement>(null);

  // Filter students by active class
  const classStudents = useMemo(() => {
    return students
      .filter(s => s.className === activeClass)
      .sort((a, b) => a.studentNo.localeCompare(b.studentNo, undefined, { numeric: true }));
  }, [students, activeClass]);

  const displayStudents = classStudents.length > 0 ? classStudents : students;

  // Find active student 1
  let currentIndex = displayStudents.findIndex(s => s.id === selectedStudentId);
  if (currentIndex === -1) currentIndex = 0;
  const currentStudent = displayStudents[currentIndex];

  // For 2-per-sheet mode, determine default partner student (next student in class)
  const [pairedStudentId, setPairedStudentId] = useState<string | null>(null);

  // Synchronize paired student to next student whenever current student changes
  const defaultPairedStudent = useMemo(() => {
    if (currentIndex < displayStudents.length - 1) {
      return displayStudents[currentIndex + 1];
    }
    return null;
  }, [currentIndex, displayStudents]);

  const effectivePairedStudent = useMemo(() => {
    if (pairedStudentId) {
      const found = displayStudents.find(s => s.id === pairedStudentId);
      if (found && found.id !== currentStudent?.id) return found;
    }
    return defaultPairedStudent;
  }, [pairedStudentId, displayStudents, currentStudent, defaultPairedStudent]);

  const handlePrev = () => {
    if (printLayout === 'two_per_sheet') {
      const prevIdx = Math.max(0, currentIndex - 2);
      onSelectStudentId(displayStudents[prevIdx].id);
      setPairedStudentId(null);
    } else {
      if (currentIndex > 0) {
        onSelectStudentId(displayStudents[currentIndex - 1].id);
      }
    }
  };

  const handleNext = () => {
    if (printLayout === 'two_per_sheet') {
      const nextIdx = Math.min(displayStudents.length - 1, currentIndex + 2);
      onSelectStudentId(displayStudents[nextIdx].id);
      setPairedStudentId(null);
    } else {
      if (currentIndex < displayStudents.length - 1) {
        onSelectStudentId(displayStudents[currentIndex + 1].id);
      }
    }
  };

  if (!currentStudent) {
    return (
      <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
        <p className="text-slate-500 text-sm">
          Belum ada data siswa di Kelas {activeClass}.
        </p>
      </div>
    );
  }

  // Generate either 2-per-page A4 HTML or 1-per-page standard HTML
  const rawHtml = printLayout === 'two_per_sheet'
    ? generateTwoStudentsA4Html(currentStudent, effectivePairedStudent, teacherProfile)
    : generatePrintHtml(currentStudent, teacherProfile);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(rawHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Direct PDF Download Handler
  const handleDownloadPdf = async () => {
    if (!sheetContainerRef.current) return;
    try {
      setIsDownloadingPdf(true);
      const filename = printLayout === 'two_per_sheet'
        ? `Lembar_Penilaian_A4_2Siswa_${currentStudent.className}_Absen${currentStudent.studentNo}${effectivePairedStudent ? `_dan_Absen${effectivePairedStudent.studentNo}` : ''}`
        : `Lembar_Penilaian_${currentStudent.className}_Absen${currentStudent.studentNo}_${currentStudent.name.replace(/\s+/g, '_')}`;

      await downloadPdfFromElement(sheetContainerRef.current, filename, 'portrait');
    } catch (e) {
      console.error('Failed to download PDF', e);
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Layout & Mode Switcher Bar */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Layout Selector: 2 Siswa per A4 vs 1 Siswa per A4 */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Format Cetak:
          </span>
          <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100">
            <button
              type="button"
              onClick={() => setPrintLayout('two_per_sheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                printLayout === 'two_per_sheet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>2 Siswa / Lembar A4</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded-full font-semibold">
                Hemat Kertas 50%
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPrintLayout('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                printLayout === 'single'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1 Siswa / Lembar A4 (Standar)</span>
            </button>
          </div>
        </div>

        {/* View mode (Preview vs Raw HTML) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Tampilan Lembar</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('raw_html')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'raw_html'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Kode HTML</span>
          </button>
        </div>
      </div>

      {/* Navigation & Action Controls */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Student Selector & Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
            Kelas {activeClass}
          </span>

          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="p-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Siswa Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Primary Student Dropdown */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-500 font-medium">Siswa 1:</span>
            <select
              value={currentStudent.id}
              onChange={e => {
                onSelectStudentId(e.target.value);
                setPairedStudentId(null);
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white max-w-[210px] truncate"
            >
              {displayStudents.map((std) => (
                <option key={std.id} value={std.id}>
                  Absen {std.studentNo} - {std.name} {std.isGraded ? `· Nilai: ${std.finalGrade}` : '(Belum dinilai)'}
                </option>
              ))}
            </select>
          </div>

          {/* Secondary Paired Student Dropdown when in 2-per-page mode */}
          {printLayout === 'two_per_sheet' && (
            <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium">Siswa 2:</span>
              <select
                value={effectivePairedStudent?.id || ''}
                onChange={e => setPairedStudentId(e.target.value || null)}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white max-w-[210px] truncate"
              >
                <option value="">(Kosong / Tidak ada)</option>
                {displayStudents
                  .filter(std => std.id !== currentStudent.id)
                  .map((std) => (
                    <option key={std.id} value={std.id}>
                      Absen {std.studentNo} - {std.name} {std.isGraded ? `· Nilai: ${std.finalGrade}` : '(Belum dinilai)'}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= displayStudents.length - 1}
            className="p-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Siswa Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs text-slate-500 font-mono ml-1 tabular-nums">
            {currentIndex + 1} / {displayStudents.length}
          </span>
        </div>

        {/* Right: Actions (Ubah Nilai, Salin HTML, Download PDF, Cetak Semua, Cetak Halaman) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onEditStudent(currentStudent)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Ubah Nilai Siswa Ini"
          >
            <Edit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ubah Nilai</span>
          </button>

          <button
            type="button"
            onClick={handleCopyHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Salin Kode HTML Lembar Penilaian"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copied ? 'Tersalin!' : 'Salin HTML'}</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            title="Download Berkas PDF Langsung"
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>Download PDF {printLayout === 'two_per_sheet' ? '(2 Siswa)' : ''}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenBatchPrint(displayStudents)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            title={`Cetak Seluruh Siswa Kelas ${activeClass}`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Semua ({activeClass})</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            title="Cetak Halaman Ini (Ctrl + P)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak A4 (Ctrl+P)</span>
          </button>
        </div>
      </div>

      {/* Info Banner when 2 per sheet mode is active */}
      {printLayout === 'two_per_sheet' && (
        <div className="no-print bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Mode Hemat Kertas Aktif:</strong> Format didesain khusus pas 1 lembar kertas A4 portrait berisi <strong>2 siswa</strong> lengkap dengan garis gunting pemisah di tengah.
            </span>
          </div>
          <span className="font-semibold text-emerald-800 hidden sm:inline">
            A4 Portrait &bull; 2 Siswa / Lembar
          </span>
        </div>
      )}

      {/* Sheet Container */}
      {viewMode === 'preview' ? (
        <div className="print-page-wrapper bg-slate-200/70 p-2 sm:p-6 rounded-2xl flex justify-center overflow-x-auto">
          <div
            ref={sheetContainerRef}
            className={`shadow-lg bg-white ${
              printLayout === 'two_per_sheet'
                ? 'rubric-print-sheet-2up p-4 max-w-[820px] w-full'
                : 'rubric-print-sheet'
            }`}
            dangerouslySetInnerHTML={{ __html: rawHtml }}
          />
        </div>
      ) : (
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
            <span>Raw HTML Output ({printLayout === 'two_per_sheet' ? 'Ukuran A4 : 2 Siswa' : '1 Siswa Standar'})</span>
            <button
              type="button"
              onClick={handleCopyHtml}
              className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Semua</span>
            </button>
          </div>
          <pre className="whitespace-pre-wrap">{rawHtml}</pre>
        </div>
      )}

      {/* Helper Bar */}
      <div className="no-print bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-slate-900 block">
            Tips Cetak A4 Hemat Kertas:
          </span>
          <span className="text-[11px] text-slate-500">
            Saat dialog cetak browser (Ctrl + P) muncul, pastikan ukuran kertas dipilih <strong>A4</strong> dan margin <strong>Default</strong> atau <strong>Minimum</strong>.
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer shrink-0"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Atur Tanggal &amp; Kota Cetak</span>
        </button>
      </div>
    </div>
  );
};
