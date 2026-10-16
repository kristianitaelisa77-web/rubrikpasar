import React, { useState, useEffect, useMemo } from 'react';
import { StudentScoreRecord, TeacherProfile, ActiveAppMode } from './types/rubric';
import { INITIAL_STUDENTS, INITIAL_CLASSES } from './data/sampleStudents';
import { calculateScores } from './utils/scoreCalculator';
import { Header } from './components/Header';
import { ClassTabBar } from './components/ClassTabBar';
import { ModeInteractiveInput } from './components/ModeInteractiveInput';
import { ModeBatchList } from './components/ModeBatchList';
import { ModePrintSheet } from './components/ModePrintSheet';
import { RubricGuideModal } from './components/RubricGuideModal';
import { SettingsModal } from './components/SettingsModal';
import { BatchPrintModal } from './components/BatchPrintModal';

const STORAGE_KEY_STUDENTS = 'rubric_students_v6';
const STORAGE_KEY_PROFILE = 'rubric_teacher_profile_v6';
const STORAGE_KEY_CLASS = 'rubric_active_class_v6';

export default function App() {
  // Mode State
  const [currentMode, setCurrentMode] = useState<ActiveAppMode>('interactive');

  // Active Class Tab State (7A, 7B, 7C, 7D, 7E, 7F, 7G)
  const [activeClass, setActiveClass] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_CLASS) || '7A';
  });

  // Students State
  const [students, setStudents] = useState<StudentScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Re-calculate grades to ensure clean whole numbers (contoh: 80)
          return parsed.map((std: StudentScoreRecord) => {
            if (std.isGraded && std.scores) {
              const calc = calculateScores(std.scores);
              return { ...std, ...calc };
            }
            return std;
          });
        }
      }
    } catch (e) {
      console.error('Failed to load students from localStorage', e);
    }
    return INITIAL_STUDENTS;
  });

  // Selected Student for Mode 1 (Editing)
  const [selectedStudent, setSelectedStudent] = useState<StudentScoreRecord | null>(null);

  // Selected Student for Mode 3 (Print)
  const [selectedPrintStudentId, setSelectedPrintStudentId] = useState<string | null>(null);

  // Teacher Profile State (Without teacher name and NIP as requested)
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    }
    return {
      teacherName: '',
      nip: '',
      schoolName: 'SMP Kelas 7',
      cityName: 'Surabaya',
      dateString: '14 Oktober 2026',
    };
  });

  // Modals
  const [isRubricGuideOpen, setIsRubricGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [batchPrintData, setBatchPrintData] = useState<StudentScoreRecord[] | null>(null);

  // Save active class to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLASS, activeClass);
  }, [activeClass]);

  // Sync students to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(teacherProfile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [teacherProfile]);

  // Available classes list
  const availableClasses = useMemo(() => {
    const set = new Set<string>(INITIAL_CLASSES);
    students.forEach(s => set.add(s.className));
    return Array.from(set).sort();
  }, [students]);

  // Students count grouped by class
  const studentCountsByClass = useMemo(() => {
    const map: Record<string, number> = {};
    availableClasses.forEach(cls => {
      map[cls] = 0;
    });
    students.forEach(s => {
      map[s.className] = (map[s.className] || 0) + 1;
    });
    return map;
  }, [availableClasses, students]);

  // Filter students for the active class
  const studentsInActiveClass = useMemo(() => {
    return students
      .filter(s => s.className === activeClass)
      .sort((a, b) => a.studentNo.localeCompare(b.studentNo, undefined, { numeric: true }));
  }, [students, activeClass]);

  // Auto pick first student when activeClass changes
  useEffect(() => {
    if (studentsInActiveClass.length > 0) {
      const match = studentsInActiveClass.find(s => s.id === selectedStudent?.id);
      if (!match) {
        setSelectedStudent(studentsInActiveClass[0]);
        setSelectedPrintStudentId(studentsInActiveClass[0].id);
      }
    } else {
      setSelectedStudent(null);
      setSelectedPrintStudentId(null);
    }
  }, [activeClass, studentsInActiveClass]);

  // Handler: Save or Update Single Student
  const handleSaveStudent = (record: StudentScoreRecord) => {
    setStudents(prev => {
      const idx = prev.findIndex(s => s.id === record.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = record;
        return copy;
      } else {
        return [...prev, record];
      }
    });
    setSelectedStudent(record);
    setSelectedPrintStudentId(record.id);
  };

  // Handler: Update student from inline table edit
  const handleUpdateStudent = (updatedStudent: StudentScoreRecord) => {
    setStudents(prev => {
      const idx = prev.findIndex(s => s.id === updatedStudent.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedStudent;
        return copy;
      }
      return prev;
    });
  };

  // Handler: Add Multiple Students from Batch Mode
  const handleAddMultipleStudents = (newRecords: StudentScoreRecord[]) => {
    setStudents(prev => {
      const existingMap = new Map<string, StudentScoreRecord>();
      prev.forEach(s => existingMap.set(`${s.className}_${s.studentNo}`, s));

      newRecords.forEach(s => {
        existingMap.set(`${s.className}_${s.studentNo}`, s);
      });

      return Array.from(existingMap.values());
    });
  };

  // Handler: Delete Student
  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    if (selectedStudent?.id === studentId) {
      const remaining = studentsInActiveClass.filter(s => s.id !== studentId);
      setSelectedStudent(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Handler: Navigate to Mode 3 Print
  const handleNavigateToPrint = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setActiveClass(student.className);
    }
    setSelectedPrintStudentId(studentId);
    setCurrentMode('print');
  };

  // Handler: Edit student in Mode 1
  const handleEditStudent = (student: StudentScoreRecord) => {
    setActiveClass(student.className);
    setSelectedStudent(student);
    setCurrentMode('interactive');
  };

  // Handler: Reset to Sample
  const handleResetToSample = () => {
    if (confirm('Kembalikan data siswa ke roster awal Kelas 7A - 7G?')) {
      const initial = INITIAL_STUDENTS;
      setStudents(initial);
      setActiveClass('7G');
      setSelectedStudent(initial.find(s => s.className === '7G') || initial[0]);
      setSelectedPrintStudentId(initial.find(s => s.className === '7G')?.id || initial[0].id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 3-Zone Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onOpenRubricGuide={() => setIsRubricGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalStudents={students.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Prominent Class Tabs 7A - 7G */}
        <ClassTabBar
          availableClasses={availableClasses}
          activeClass={activeClass}
          onSelectClass={setActiveClass}
          studentCountsByClass={studentCountsByClass}
        />

        {currentMode === 'interactive' && (
          <ModeInteractiveInput
            studentsInClass={studentsInActiveClass}
            activeClass={activeClass}
            onSaveStudent={handleSaveStudent}
            onNavigateToPrint={handleNavigateToPrint}
            selectedStudent={selectedStudent}
            onSelectStudent={setSelectedStudent}
            onOpenRubricGuide={() => setIsRubricGuideOpen(true)}
          />
        )}

        {currentMode === 'batch' && (
          <ModeBatchList
            students={students}
            activeClass={activeClass}
            onUpdateStudent={handleUpdateStudent}
            onAddMultipleStudents={handleAddMultipleStudents}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onNavigateToPrint={handleNavigateToPrint}
            onOpenBatchPrint={data => setBatchPrintData(data)}
            onResetToSample={handleResetToSample}
          />
        )}

        {currentMode === 'print' && (
          <ModePrintSheet
            students={students}
            activeClass={activeClass}
            selectedStudentId={selectedPrintStudentId}
            onSelectStudentId={id => setSelectedPrintStudentId(id)}
            teacherProfile={teacherProfile}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onEditStudent={handleEditStudent}
            onOpenBatchPrint={data => setBatchPrintData(data)}
          />
        )}
      </main>

      {/* Footer - Hidden on print */}
      <footer className="no-print mt-auto py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <p>
          Rubrik Penilaian Sumatif Proyek Buku Cerita Digital &ldquo;Mengungkap Cerita di Balik Sebuah Pasar&rdquo; &middot; Kelas 7 SMP &middot; TA 2026/2027
        </p>
      </footer>

      {/* Modals */}
      <RubricGuideModal
        isOpen={isRubricGuideOpen}
        onClose={() => setIsRubricGuideOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={teacherProfile}
        onSaveProfile={setTeacherProfile}
      />

      {batchPrintData && (
        <BatchPrintModal
          isOpen={true}
          onClose={() => setBatchPrintData(null)}
          students={batchPrintData}
          teacherProfile={teacherProfile}
        />
      )}
    </div>
  );
}
