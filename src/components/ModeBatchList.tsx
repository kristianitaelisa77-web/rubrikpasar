import React, { useState, useMemo } from 'react';
import { StudentScoreRecord, AspectKey } from '../types/rubric';
import { parseBulkStudentList } from '../utils/textParser';
import { exportRecapToCSV } from '../utils/exportUtils';
import { calculateScores, getDefaultEvaluations, getFractionGrade } from '../utils/scoreCalculator';
import {
  UploadCloud,
  Printer,
  Trash2,
  Edit3,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Download,
  RotateCcw
} from 'lucide-react';

interface ModeBatchListProps {
  students: StudentScoreRecord[];
  activeClass: string;
  onUpdateStudent: (updatedStudent: StudentScoreRecord) => void;
  onAddMultipleStudents: (newStudents: StudentScoreRecord[]) => void;
  onEditStudent: (student: StudentScoreRecord) => void;
  onDeleteStudent: (studentId: string) => void;
  onNavigateToPrint: (studentId: string) => void;
  onOpenBatchPrint: (studentsToPrint: StudentScoreRecord[]) => void;
  onResetToSample: () => void;
}

export const ModeBatchList: React.FC<ModeBatchListProps> = ({
  students,
  activeClass,
  onUpdateStudent,
  onAddMultipleStudents,
  onEditStudent,
  onDeleteStudent,
  onNavigateToPrint,
  onOpenBatchPrint,
  onResetToSample,
}) => {
  const [showBatchInput, setShowBatchInput] = useState(false);
  const [batchRawText, setBatchRawText] = useState('');
  const [parseFeedback, setParseFeedback] = useState<{
    successCount: number;
    errors: string[];
  } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'absen' | 'name' | 'score_desc' | 'score_asc'>('absen');

  // Filter students for the active class tab
  const classStudents = useMemo(() => {
    return students.filter(s => s.className === activeClass);
  }, [students, activeClass]);

  const sampleCsvTemplate = `# Format: Nama, Absen, Kelas, A1, A2, A3, A4, B1, B2, B3, B4
Siswa Tambahan, 28, ${activeClass}, 4, 4, 3, 4, 4, 4, 4, 3`;

  // Process batch input
  const handleProcessBatch = () => {
    if (!batchRawText.trim()) {
      alert('Silakan tempelkan teks daftar nilai terlebih dahulu.');
      return;
    }

    const { records, errors } = parseBulkStudentList(batchRawText, activeClass);
    if (records.length > 0) {
      onAddMultipleStudents(records);
      setBatchRawText('');
    }

    setParseFeedback({
      successCount: records.length,
      errors,
    });
  };

  // Quick inline score change
  const handleInlineScoreChange = (student: StudentScoreRecord, key: AspectKey, val: number) => {
    const updatedScores = { ...student.scores, [key]: val };
    const hasAnyScore = Object.values(updatedScores).some(v => v > 0);
    const calc = calculateScores(updatedScores);
    const updatedEvaluations = getDefaultEvaluations(updatedScores);

    onUpdateStudent({
      ...student,
      scores: updatedScores,
      evaluations: updatedEvaluations,
      isGraded: hasAnyScore,
      subtotalA: calc.subtotalA,
      subtotalB: calc.subtotalB,
      totalScore: calc.totalScore,
      finalGrade: calc.finalGrade,
      finalGradeFraction: calc.finalGradeFraction,
      predicate: calc.predicate,
      predicateLabel: calc.predicateLabel,
      updatedAt: new Date().toISOString(),
    });
  };

  // Filtered & Sorted
  const filteredStudents = useMemo(() => {
    return classStudents
      .filter(s => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          s.name.toLowerCase().includes(query) ||
          s.studentNo.includes(query);

        let matchesStatus = true;
        if (selectedStatus === 'GRADED') matchesStatus = s.isGraded;
        if (selectedStatus === 'UNGRADED') matchesStatus = !s.isGraded;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'absen') {
          return a.studentNo.localeCompare(b.studentNo, undefined, { numeric: true });
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'score_desc') {
          return b.totalScore - a.totalScore;
        }
        if (sortBy === 'score_asc') {
          return a.totalScore - b.totalScore;
        }
        return 0;
      });
  }, [classStudents, searchQuery, selectedStatus, sortBy]);

  // Statistics KPIs for this active class
  const stats = useMemo(() => {
    const total = classStudents.length;
    const gradedList = classStudents.filter(s => s.isGraded);
    const gradedCount = gradedList.length;

    if (gradedCount === 0) {
      return { total, gradedCount, averageScore: '-', highestScore: '-', lowestScore: '-', predA: 0, predB: 0, predC: 0, predD: 0 };
    }

    const grades = gradedList.map(s => s.finalGrade);
    const sumGrades = grades.reduce((acc, curr) => acc + curr, 0);
    const avgGrade = Math.round(sumGrades / gradedCount);
    const averageScore = `${avgGrade}`;

    const maxGrade = Math.max(...grades);
    const minGrade = Math.min(...grades);
    const highestScore = `${maxGrade}`;
    const lowestScore = `${minGrade}`;

    const predA = gradedList.filter(s => s.predicate === 'A').length;
    const predB = gradedList.filter(s => s.predicate === 'B').length;
    const predC = gradedList.filter(s => s.predicate === 'C').length;
    const predD = gradedList.filter(s => s.predicate === 'D').length;

    return { total, gradedCount, averageScore, highestScore, lowestScore, predA, predB, predC, predD };
  }, [classStudents]);

  return (
    <div className="space-y-6">
      {/* Title & Batch Input Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Rekapitulasi Nilai</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-sm font-semibold">
              Kelas {activeClass}
            </span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Setting awal skor dalam keadaan kosong (-). Guru dapat memilih skor 1 - 4 langsung di kolom aspek untuk menilai siswa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBatchInput(!showBatchInput)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              showBatchInput
                ? 'bg-slate-900 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{showBatchInput ? 'Tutup Form Impor' : `Impor Nilai Kelas ${activeClass}`}</span>
          </button>
        </div>
      </div>

      {/* Batch Text Input Expandable Drawer */}
      {showBatchInput && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Impor Nilai Siswa untuk Kelas {activeClass}
              </h3>
              <p className="text-xs text-slate-500">
                Tempelkan nama dan nilai siswa (format CSV atau teks baris per baris).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBatchRawText(sampleCsvTemplate)}
              className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Muat Format Sampel
            </button>
          </div>

          <textarea
            rows={4}
            value={batchRawText}
            onChange={e => setBatchRawText(e.target.value)}
            placeholder={`Contoh: Nama, Absen, ${activeClass}, A1, A2, A3, A4, B1, B2, B3, B4`}
            className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleProcessBatch}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Simpan ke Kelas {activeClass}</span>
            </button>
          </div>

          {parseFeedback && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Berhasil mengimpor {parseFeedback.successCount} siswa!</span>
              </div>
              {parseFeedback.errors.length > 0 && (
                <div className="mt-1 text-rose-700 space-y-0.5">
                  <span className="font-semibold block">Catatan:</span>
                  <ul className="list-disc list-inside">
                    {parseFeedback.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Class Statistics KPIs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 block font-medium">Status Penilaian</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">{stats.gradedCount}</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-sm font-semibold font-mono text-slate-600 tabular-nums">{stats.total} dinilai</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">siswa Kelas {activeClass}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 block font-medium">Rata-rata Kelas</span>
          <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
            {stats.averageScore}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">skala 0 - 100</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 block font-medium">Tertinggi / Terendah</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold font-mono text-slate-900 tabular-nums">{stats.highestScore}</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-sm font-semibold font-mono text-slate-600 tabular-nums">{stats.lowestScore}</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">rentang nilai kelas</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 block font-medium">Predikat A</span>
          <span className="text-xl font-bold font-mono text-indigo-700 tabular-nums">
            {stats.predA}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">91 - 100</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 block font-medium">Predikat B</span>
          <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
            {stats.predB}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">81 - 90</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 block font-medium">Predikat C &amp; D</span>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold font-mono text-amber-700 tabular-nums">{stats.predC} C</span>
            <span className="text-xs text-slate-300">&middot;</span>
            <span className="text-base font-bold font-mono text-rose-700 tabular-nums">{stats.predD} D</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">perlu pendampingan</span>
        </div>
      </div>

      {/* Filter, Search & Action Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama / no. absen..."
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">Semua Siswa</option>
              <option value="GRADED">Sudah Dinilai</option>
              <option value="UNGRADED">Belum Dinilai</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="absen">Urut No. Absen</option>
              <option value="name">Urut Nama Siswa</option>
              <option value="score_desc">Nilai Tertinggi ke Terendah</option>
              <option value="score_asc">Nilai Terendah ke Tertinggi</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => exportRecapToCSV(filteredStudents, activeClass)}
            className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Download Spreadsheet Excel / CSV Kelas Ini"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenBatchPrint(filteredStudents)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
            title="Cetak Semua Lembar Siswa Kelas Ini Sekaligus"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Seluruh Kelas {activeClass} ({filteredStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Recapitulation Table with Fraction Scores */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-2 w-10 text-center">No</th>
                <th className="py-3 px-2 w-12 text-center">Absen</th>
                <th className="py-3 px-3 min-w-[210px]">Nama Lengkap Siswa</th>
                <th className="py-2 px-1 text-center bg-indigo-50/50" colSpan={4}>
                  <span className="block text-[11px] text-indigo-900 font-bold">A. Diskusi & Kerja Sama</span>
                  <span className="text-[10px] text-indigo-700 font-normal">A1 &middot; A2 &middot; A3 &middot; A4</span>
                </th>
                <th className="py-3 px-2 text-center font-mono text-indigo-700 bg-indigo-50/80 font-bold">
                  Sub A<br/><span className="text-[10px] text-indigo-500 font-normal">/ 16</span>
                </th>
                <th className="py-2 px-1 text-center bg-emerald-50/50" colSpan={4}>
                  <span className="block text-[11px] text-emerald-900 font-bold">B. Produk Buku Cerita</span>
                  <span className="text-[10px] text-emerald-700 font-normal">B1 &middot; B2 &middot; B3 &middot; B4</span>
                </th>
                <th className="py-3 px-2 text-center font-mono text-emerald-700 bg-emerald-50/80 font-bold">
                  Sub B<br/><span className="text-[10px] text-emerald-500 font-normal">/ 16</span>
                </th>
                <th className="py-3 px-2 text-center font-mono font-bold">
                  Total<br/><span className="text-[10px] text-slate-500 font-normal">/ 32</span>
                </th>
                <th className="py-3 px-3 text-center font-mono font-extrabold text-sm text-slate-900 bg-amber-50/30">
                  Nilai Akhir<br/><span className="text-[10px] text-slate-500 font-normal">(Utuh 0-100)</span>
                </th>
                <th className="py-3 px-2 text-center">Predikat</th>
                <th className="py-3 px-2 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={16} className="py-12 text-center text-slate-500">
                    Tidak ada siswa yang sesuai dengan filter di Kelas {activeClass}.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, index) => {
                  return (
                    <tr
                      key={std.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-2.5 px-2 text-center text-slate-400 font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-900">
                        {std.studentNo}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {std.name}
                      </td>

                      {/* A1, A2, A3, A4 Inline score dropdowns */}
                      {(['A1', 'A2', 'A3', 'A4'] as AspectKey[]).map(key => (
                        <td key={key} className="py-2 px-1 text-center bg-indigo-50/20">
                          <select
                            value={std.scores[key] || 0}
                            onChange={e => handleInlineScoreChange(std, key, parseInt(e.target.value, 10))}
                            className={`w-9 h-7 text-center font-mono font-bold text-xs border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ${
                              std.scores[key] > 0
                                ? 'bg-white text-slate-900 border-indigo-300'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            <option value={0}>-</option>
                            <option value={4}>4</option>
                            <option value={3}>3</option>
                            <option value={2}>2</option>
                            <option value={1}>1</option>
                          </select>
                        </td>
                      ))}

                      {/* Subtotal A */}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-indigo-700 bg-indigo-50/40 tabular-nums">
                        {std.isGraded ? std.subtotalA : '-'}
                      </td>

                      {/* B1, B2, B3, B4 Inline score dropdowns */}
                      {(['B1', 'B2', 'B3', 'B4'] as AspectKey[]).map(key => (
                        <td key={key} className="py-2 px-1 text-center bg-emerald-50/20">
                          <select
                            value={std.scores[key] || 0}
                            onChange={e => handleInlineScoreChange(std, key, parseInt(e.target.value, 10))}
                            className={`w-9 h-7 text-center font-mono font-bold text-xs border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                              std.scores[key] > 0
                                ? 'bg-white text-slate-900 border-emerald-300'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            <option value={0}>-</option>
                            <option value={4}>4</option>
                            <option value={3}>3</option>
                            <option value={2}>2</option>
                            <option value={1}>1</option>
                          </select>
                        </td>
                      ))}

                      {/* Subtotal B */}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-emerald-700 bg-emerald-50/40 tabular-nums">
                        {std.isGraded ? std.subtotalB : '-'}
                      </td>

                      {/* Total Score */}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-900 tabular-nums">
                        {std.isGraded ? std.totalScore : '-'}
                      </td>

                      {/* Nilai Akhir (Bilangan Bulat Utuh, e.g. 80, 85, 100) */}
                      <td className="py-2.5 px-3 text-center font-mono text-base font-extrabold text-slate-900 tabular-nums bg-amber-50/20">
                        {std.isGraded ? std.finalGrade : '-'}
                      </td>

                      {/* Predicate */}
                      <td className="py-2.5 px-2 text-center">
                        {std.isGraded ? (
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              std.predicate === 'A'
                                ? 'bg-emerald-100 text-emerald-800'
                                : std.predicate === 'B'
                                ? 'bg-blue-100 text-blue-800'
                                : std.predicate === 'C'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {std.predicate}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onNavigateToPrint(std.id)}
                            title="Lihat & Cetak Lembar Siswa"
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditStudent(std)}
                            title="Buka Rubrik Lengkap Siswa Ini"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus ${std.name} dari Kelas ${activeClass}?`)) {
                                onDeleteStudent(std.id);
                              }
                            }}
                            title="Hapus Siswa"
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Menampilkan {filteredStudents.length} siswa di Kelas {activeClass}. Skor awal berstatus belum dinilai (-).
          </span>
          <button
            type="button"
            onClick={onResetToSample}
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data Awal (Skor Kosong)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
