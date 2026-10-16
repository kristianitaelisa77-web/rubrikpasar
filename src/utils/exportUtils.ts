import { StudentScoreRecord, TeacherProfile } from '../types/rubric';
import html2pdf from 'html2pdf.js';

/**
 * Generate Standard 1 Student Full Page HTML
 */
export function generatePrintHtml(
  student: StudentScoreRecord,
  profile: TeacherProfile
): string {
  const dateLocation = `${profile.cityName || 'Surabaya'}, ${profile.dateString || '.................... 2026'}`;
  const isGraded = student.isGraded;

  const scoreA1 = isGraded && student.scores.A1 ? `${student.scores.A1}` : '-';
  const scoreA2 = isGraded && student.scores.A2 ? `${student.scores.A2}` : '-';
  const scoreA3 = isGraded && student.scores.A3 ? `${student.scores.A3}` : '-';
  const scoreA4 = isGraded && student.scores.A4 ? `${student.scores.A4}` : '-';

  const scoreB1 = isGraded && student.scores.B1 ? `${student.scores.B1}` : '-';
  const scoreB2 = isGraded && student.scores.B2 ? `${student.scores.B2}` : '-';
  const scoreB3 = isGraded && student.scores.B3 ? `${student.scores.B3}` : '-';
  const scoreB4 = isGraded && student.scores.B4 ? `${student.scores.B4}` : '-';

  const subtotalADisplay = isGraded ? `${student.subtotalA} / 16` : '- / 16';
  const subtotalBDisplay = isGraded ? `${student.subtotalB} / 16` : '- / 16';
  const totalScoreDisplay = isGraded ? `${student.totalScore} / 32` : '- / 32';
  // Nilai Akhir bulat utuh tanpa koma atau pecahan (contoh: 80)
  const gradeDisplay = isGraded ? `${student.finalGrade}` : '-';

  return `<div style="border: 2px solid #000; padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: auto; background-color: #ffffff; color: #000000; box-sizing: border-box;">
  <h2 style="text-align: center; margin-bottom: 5px; font-size: 18px; font-weight: bold; letter-spacing: 0.5px;">RUBRIK PENILAIAN SUMATIF PROYEK BUKU CERITA DIGITAL</h2>
  <h3 style="text-align: center; margin-top: 0; color: #333333; font-size: 15px; font-weight: 600;">"Mengungkap Cerita di Balik Sebuah Pasar"</h3>
  <hr style="border: 1px solid #000; margin: 12px 0;">
  
  <table style="width: 100%; margin-bottom: 15px; font-weight: bold; font-size: 13px;">
    <tr>
      <td style="width: 40%;">Nama : ${escapeHtml(student.name)}</td>
      <td style="width: 30%;">Kelas : ${escapeHtml(student.className)}</td>
      <td style="width: 30%; text-align: right;">No. Absen : ${escapeHtml(student.studentNo)}</td>
    </tr>
  </table>

  <h4 style="margin: 12px 0 6px 0; font-size: 13px; font-weight: bold;">A. RUBRIK PENILAIAN DISKUSI & KERJA SAMA KELOMPOK</h4>
  <table border="1" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 12px; border-color: #000;">
    <thead>
      <tr style="background-color: #f2f2f2; font-weight: bold;">
        <th style="width: 35px; padding: 6px;">No</th>
        <th style="width: 220px; padding: 6px; text-align: left;">Aspek Penilaian</th>
        <th style="width: 80px; padding: 6px;">Skor (1-4)</th>
        <th style="padding: 6px; text-align: left;">Catatan / Evaluasi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 6px;">1</td>
        <td style="text-align: left; padding: 6px; font-weight: 500;">Kerja Sama Kelompok</td>
        <td style="padding: 6px; font-weight: bold;">${scoreA1}</td>
        <td style="text-align: left; padding: 6px;">${escapeHtml(student.evaluations.A1 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 6px;">2</td>
        <td style="text-align: left; padding: 6px; font-weight: 500;">Peran Individu & Responsibilitas</td>
        <td style="padding: 6px; font-weight: bold;">${scoreA2}</td>
        <td style="text-align: left; padding: 6px;">${escapeHtml(student.evaluations.A2 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 6px;">3</td>
        <td style="text-align: left; padding: 6px; font-weight: 500;">Manajemen Waktu</td>
        <td style="padding: 6px; font-weight: bold;">${scoreA3}</td>
        <td style="text-align: left; padding: 6px;">${escapeHtml(student.evaluations.A3 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 6px;">4</td>
        <td style="text-align: left; padding: 6px; font-weight: 500;">Komunikasi & Solusi</td>
        <td style="padding: 6px; font-weight: bold;">${scoreA4}</td>
        <td style="text-align: left; padding: 6px;">${escapeHtml(student.evaluations.A4 || '-')}</td>
      </tr>
      <tr style="font-weight: bold; background-color: #fafafa;">
        <td colspan="2" style="text-align: right; padding: 6px;">Subtotal Diskusi & Kerja Sama (A):</td>
        <td style="padding: 6px; font-size: 13px;">${subtotalADisplay}</td>
        <td style="text-align: center; padding: 6px; color: #666;">-</td>
      </tr>
    </tbody>
  </table>

  <h4 style="margin-top: 14px; margin-bottom: 6px; font-size: 13px; font-weight: bold;">B. RUBRIK PENILAIAN PRODUK BUKU CERITA DIGITAL (CANVA)</h4>
  <table border="1" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 12px; border-color: #000;">
    <thead>
      <tr style="background-color: #f2f2f2; font-weight: bold;">
        <th style="width: 35px; padding: 6px;">No</th>
        <th style="width: 220px; padding: 6px; text-align: left;">Aspek Penilaian</th>
        <th style="width: 80px; padding: 6px;">Skor (1-4)</th>
        <th style="padding: 6px; text-align: left;">Catatan / Evaluasi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 6px;">1</td>
        <td style="text-align: left; padding: 6px; font-weight: 500;">Story Flow & Narasi</td>
        <td style="padding: 6px; font-weight: bold;">${scoreB1}</td>
        <td style="text-align: left; padding: 6px;">${escapeHtml(student.evaluations.B1 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 6px;">2</td>
        <td style="text-align: left; padding: 6px; font-weight: 500;">Kedalaman Informasi IPS</td>
        <td style="padding: 6px; font-weight: bold;">${scoreB2}</td>
        <td style="text-align: left; padding: 6px;">${escapeHtml(student.evaluations.B2 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 6px;">3</td>
        <td style="text-align: left; padding: 6px; font-weight: 500;">Keterkaitan & Integrasi Nilai</td>
        <td style="padding: 6px; font-weight: bold;">${scoreB3}</td>
        <td style="text-align: left; padding: 6px;">${escapeHtml(student.evaluations.B3 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 6px;">4</td>
        <td style="text-align: left; padding: 6px; font-weight: 500;">Visual & Evidence Room</td>
        <td style="padding: 6px; font-weight: bold;">${scoreB4}</td>
        <td style="text-align: left; padding: 6px;">${escapeHtml(student.evaluations.B4 || '-')}</td>
      </tr>
      <tr style="font-weight: bold; background-color: #fafafa;">
        <td colspan="2" style="text-align: right; padding: 6px;">Subtotal Produk Canva (B):</td>
        <td style="padding: 6px; font-size: 13px;">${subtotalBDisplay}</td>
        <td style="text-align: center; padding: 6px; color: #666;">-</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 18px; padding: 10px 14px; border: 1px solid #000; background-color: #f9f9f9;">
    <table style="width: 100%; font-weight: bold; font-size: 14px;">
      <tr>
        <td style="width: 50%;">TOTAL SKOR (A + B): ${totalScoreDisplay}</td>
        <td style="text-align: right; width: 50%; color: #000;">NILAI AKHIR: ${gradeDisplay}</td>
      </tr>
    </table>
  </div>

  <div style="margin-top: 32px; text-align: right; padding-right: 40px; font-size: 12px; page-break-inside: avoid;">
    ${escapeHtml(dateLocation)}<br>
    Guru Pengampu<br><br><br><br><br>
    ( ____________________ )
  </div>
</div>`;
}

