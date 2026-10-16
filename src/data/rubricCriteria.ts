import { AspectCriterion, AspectKey } from '../types/rubric';

export const RUBRIC_CRITERIA: Record<AspectKey, AspectCriterion> = {
  // --- KATEGORI A: DISKUSI & KERJA SAMA KELOMPOK ---
  A1: {
    id: 'A1',
    number: 1,
    category: 'A',
    categoryTitle: 'A. RUBRIK PENILAIAN DISKUSI & KERJA SAMA KELOMPOK',
    title: 'Kerja Sama Kelompok',
    shortLabel: 'Kerja Sama',
    levels: {
      4: {
        score: 4,
        label: 'Sangat Baik',
        descriptor: 'Sangat aktif berkolaborasi, berinisiatif membantu rekan, dan menciptakan suasana kerja tim yang produktif.',
        defaultEvaluation: 'Sangat aktif berkolaborasi dan berinisiatif membantu kelancaran tugas kelompok.'
      },
      3: {
        score: 3,
        label: 'Baik',
        descriptor: 'Bekerja sama dengan baik dalam kelompok dan bersedia membantu anggota lain saat dibutuhkan.',
        defaultEvaluation: 'Bekerja sama dengan kooperatif dalam menyelesaikan pembagian tugas kelompok.'
      },
      2: {
        score: 2,
        label: 'Cukup',
        descriptor: 'Cukup pasif dalam kerja kelompok, hanya berpartisipasi jika dipanggil atau diarahkan rekan.',
        defaultEvaluation: 'Cukup kooperatif, namun masih perlu dorongan rekan untuk lebih aktif berkontribusi.'
      },
      1: {
        score: 1,
        label: 'Kurang',
        descriptor: 'Kurang menunjukkan kemauan bekerja sama, pasif, atau cenderung bekerja secara individualis.',
        defaultEvaluation: 'Perlu bimbingan intensif dalam membangun kerja sama dan komitmen kelompok.'
      }
    }
  },
  A2: {
    id: 'A2',
    number: 2,
    category: 'A',
    categoryTitle: 'A. RUBRIK PENILAIAN DISKUSI & KERJA SAMA KELOMPOK',
    title: 'Peran Individu & Responsibilitas',
    shortLabel: 'Tanggung Jawab',
    levels: {
      4: {
        score: 4,
        label: 'Sangat Baik',
        descriptor: 'Menjalankan tanggung jawab individu secara mandiri, tuntas, dan melampaui ekspektasi kelompok.',
        defaultEvaluation: 'Bertanggung jawab penuh atas tugas individunya dan menyelesaikannya dengan tuntas.'
      },
      3: {
        score: 3,
        label: 'Baik',
        descriptor: 'Menyelesaikan bagian tugas individunya dengan baik dan tepat sesuai kesepakatan pembagian tugas.',
        defaultEvaluation: 'Melaksanakan peran individu dengan baik sesuai kesepakatan kelompok.'
      },
      2: {
        score: 2,
        label: 'Cukup',
        descriptor: 'Menyelesaikan peran individu namun perlu berulang kali diingatkan oleh ketua atau guru.',
        defaultEvaluation: 'Menyelesaikan tugas individu setelah beberapa kali diingatkan oleh rekan/guru.'
      },
      1: {
        score: 1,
        label: 'Kurang',
        descriptor: 'Sering lalai atau tidak menuntaskan porsi tugas individu yang telah disepakati bersama.',
        defaultEvaluation: 'Tanggung jawab individu belum optimal dan perlu pendampingan berkala.'
      }
    }
  },
  A3: {
    id: 'A3',
    number: 3,
    category: 'A',
    categoryTitle: 'A. RUBRIK PENILAIAN DISKUSI & KERJA SAMA KELOMPOK',
    title: 'Manajemen Waktu',
    shortLabel: 'Waktu & Disiplin',
    levels: {
      4: {
        score: 4,
        label: 'Sangat Baik',
        descriptor: 'Sangat disiplin terhadap linimasa proyek, selalu tepat waktu pada diskusi, dan mengumpulkan draf lebih awal.',
        defaultEvaluation: 'Sangat disiplin mengelola waktu di setiap tahapan penyusunan buku cerita.'
      },
      3: {
        score: 3,
        label: 'Baik',
        descriptor: 'Mampu mengatur waktu kerja kelompok dengan baik dan mengumpulkan tugas tepat pada jadwal yang ditentukan.',
        defaultEvaluation: 'Disiplin mengumpulkan draf tugas tepat waktu sesuai jadwal proyek.'
      },
      2: {
        score: 2,
        label: 'Cukup',
        descriptor: 'Sesekali terlambat dalam tahapan pengumpulan bagian sehingga menuntut penyesuaian jadwal kelompok.',
        defaultEvaluation: 'Perlu meningkatkan ketepatan waktu agar tidak menghambat ritme kerja kelompok.'
      },
      1: {
        score: 1,
        label: 'Kurang',
        descriptor: 'Sering terlambat dan tidak mematuhi linimasa, menghambat penyelesaian buku cerita kelompok.',
        defaultEvaluation: 'Manajemen waktu perlu diperbaiki agar tugas selesai sesuai batas waktu pengumpulan.'
      }
    }
  },
  A4: {
    id: 'A4',
    number: 4,
    category: 'A',
    categoryTitle: 'A. RUBRIK PENILAIAN DISKUSI & KERJA SAMA KELOMPOK',
    title: 'Komunikasi & Solusi',
    shortLabel: 'Komunikasi & Solusi',
    levels: {
      4: {
        score: 4,
        label: 'Sangat Baik',
        descriptor: 'Berkomunikasi sangat santun, menghargai kritik, dan proaktif memberi alternatif solusi saat kelompok menemui kebuntuan.',
        defaultEvaluation: 'Komunikasi sangat santun, terbuka menerima masukan, dan proaktif menawarkan solusi.'
      },
      3: {
        score: 3,
        label: 'Baik',
        descriptor: 'Menyampaikan ide dan gagasan dengan santun serta menghargai perbedaan pandangan dalam kelompok.',
        defaultEvaluation: 'Mampu menyampaikan gagasan secara santun dan menerima pandangan rekan lain.'
      },
      2: {
        score: 2,
        label: 'Cukup',
        descriptor: 'Komunikasi masih ragu-ragu, pasif, dan cenderung enggan mengemukakan pendapat saat diskusi.',
        defaultEvaluation: 'Perlu lebih percaya diri dalam menyampaikan pendapat dan merespons ide kelompok.'
      },
      1: {
        score: 1,
        label: 'Kurang',
        descriptor: 'Komunikasi kurang efektif, memicu gesekan, atau pasif total tanpa kontribusi solusi.',
        defaultEvaluation: 'Perlu meningkatkan keterampilan komunikasi santun dan mendengar dalam kelompok.'
      }
    }
  },

  // --- KATEGORI B: PRODUK BUKU CERITA DIGITAL (CANVA) ---
  B1: {
    id: 'B1',
    number: 1,
    category: 'B',
    categoryTitle: 'B. RUBRIK PENILAIAN PRODUK BUKU CERITA DIGITAL (CANVA)',
    title: 'Story Flow & Narasi',
    shortLabel: 'Alur Narasi',
    levels: {
      4: {
        score: 4,
        label: 'Sangat Baik',
        descriptor: 'Alur cerita sangat runtut, pembuka memikat, dinamika pasar hidup, dan penutup meninggalkan kesan mendalam.',
        defaultEvaluation: 'Alur cerita sangat runtut, bahasa ekspresif, dan narasi kehidupan pasar sangat mengalir.'
      },
      3: {
        score: 3,
        label: 'Baik',
        descriptor: 'Struktur narasi jelas dan logis (orientasi, dinamika pasar, resolusi), nyaman dibaca dari awal hingga akhir.',
        defaultEvaluation: 'Struktur narasi tersusun rapi dan nyaman dibaca dengan alur cerita yang logis.'
      },
      2: {
        score: 2,
        label: 'Cukup',
        descriptor: 'Alur cerita cukup runtut, namun transisi antarhalaman atau pergantian peristiwa pasar terasa kaku.',
        defaultEvaluation: 'Alur cerita cukup baik, namun transisi antarbagian kisah pasar perlu dihaluskan.'
      },
      1: {
        score: 1,
        label: 'Kurang',
        descriptor: 'Narasi cerita terpecah-pecah, ide pokok melompat-lompat, dan struktur cerita belum terbentuk utuh.',
        defaultEvaluation: 'Perlu menyusun kerangka cerita lebih matang agar alur narasi mudah dipahami pembaca.'
      }
    }
  },
  B2: {
    id: 'B2',
    number: 2,
    category: 'B',
    categoryTitle: 'B. RUBRIK PENILAIAN PRODUK BUKU CERITA DIGITAL (CANVA)',
    title: 'Kedalaman Informasi IPS',
    shortLabel: 'Informasi IPS',
    levels: {
      4: {
        score: 4,
        label: 'Sangat Baik',
        descriptor: 'Sangat kaya data faktual pasar: transaksi riil, rantai pasok barang, interaksi sosial, serta kearifan lokal pedagang.',
        defaultEvaluation: 'Informasi IPS sangat kaya, faktual, dan mendalam memotret aktivitas pelaku ekonomi pasar.'
      },
      3: {
        score: 3,
        label: 'Baik',
        descriptor: 'Memuat informasi aktivitas ekonomi dan interaksi sosial pasar secara akurat dan relevan dengan materi IPS Kelas 7.',
        defaultEvaluation: 'Menyajikan konsep aktivitas ekonomi dan interaksi sosial pasar tradisional dengan tepat.'
      },
      2: {
        score: 2,
        label: 'Cukup',
        descriptor: 'Informasi seputar pasar masih bersifat umum di permukaan, kurang mendalam menggali peran pedagang dan pembeli.',
        defaultEvaluation: 'Informasi pasar sudah ada namun masih umum, perlu pengayaan data ekonomi riil.'
      },
      1: {
        score: 1,
        label: 'Kurang',
        descriptor: 'Informasi IPS sangat minim atau memuat kekeliruan konsep kegiatan ekonomi di pasar tradisional.',
        defaultEvaluation: 'Kandungan materi IPS tentang kehidupan pasar masih sangat terbatas dan perlu diperluas.'
      }
    }
  },
  B3: {
    id: 'B3',
    number: 3,
    category: 'B',
    categoryTitle: 'B. RUBRIK PENILAIAN PRODUK BUKU CERITA DIGITAL (CANVA)',
    title: 'Keterkaitan & Integrasi Nilai',
    shortLabel: 'Nilai & Karakter',
    levels: {
      4: {
        score: 4,
        label: 'Sangat Baik',
        descriptor: 'Sangat kuat mengintegrasikan nilai kejujuran, kerja keras pedagang, gotong royong, dan empati sosial bermakna.',
        defaultEvaluation: 'Sangat kuat menanamkan nilai empati, kejujuran, dan kegigihan perjuangan hidup pedagang.'
      },
      3: {
        score: 3,
        label: 'Baik',
        descriptor: 'Terlihat pesan moral karakter profil pelajar Pancasila (kemandirian, gotong royong, integritas) dalam cerita.',
        defaultEvaluation: 'Berhasil mengaitkan cerita dengan pesan moral dan nilai karakter Profil Pelajar Pancasila.'
      },
      2: {
        score: 2,
        label: 'Cukup',
        descriptor: 'Nilai karakter atau pesan moral ada tetapi terkesan tempelan dan belum menyatu alami dengan cerita pasar.',
        defaultEvaluation: 'Pesan moral sudah ada, namun perlu lebih diintegrasikan ke dalam tindakan tokoh cerita.'
      },
      1: {
        score: 1,
        label: 'Kurang',
        descriptor: 'Belum tampak adanya integrasi nilai moral, kearifan lokal, atau refleksi karakter dalam isi cerita.',
        defaultEvaluation: 'Perlu menambahkan pesan karakter dan kearifan lokal pedagang pasar secara nyata.'
      }
    }
  },
  B4: {
    id: 'B4',
    number: 4,
    category: 'B',
    categoryTitle: 'B. RUBRIK PENILAIAN PRODUK BUKU CERITA DIGITAL (CANVA)',
    title: 'Visual & Evidence Room',
    shortLabel: 'Visual & Bukti Riil',
    levels: {
      4: {
        score: 4,
        label: 'Sangat Baik',
        descriptor: 'Desain Canva sangat estetik, tata letak seimbang, tipografi terbaca jelas, dilengkapi foto bukti observasi autentik.',
        defaultEvaluation: 'Desain Canva sangat estetik, tata letak rapi, dan dilengkapi dokumentasi bukti observasi autentik.'
      },
      3: {
        score: 3,
        label: 'Baik',
        descriptor: 'Visual Canva rapi, ilustrasi/foto pasar mendukung narasi, pemilihan font dan warna harmonis serta nyaman dibaca.',
        defaultEvaluation: 'Tata letak Canva terstruktur rapi dengan foto dokumentasi pasar yang relevan.'
      },
      2: {
        score: 2,
        label: 'Cukup',
        descriptor: 'Desain visual lumayan, namun ada elemen teks yang kurang kontras atau foto dokumentasi pasar minim.',
        defaultEvaluation: 'Visual cukup baik, namun perhatikan keterbacaan teks dan variasi dokumentasi pasar.'
      },
      1: {
        score: 1,
        label: 'Kurang',
        descriptor: 'Tampilan visual Canva kurang tertata rapi, layout bertumpukan, dan tidak menyertakan bukti observasi nyata.',
        defaultEvaluation: 'Desain visual dan tata letak perlu dibenahi serta lengkapi dengan foto dokumentasi asli.'
      }
    }
  }
};

export const ASPECTS_A: AspectKey[] = ['A1', 'A2', 'A3', 'A4'];
export const ASPECTS_B: AspectKey[] = ['B1', 'B2', 'B3', 'B4'];
export const ALL_ASPECTS: AspectKey[] = [...ASPECTS_A, ...ASPECTS_B];
