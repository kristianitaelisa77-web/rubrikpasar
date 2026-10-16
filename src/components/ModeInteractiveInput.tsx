import React, { useState, useEffect } from 'react';
import {
  AspectScores,
  AspectEvaluations,
  StudentScoreRecord,
  AspectKey,
} from '../types/rubric';
import { RUBRIC_CRITERIA, ASPECTS_A, ASPECTS_B } from '../data/rubricCriteria';
import { calculateScores, getDefaultEvaluations } from '../utils/scoreCalculator';
import { parseSingleStudentShorthand } from '../utils/textParser';
import {
  Save,
  Printer,
  Zap,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Plus,
  Users
} from 'lucide-react';

interface ModeInteractiveInputProps {
  studentsInClass: StudentScoreRecord[];
  activeClass: string;
  onSaveStudent: (student: StudentScoreRecord) => void;
  onNavigateToPrint: (studentId: string) => void;
  selectedStudent: StudentScoreRecord | null;
  onSelectStudent: (student: StudentScoreRecord) => void;
  onOpenRubricGuide: () => void;
}

export const ModeInteractiveInput: React.FC<ModeInteractiveInputProps> = ({
  studentsInClass,
  activeClass,
  onSaveStudent,
  onNavigateToPrint,
  selectedStudent,
  onSelectStudent,
  onOpenRubricGuide,
}) => {
  const [name, setName] = useState('');
  const [studentNo, setStudentNo] = useState('');
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Scores state: 0 means unselected
  const [scores, setScores] = useState<AspectScores>({
    A1: 0,
    A2: 0,
    A3: 0,
    A4: 0,
    B1: 0,
    B2: 0,
    B3: 0,
    B4: 0,
  });

  const [evaluations, setEvaluations] = useState<AspectEvaluations>({
    A1: '',
    A2: '',
    A3: '',
    A4: '',
    B1: '',
    B2: '',
    B3: '',
    B4: '',
  });

  // Shorthand text input
  const [shorthandText, setShorthandText] = useState('');
  const [shorthandFeedback, setShorthandFeedback] = useState<string | null>(null);

  // Notification alert
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Sync with selected student
  useEffect(() => {
    if (selectedStudent) {
      setCurrentId(selectedStudent.id);
      setName(selectedStudent.name);
      setStudentNo(selectedStudent.studentNo);
      setScores(selectedStudent.scores);
      setEvaluations(selectedStudent.evaluations);
      if (selectedStudent.isGraded) {
        setShorthandText(`Nilai ${selectedStudent.name} Absen ${selectedStudent.studentNo} Kelas ${activeClass}: A=${selectedStudent.scores.A1},${selectedStudent.scores.A2},${selectedStudent.scores.A3},${selectedStudent.scores.A4}; B=${selectedStudent.scores.B1},${selectedStudent.scores.B2},${selectedStudent.scores.B3},${selectedStudent.scores.B4}`);
      } else {
        setShorthandText('');
      }
    } else if (studentsInClass.length > 0) {
      onSelectStudent(studentsInClass[0]);
    } else {
      handleNewStudent();
    }
  }, [selectedStudent, activeClass]);

  // Derived calculation
  const calculation = calculateScores(scores);

  // Handle score change
  const handleScoreChange = (aspectKey: AspectKey, newScore: number) => {
    const updatedScores = { ...scores, [aspectKey]: newScore };
    setScores(updatedScores);

    const defaultEval = RUBRIC_CRITERIA[aspectKey].levels[newScore as 1 | 2 | 3 | 4].defaultEvaluation;
    setEvaluations(prev => ({
      ...prev,
      [aspectKey]: defaultEval,
    }));
  };

  // Handle evaluation text edit
  const handleEvaluationChange = (aspectKey: AspectKey, val: string) => {
    setEvaluations(prev => ({
      ...prev,
      [aspectKey]: val,
    }));
  };

  // Quick apply shorthand text
  const handleApplyShorthand = () => {
    const parsed = parseSingleStudentShorthand(shorthandText);
    if (parsed.success && parsed.scores) {
      if (parsed.name) setName(parsed.name);
      if (parsed.studentNo) setStudentNo(parsed.studentNo);

      setScores(parsed.scores);
      setEvaluations(getDefaultEvaluations(parsed.scores));
      setShorthandFeedback('Berhasil mengurai nilai shorthand!');
    } else {
      setShorthandFeedback(parsed.message || 'Gagal mengurai teks shorthand.');
    }
    setTimeout(() => setShorthandFeedback(null), 3000);
  };

  const handleNewStudent = () => {
    const nextNo = (studentsInClass.length + 1).toString().padStart(2, '0');
    setCurrentId(null);
    setName('');
    setStudentNo(nextNo);
    setScores({ A1: 0, A2: 0, A3: 0, A4: 0, B1: 0, B2: 0, B3: 0, B4: 0 });
    setEvaluations({ A1: '', A2: '', A3: '', A4: '', B1: '', B2: '', B3: '', B4: '' });
  };

  // Save student
  const handleSave = (andPrint = false) => {
    if (!name.trim()) {
      alert('Mohon masukkan nama siswa.');
      return;
    }

    const hasAnyScore = Object.values(scores).some(v => v > 0);

    const newRecord: StudentScoreRecord = {
      id: currentId || `std_${activeClass}_${studentNo || Date.now()}`,
      name: name.trim(),
      studentNo: studentNo.trim() || '01',
      className: activeClass,
      isGraded: hasAnyScore,
      scores,
      evaluations,
      subtotalA: calculation.subtotalA,
      subtotalB: calculation.subtotalB,
      totalScore: calculation.totalScore,
      finalGrade: calculation.finalGrade,
      finalGradeFraction: calculation.finalGradeFraction,
      predicate: calculation.predicate,
      predicateLabel: calculation.predicateLabel,
      createdAt: selectedStudent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveStudent(newRecord);
    setSavedSuccess(`Nilai ${newRecord.name} (Kelas ${activeClass}) tersimpan!`);

    if (andPrint) {
      setTimeout(() => {
        onNavigateToPrint(newRecord.id);
      }, 300);
    } else {
      setTimeout(() => {
        setSavedSuccess(null);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Instructions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Input Nilai Siswa</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-sm font-semibold">
              Kelas {activeClass}
            </span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Klik nama siswa di bilah kiri, lalu pilih skor aspek 1 - 4. Nilai otomatis dihitung sebagai pecahan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenRubricGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>Pedoman Rubrik Lengkap</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Roster for this Class */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daftar Siswa ({studentsInClass.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={handleNewStudent}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Siswa</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
            {studentsInClass.map((std) => {
              const isSelected = std.id === currentId;
              return (
                <button
                  key={std.id}
                  type="button"
                  onClick={() => onSelectStudent(std)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/20'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-500 w-5 shrink-0 text-center">
                      {std.studentNo}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {std.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {std.isGraded ? (
                      <>
                        <span className="text-xs font-bold font-mono text-slate-900 tabular-nums">
                          {std.finalGrade}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
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
                      </>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 italic">
                        Belum dinilai
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Grading Deck & Form */}
        <div className="lg:col-span-8 space-y-5">
          {/* Shorthand Express Box */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Input Cepat Shorthand
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Format: A=4,3,4,4; B=4,4,3,4
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={shorthandText}
                onChange={e => setShorthandText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyShorthand();
                  }
                }}
                placeholder="Contoh: A=4,3,4,4; B=4,4,3,4"
                className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={handleApplyShorthand}
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Terapkan</span>
              </button>
            </div>
            {shorthandFeedback && (
              <p className="text-xs text-amber-300 mt-1 font-medium">
                {shorthandFeedback}
              </p>
            )}
          </div>

          {/* Student Identity Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs items-center">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  No. Absen
                </label>
                <input
                  type="text"
                  value={studentNo}
                  onChange={e => setStudentNo(e.target.value)}
                  placeholder="01"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-slate-900 text-center"
                />
              </div>

              <div className="sm:col-span-7">
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: AARON LEANDER SUSANTO"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">
                  Kelas
                </label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 text-center">
                  Kelas {activeClass}
                </div>
              </div>
            </div>
          </div>

          {/* Live Calculation Bar */}
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase tracking-wider">
                    Subtotal A (Diskusi)
                  </span>
                  <span className="text-base font-bold font-mono text-indigo-300">
                    {calculation.isGraded ? calculation.subtotalA : '-'} <span className="text-xs text-slate-400">/ 16</span>
                  </span>
                </div>

                <div className="h-7 w-px bg-slate-700" />

                <div>
                  <span className="block text-[11px] text-slate-400 uppercase tracking-wider">
                    Subtotal B (Canva)
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-300">
                    {calculation.isGraded ? calculation.subtotalB : '-'} <span className="text-xs text-slate-400">/ 16</span>
                  </span>
                </div>

                <div className="h-7 w-px bg-slate-700" />

                <div>
                  <span className="block text-[11px] text-slate-400 uppercase tracking-wider">
                    Total Skor
                  </span>
                  <span className="text-base font-bold font-mono text-amber-300">
                    {calculation.isGraded ? calculation.totalScore : '-'} <span className="text-xs text-slate-400">/ 32</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-[11px] text-slate-400 uppercase tracking-wider">
                    Nilai Akhir
                  </span>
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-2xl font-extrabold font-mono text-white tracking-wide">
                      {calculation.isGraded ? calculation.finalGrade : '-'}
                    </span>
                    {calculation.isGraded && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {calculation.predicate} &middot; {calculation.predicateLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Lembar</span>
                  </button>
                </div>
              </div>
            </div>

            {savedSuccess && (
              <div className="mt-2.5 pt-2 border-t border-slate-800 text-xs text-emerald-300 flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>{savedSuccess}</span>
              </div>
            )}
          </div>

          {/* Rubric Scoring Grids */}
          {/* Kategori A */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  A
                </span>
                <span className="text-xs font-bold text-slate-900">
                  A. Rubrik Penilaian Diskusi & Kerja Sama Kelompok (Maks 16)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Subtotal: {calculation.isGraded ? calculation.subtotalA : '-'} / 16
              </span>
            </div>

            <div className="p-4 space-y-4">
              {ASPECTS_A.map(aspectKey => {
                const crit = RUBRIC_CRITERIA[aspectKey];
                const currentScore = scores[aspectKey];
                const currentDesc = currentScore ? crit.levels[currentScore as 1 | 2 | 3 | 4] : null;

                return (
                  <div key={crit.id} className="pb-3.5 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {crit.number}. {crit.title}
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium">
                        Skor: {currentScore ? (
                          <><strong className="text-indigo-600">{currentScore}</strong> ({currentDesc?.label})</>
                        ) : (
                          <span className="text-slate-400 italic">Belum dipilih</span>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      {[4, 3, 2, 1].map(lvl => {
                        const isSelected = currentScore === lvl;
                        const lvlData = crit.levels[lvl as 1 | 2 | 3 | 4];

                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleScoreChange(aspectKey, lvl)}
                            className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400/20'
                                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={`text-xs font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>
                                Skor {lvl}
                              </span>
                              <span className={`text-[10px] px-1 py-0.2 rounded ${isSelected ? 'bg-indigo-200 text-indigo-900 font-semibold' : 'text-slate-500'}`}>
                                {lvlData.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">
                              {lvlData.descriptor}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      value={evaluations[aspectKey]}
                      onChange={e => handleEvaluationChange(aspectKey, e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                      placeholder="Catatan refleksi evaluasi..."
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kategori B */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  B
                </span>
                <span className="text-xs font-bold text-slate-900">
                  B. Rubrik Penilaian Produk Buku Cerita Digital Canva (Maks 16)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Subtotal: {calculation.isGraded ? calculation.subtotalB : '-'} / 16
              </span>
            </div>

            <div className="p-4 space-y-4">
              {ASPECTS_B.map(aspectKey => {
                const crit = RUBRIC_CRITERIA[aspectKey];
                const currentScore = scores[aspectKey];
                const currentDesc = currentScore ? crit.levels[currentScore as 1 | 2 | 3 | 4] : null;

                return (
                  <div key={crit.id} className="pb-3.5 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {crit.number}. {crit.title}
                      </span>
                      <span className="text-[11px] text-slate-600 font-medium">
                        Skor: {currentScore ? (
                          <><strong className="text-emerald-600">{currentScore}</strong> ({currentDesc?.label})</>
                        ) : (
                          <span className="text-slate-400 italic">Belum dipilih</span>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      {[4, 3, 2, 1].map(lvl => {
                        const isSelected = currentScore === lvl;
                        const lvlData = crit.levels[lvl as 1 | 2 | 3 | 4];

                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleScoreChange(aspectKey, lvl)}
                            className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/20'
                                : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={`text-xs font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-800'}`}>
                                Skor {lvl}
                              </span>
                              <span className={`text-[10px] px-1 py-0.2 rounded ${isSelected ? 'bg-emerald-200 text-emerald-900 font-semibold' : 'text-slate-500'}`}>
                                {lvlData.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">
                              {lvlData.descriptor}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      value={evaluations[aspectKey]}
                      onChange={e => handleEvaluationChange(aspectKey, e.target.value)}
                      className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50/50"
                      placeholder="Catatan refleksi evaluasi..."
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Save & Print Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Simpan Nilai</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Simpan & Buka Lembar Cetak</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
