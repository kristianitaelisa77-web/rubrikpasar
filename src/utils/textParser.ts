import { AspectScores, StudentScoreRecord } from '../types/rubric';
import { calculateScores, getDefaultEvaluations } from './scoreCalculator';

export interface ParsedSingleResult {
  success: boolean;
  name?: string;
  studentNo?: string;
  className?: string;
  scores?: AspectScores;
  message?: string;
}

export function parseSingleStudentShorthand(input: string): ParsedSingleResult {
  if (!input || !input.trim()) {
    return { success: false, message: 'Teks input masih kosong.' };
  }

  const text = input.trim();

  // Extract scores for A: A=4,3,4,4 or A: 4,3,4,4 or A=4 3 4 4
  const aMatch = text.match(/A\s*[:=]\s*([1-4][,\s]+[1-4][,\s]+[1-4][,\s]+[1-4])/i);
  // Extract scores for B: B=4,4,3,4 or B: 4,4,3,4 or B=4 4 3 4
  const bMatch = text.match(/B\s*[:=]\s*([1-4][,\s]+[1-4][,\s]+[1-4][,\s]+[1-4])/i);

  let scores: AspectScores | undefined;

  if (aMatch && bMatch) {
    const aVals = aMatch[1].split(/[,\s]+/).map(v => parseInt(v.trim(), 10));
    const bVals = bMatch[1].split(/[,\s]+/).map(v => parseInt(v.trim(), 10));

    scores = {
      A1: clampNumber(aVals[0]),
      A2: clampNumber(aVals[1]),
      A3: clampNumber(aVals[2]),
      A4: clampNumber(aVals[3]),
      B1: clampNumber(bVals[0]),
      B2: clampNumber(bVals[1]),
      B3: clampNumber(bVals[2]),
      B4: clampNumber(bVals[3]),
    };
  }

  // Extract student details
  let name: string | undefined;
  let studentNo: string | undefined;
  let className: string | undefined;

  const absenMatch = text.match(/(?:Absen|No\.?\s*Absen|No)\s*[:=]?\s*(\d{1,2})/i);
  if (absenMatch) {
    studentNo = absenMatch[1].padStart(2, '0');
  }

  const kelasMatch = text.match(/(?:Kelas|Kls)\s*[:=]?\s*([0-9]{1,2}[A-Za-z]?|[A-Za-z0-9\-]+)/i);
  if (kelasMatch) {
    className = kelasMatch[1].toUpperCase();
  }

  const nameMatch = text.match(/(?:Nilai|Nama)?\s*([A-Za-z\s'’.]{3,35})\s+(?:Absen|Kelas|No|:)/i);
  if (nameMatch && nameMatch[1]) {
    const cleaned = nameMatch[1].replace(/^(?:Nilai|Nama)\s+/i, '').trim();
    if (cleaned.length > 1 && !/^(absen|kelas|nilai|proyek)$/i.test(cleaned)) {
      name = cleaned;
    }
  }

  if (!scores) {
    const eightNumbers = text.match(/([1-4])[,\s]+([1-4])[,\s]+([1-4])[,\s]+([1-4])[,\s]+([1-4])[,\s]+([1-4])[,\s]+([1-4])[,\s]+([1-4])/);
    if (eightNumbers) {
      scores = {
        A1: clampNumber(parseInt(eightNumbers[1], 10)),
        A2: clampNumber(parseInt(eightNumbers[2], 10)),
        A3: clampNumber(parseInt(eightNumbers[3], 10)),
        A4: clampNumber(parseInt(eightNumbers[4], 10)),
        B1: clampNumber(parseInt(eightNumbers[5], 10)),
        B2: clampNumber(parseInt(eightNumbers[6], 10)),
        B3: clampNumber(parseInt(eightNumbers[7], 10)),
        B4: clampNumber(parseInt(eightNumbers[8], 10)),
      };
    }
  }

  return {
    success: !!scores,
    name,
    studentNo,
    className,
    scores,
    message: scores ? 'Format nilai berhasil diurai.' : 'Format nilai belum sesuai. Contoh: "A=4,3,4,4; B=4,4,3,4"'
  };
}

export function parseBulkStudentList(rawText: string, defaultClass = '7A'): {
  records: StudentScoreRecord[];
  errors: string[];
} {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const records: StudentScoreRecord[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    if (line.startsWith('#') || line.startsWith('//') || /^No[,;\t]Nama/i.test(line) || /^Nama Siswa/i.test(line)) {
      return;
    }

    const lineNum = index + 1;
    const delimiter = line.includes('\t') ? '\t' : (line.includes(';') ? ';' : ',');
    const parts = line.split(delimiter).map(p => p.trim());

    if (parts.length >= 10) {
      let offset = 0;
      if (/^\d{1,3}$/.test(parts[0]) && isNaN(Number(parts[1]))) {
        offset = 1;
      }

      const name = parts[offset] || `Siswa ${lineNum}`;
      const studentNo = (parts[offset + 1] || `${lineNum}`).padStart(2, '0');
      const className = parts[offset + 2] || defaultClass;

      const a1 = parseInt(parts[offset + 3], 10);
      const a2 = parseInt(parts[offset + 4], 10);
      const a3 = parseInt(parts[offset + 5], 10);
      const a4 = parseInt(parts[offset + 6], 10);
      const b1 = parseInt(parts[offset + 7], 10);
      const b2 = parseInt(parts[offset + 8], 10);
      const b3 = parseInt(parts[offset + 9], 10);
      const b4 = parseInt(parts[offset + 10], 10);

      if ([a1, a2, a3, a4, b1, b2, b3, b4].some(isNaN)) {
        errors.push(`Baris ${lineNum}: Nilai skor harus angka 1 - 4 (${line})`);
        return;
      }

      const scores: AspectScores = {
        A1: clampNumber(a1),
        A2: clampNumber(a2),
        A3: clampNumber(a3),
        A4: clampNumber(a4),
        B1: clampNumber(b1),
        B2: clampNumber(b2),
        B3: clampNumber(b3),
        B4: clampNumber(b4),
      };

      const calc = calculateScores(scores);
      const evaluations = getDefaultEvaluations(scores);

      records.push({
        id: `std_${className}_${studentNo}_${Date.now()}_${lineNum}`,
        name,
        studentNo,
        className,
        isGraded: true,
        scores,
        evaluations,
        subtotalA: calc.subtotalA,
        subtotalB: calc.subtotalB,
        totalScore: calc.totalScore,
        finalGrade: calc.finalGrade,
        finalGradeFraction: calc.finalGradeFraction,
        predicate: calc.predicate,
        predicateLabel: calc.predicateLabel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    const parsed = parseSingleStudentShorthand(line);
    if (parsed.success && parsed.scores) {
      const name = parsed.name || `Siswa ${lineNum}`;
      const studentNo = parsed.studentNo || `${lineNum}`.padStart(2, '0');
      const className = parsed.className || defaultClass;

      const calc = calculateScores(parsed.scores);
      const evaluations = getDefaultEvaluations(parsed.scores);

      records.push({
        id: `std_${className}_${studentNo}_${Date.now()}_${lineNum}`,
        name,
        studentNo,
        className,
        isGraded: true,
        scores: parsed.scores,
        evaluations,
        subtotalA: calc.subtotalA,
        subtotalB: calc.subtotalB,
        totalScore: calc.totalScore,
        finalGrade: calc.finalGrade,
        finalGradeFraction: calc.finalGradeFraction,
        predicate: calc.predicate,
        predicateLabel: calc.predicateLabel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      errors.push(`Baris ${lineNum}: Format tidak dikenali ("${line.substring(0, 40)}...")`);
    }
  });

  return { records, errors };
}

function clampNumber(num: number): number {
  if (isNaN(num)) return 1;
  if (num > 4) return 4;
  if (num < 1) return 1;
  return num;
}