/**
 * Generate Compact Rubric HTML for 1 student (designed specifically to fit 2 students on 1 A4 sheet)
 */
export function generateCompactStudentHtml(
  student: StudentScoreRecord,
  profile: TeacherProfile
): string {
  const dateLocation = `${profile.cityName || 'Surabaya'}, ${profile.dateString || '.................... 2026'}`;
  const isGraded = student.isGraded;

  const scoreA1 = isGraded && student.scores.A1 ? `${student.scores.A1}` : '-';
  const scoreA2 = isGraded && student.scores.A2 ? `${student.scores.A2}` : '-';
  const scoreA3 = isGraded && student.scores.A3 ? `${student.scores.A3}` : '-';
  const scoreA4 = isGraded && student.scores.A4 ? `${student.scores.A4}` : '-';

  const scoreB1 = isGraded && student.scores.B1 ? `${student.scores.B1}` : '-';
  const scoreB2 = isGraded && student.scores.B2 ? `${student.scores.B2}` : '-';
  const scoreB3 = isGraded && student.scores.B3 ? `${student.scores.B3}` : '-';
  const scoreB4 = isGraded && student.scores.B4 ? `${student.scores.B4}` : '-';

  const subtotalADisplay = isGraded ? `${student.subtotalA} / 16` : '- / 16';
  const subtotalBDisplay = isGraded ? `${student.subtotalB} / 16` : '- / 16';
  const totalScoreDisplay = isGraded ? `${student.totalScore} / 32` : '- / 32';
  // Nilai Akhir bulat utuh tanpa koma atau pecahan (contoh: 80)
  const gradeDisplay = isGraded ? `${student.finalGrade}` : '-';

  return `<div style="border: 1.5px solid #000; padding: 10px 14px; font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; box-sizing: border-box; width: 100%;">
  <div style="text-align: center; margin-bottom: 4px;">
    <h2 style="margin: 0; font-size: 13px; font-weight: bold; letter-spacing: 0.3px; line-height: 1.2;">RUBRIK PENILAIAN SUMATIF PROYEK BUKU CERITA DIGITAL</h2>
    <h3 style="margin: 2px 0 0 0; color: #333333; font-size: 11px; font-weight: 600; line-height: 1.2;">"Mengungkap Cerita di Balik Sebuah Pasar"</h3>
  </div>
  <hr style="border: none; border-top: 1px solid #000; margin: 4px 0 6px 0;">
  
  <table style="width: 100%; margin-bottom: 5px; font-weight: bold; font-size: 11px; line-height: 1.2;">
    <tr>
      <td style="width: 45%;">Nama : ${escapeHtml(student.name)}</td>
      <td style="width: 25%;">Kelas : ${escapeHtml(student.className)}</td>
      <td style="width: 30%; text-align: right;">No. Absen : ${escapeHtml(student.studentNo)}</td>
    </tr>
  </table>

  <div style="margin: 4px 0 2px 0; font-size: 10px; font-weight: bold;">A. RUBRIK PENILAIAN DISKUSI &amp; KERJA SAMA KELOMPOK</div>
  <table border="1" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 9.5px; border-color: #000; line-height: 1.2;">
    <thead>
      <tr style="background-color: #f2f2f2; font-weight: bold;">
        <th style="width: 28px; padding: 2px 3px;">No</th>
        <th style="width: 180px; padding: 2px 4px; text-align: left;">Aspek Penilaian</th>
        <th style="width: 60px; padding: 2px 3px;">Skor (1-4)</th>
        <th style="padding: 2px 4px; text-align: left;">Catatan / Evaluasi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 2px 3px;">1</td>
        <td style="text-align: left; padding: 2px 4px;">Kerja Sama Kelompok</td>
        <td style="padding: 2px 3px; font-weight: bold;">${scoreA1}</td>
        <td style="text-align: left; padding: 2px 4px;">${escapeHtml(student.evaluations.A1 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 2px 3px;">2</td>
        <td style="text-align: left; padding: 2px 4px;">Peran Individu &amp; Responsibilitas</td>
        <td style="padding: 2px 3px; font-weight: bold;">${scoreA2}</td>
        <td style="text-align: left; padding: 2px 4px;">${escapeHtml(student.evaluations.A2 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 2px 3px;">3</td>
        <td style="text-align: left; padding: 2px 4px;">Manajemen Waktu</td>
        <td style="padding: 2px 3px; font-weight: bold;">${scoreA3}</td>
        <td style="text-align: left; padding: 2px 4px;">${escapeHtml(student.evaluations.A3 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 2px 3px;">4</td>
        <td style="text-align: left; padding: 2px 4px;">Komunikasi &amp; Solusi</td>
        <td style="padding: 2px 3px; font-weight: bold;">${scoreA4}</td>
        <td style="text-align: left; padding: 2px 4px;">${escapeHtml(student.evaluations.A4 || '-')}</td>
      </tr>
      <tr style="font-weight: bold; background-color: #fafafa;">
        <td colspan="2" style="text-align: right; padding: 2px 4px;">Subtotal Diskusi &amp; Kerja Sama (A):</td>
        <td style="padding: 2px 3px; font-size: 10px;">${subtotalADisplay}</td>
        <td style="text-align: center; padding: 2px 4px; color: #666;">-</td>
      </tr>
    </tbody>
  </table>

  <div style="margin: 5px 0 2px 0; font-size: 10px; font-weight: bold;">B. RUBRIK PENILAIAN PRODUK BUKU CERITA DIGITAL (CANVA)</div>
  <table border="1" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 9.5px; border-color: #000; line-height: 1.2;">
    <thead>
      <tr style="background-color: #f2f2f2; font-weight: bold;">
        <th style="width: 28px; padding: 2px 3px;">No</th>
        <th style="width: 180px; padding: 2px 4px; text-align: left;">Aspek Penilaian</th>
        <th style="width: 60px; padding: 2px 3px;">Skor (1-4)</th>
        <th style="padding: 2px 4px; text-align: left;">Catatan / Evaluasi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 2px 3px;">1</td>
        <td style="text-align: left; padding: 2px 4px;">Story Flow &amp; Narasi</td>
        <td style="padding: 2px 3px; font-weight: bold;">${scoreB1}</td>
        <td style="text-align: left; padding: 2px 4px;">${escapeHtml(student.evaluations.B1 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 2px 3px;">2</td>
        <td style="text-align: left; padding: 2px 4px;">Kedalaman Informasi IPS</td>
        <td style="padding: 2px 3px; font-weight: bold;">${scoreB2}</td>
        <td style="text-align: left; padding: 2px 4px;">${escapeHtml(student.evaluations.B2 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 2px 3px;">3</td>
        <td style="text-align: left; padding: 2px 4px;">Keterkaitan &amp; Integrasi Nilai</td>
        <td style="padding: 2px 3px; font-weight: bold;">${scoreB3}</td>
        <td style="text-align: left; padding: 2px 4px;">${escapeHtml(student.evaluations.B3 || '-')}</td>
      </tr>
      <tr>
        <td style="padding: 2px 3px;">4</td>
        <td style="text-align: left; padding: 2px 4px;">Visual &amp; Evidence Room</td>
        <td style="padding: 2px 3px; font-weight: bold;">${scoreB4}</td>
        <td style="text-align: left; padding: 2px 4px;">${escapeHtml(student.evaluations.B4 || '-')}</td>
      </tr>
      <tr style="font-weight: bold; background-color: #fafafa;">
        <td colspan="2" style="text-align: right; padding: 2px 4px;">Subtotal Produk Canva (B):</td>
        <td style="padding: 2px 3px; font-size: 10px;">${subtotalBDisplay}</td>
        <td style="text-align: center; padding: 2px 4px; color: #666;">-</td>
      </tr>
    </tbody>
  </table>

  <!-- Compact Footer with Score and Signature side by side -->
  <table style="width: 100%; margin-top: 5px; border-collapse: collapse;">
    <tr>
      <td style="width: 55%; vertical-align: middle;">
        <div style="border: 1px solid #000; padding: 4px 8px; background-color: #f9f9f9; font-size: 10.5px; font-weight: bold; line-height: 1.3;">
          <div>TOTAL SKOR (A + B): ${totalScoreDisplay}</div>
          <div style="margin-top: 2px;">NILAI AKHIR: ${gradeDisplay}</div>
        </div>
      </td>
      <td style="width: 45%; text-align: right; vertical-align: top; font-size: 9.5px; padding-right: 12px; line-height: 1.25;">
        ${escapeHtml(dateLocation)}<br>
        Guru Pengampu<br><br><br>
        ( ____________________ )
      </td>
    </tr>
  </table>
</div>`;
}

