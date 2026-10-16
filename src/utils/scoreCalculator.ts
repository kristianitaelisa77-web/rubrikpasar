import { AspectEvaluations, AspectScores, GradePredicate } from '../types/rubric';
import { RUBRIC_CRITERIA } from '../data/rubricCriteria';

/**
 * Mengubah nilai menjadi format bilangan bulat utuh (contoh: 80, 85, 100 tanpa koma atau pecahan)
 */
export function getRoundedWholeGrade(totalScore: number): number {
  if (totalScore <= 0) return 0;
  // Rumus: (Total Skor / 32) * 100, dibulatkan ke bilangan bulat terdekat
  return Math.round((totalScore / 32) * 100);
}

// Tetap sediakan untuk kompatibilitas jika dipanggil
export function getFractionGrade(totalScore: number): string {
  if (totalScore <= 0) return '-';
  return `${getRoundedWholeGrade(totalScore)}`;
}

export function calculateScores(scores: AspectScores) {
  const allZero =
    !scores.A1 && !scores.A2 && !scores.A3 && !scores.A4 &&
    !scores.B1 && !scores.B2 && !scores.B3 && !scores.B4;

  if (allZero) {
    return {
      subtotalA: 0,
      subtotalB: 0,
      totalScore: 0,
      finalGrade: 0,
      finalGradeFraction: '-',
      predicate: '-' as GradePredicate,
      predicateLabel: 'Belum Dinilai',
      isGraded: false
    };
  }

  const subtotalA = (scores.A1 || 0) + (scores.A2 || 0) + (scores.A3 || 0) + (scores.A4 || 0);
  const subtotalB = (scores.B1 || 0) + (scores.B2 || 0) + (scores.B3 || 0) + (scores.B4 || 0);
  const totalScore = subtotalA + subtotalB;
  
  // Rumus: (Total Skor / 32) * 100 -> dibulatkan menjadi nilai utuh (contoh: 80, bukan 81.25 atau pecahan)
  const finalGrade = Math.round((totalScore / 32) * 100);
  const finalGradeFraction = `${finalGrade}`;

  let predicate: GradePredicate = 'D';
  let predicateLabel = 'Perlu Bimbingan';

  if (finalGrade >= 91) {
    predicate = 'A';
    predicateLabel = 'Sangat Baik';
  } else if (finalGrade >= 81) {
    predicate = 'B';
    predicateLabel = 'Baik';
  } else if (finalGrade >= 71) {
    predicate = 'C';
    predicateLabel = 'Cukup';
  } else {
    predicate = 'D';
    predicateLabel = 'Perlu Bimbingan';
  }

  return {
    subtotalA,
    subtotalB,
    totalScore,
    finalGrade,
    finalGradeFraction,
    predicate,
    predicateLabel,
    isGraded: true
  };
}

export function getDefaultEvaluations(scores: AspectScores): AspectEvaluations {
  return {
    A1: scores.A1 ? RUBRIC_CRITERIA.A1.levels[clampScore(scores.A1)].defaultEvaluation : '',
    A2: scores.A2 ? RUBRIC_CRITERIA.A2.levels[clampScore(scores.A2)].defaultEvaluation : '',
    A3: scores.A3 ? RUBRIC_CRITERIA.A3.levels[clampScore(scores.A3)].defaultEvaluation : '',
    A4: scores.A4 ? RUBRIC_CRITERIA.A4.levels[clampScore(scores.A4)].defaultEvaluation : '',
    B1: scores.B1 ? RUBRIC_CRITERIA.B1.levels[clampScore(scores.B1)].defaultEvaluation : '',
    B2: scores.B2 ? RUBRIC_CRITERIA.B2.levels[clampScore(scores.B2)].defaultEvaluation : '',
    B3: scores.B3 ? RUBRIC_CRITERIA.B3.levels[clampScore(scores.B3)].defaultEvaluation : '',
    B4: scores.B4 ? RUBRIC_CRITERIA.B4.levels[clampScore(scores.B4)].defaultEvaluation : '',
  };
}

function clampScore(val: number): 1 | 2 | 3 | 4 {
  if (val >= 4) return 4;
  if (val === 3) return 3;
  if (val === 2) return 2;
  return 1;
}
