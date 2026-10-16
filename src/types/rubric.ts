/**
 * Data types for Rubrik Penilaian Proyek Buku Cerita Digital "Mengungkap Cerita di Balik Sebuah Pasar"
 * Kelas 7 SMP (Kelas 7A - 7G)
 */

export type AspectKeyA = 'A1' | 'A2' | 'A3' | 'A4';
export type AspectKeyB = 'B1' | 'B2' | 'B3' | 'B4';
export type AspectKey = AspectKeyA | AspectKeyB;

export interface AspectScores {
  A1: number; // 0 jika belum dinilai, 1 - 4 jika sudah dinilai
  A2: number;
  A3: number;
  A4: number;
  B1: number;
  B2: number;
  B3: number;
  B4: number;
}

export interface AspectEvaluations {
  A1: string;
  A2: string;
  A3: string;
  A4: string;
  B1: string;
  B2: string;
  B3: string;
  B4: string;
}

export type GradePredicate = 'A' | 'B' | 'C' | 'D' | '-';

export interface StudentScoreRecord {
  id: string;
  name: string;
  studentNo: string; // No. Absen
  className: string; // Kelas: 7A, 7B, 7C, 7D, 7E, 7F, 7G
  scores: AspectScores;
  evaluations: AspectEvaluations;
  isGraded: boolean; // false jika belum dinilai
  subtotalA: number; // Max 16
  subtotalB: number; // Max 16
  totalScore: number; // Max 32
  finalGrade: number; // Nilai utuh bilangan bulat (contoh: 80, 85, 100)
  finalGradeFraction: string; // Teks nilai utuh (contoh: "80" atau "-" jika belum dinilai)
  predicate: GradePredicate;
  predicateLabel: string; // 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan' | 'Belum Dinilai'
  createdAt: string;
  updatedAt: string;
}

export interface AspectCriterion {
  id: AspectKey;
  number: number;
  category: 'A' | 'B';
  categoryTitle: string;
  title: string;
  shortLabel: string;
  levels: {
    [key in 1 | 2 | 3 | 4]: {
      score: number;
      label: string;
      descriptor: string;
      defaultEvaluation: string;
    };
  };
}

export interface TeacherProfile {
  schoolName: string;
  cityName: string;
  dateString: string;
}

export type ActiveAppMode = 'interactive' | 'batch' | 'print';