/**
 * Generate A4 Sheet containing 2 students with a cutting guide line in between
 */
export function generateTwoStudentsA4Html(
  student1: StudentScoreRecord,
  student2: StudentScoreRecord | null,
  profile: TeacherProfile
): string {
  const html1 = generateCompactStudentHtml(student1, profile);
  const html2 = student2
    ? generateCompactStudentHtml(student2, profile)
    : `<div style="border: 1.5px dashed #aaa; padding: 25px; text-align: center; color: #888; font-family: Arial, sans-serif; font-size: 11px; height: 180px; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
        <em>(Sisa halaman A4 kosong / tidak ada siswa berikutnya)</em>
       </div>`;

  return `<div class="a4-sheet-container" style="max-width: 800px; margin: auto; background-color: #ffffff; box-sizing: border-box;">
  <div class="half-sheet top-half">
    ${html1}
  </div>

  <div style="margin: 8px 0; text-align: center; line-height: 1; height: 14px; position: relative;">
    <div style="border-top: 1px dashed #666; width: 100%; position: absolute; top: 7px; left: 0;"></div>
    <span style="background: #ffffff; padding: 0 10px; font-size: 9px; color: #555; position: relative; font-family: monospace;">
      ✂ - - - - - - - - - - - - - - - Gunting / Potong di Sini (Ukuran A4 : 2 Siswa) - - - - - - - - - - - - - - - ✂
    </span>
  </div>

  <div class="half-sheet bottom-half">
    ${html2}
  </div>
</div>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function downloadPdfFromElement(
  element: HTMLElement,
  filename: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<void> {
  const opt = {
    margin: [6, 6, 6, 6] as [number, number, number, number],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation }
  };
  return html2pdf().set(opt).from(element).save();
}

export function exportRecapToCSV(students: StudentScoreRecord[], className = 'Semua_Kelas'): void {
  const headers = [
    'No',
    'No_Absen',
    'Nama_Siswa',
    'Kelas',
    'Status_Penilaian',
    'A1_KerjaSama',
    'A2_TanggungJawab',
    'A3_ManajemenWaktu',
    'A4_Komunikasi',
    'Subtotal_A_16',
    'B1_StoryFlow',
    'B2_InformasiIPS',
    'B3_IntegrasiNilai',
    'B4_VisualCanva',
    'Subtotal_B_16',
    'Total_Skor_32',
    'Nilai_Akhir_Utuh',
    'Predikat',
    'Keterangan'
  ];

  const rows = students.map((std, idx) => {
    return [
      idx + 1,
      `"${std.studentNo}"`,
      `"${std.name.replace(/"/g, '""')}"`,
      `"${std.className}"`,
      std.isGraded ? '"Sudah Dinilai"' : '"Belum Dinilai"',
      std.isGraded ? std.scores.A1 : '-',
      std.isGraded ? std.scores.A2 : '-',
      std.isGraded ? std.scores.A3 : '-',
      std.isGraded ? std.scores.A4 : '-',
      std.isGraded ? std.subtotalA : '-',
      std.isGraded ? std.scores.B1 : '-',
      std.isGraded ? std.scores.B2 : '-',
      std.isGraded ? std.scores.B3 : '-',
      std.isGraded ? std.scores.B4 : '-',
      std.isGraded ? std.subtotalB : '-',
      std.isGraded ? std.totalScore : '-',
      std.isGraded ? std.finalGrade : '-',
      std.predicate,
      `"${std.predicateLabel}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Nilai_Proyek_${className}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadHtmlFile(content: string, filename: string): void {
  const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    body { margin: 20px; background-color: #f4f4f4; }
    @media print {
      @page { size: A4 portrait; margin: 6mm 8mm; }
      body { margin: 0; background: #fff; }
      .a4-sheet-container { page-break-after: always; break-after: page; }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
