/* ===== js/data.js ===== */
/* ----- IKON SVG ----- */
const IC = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  tree: '<path d="M12 3l5 7h-3l4 6H6l4-6H7z"/><path d="M12 16v5"/>',
  sprout: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 14c0-3-2-5-6-5 0 3 2 5 6 5z"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  book: '<path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3z"/><path d="M21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 21l5-3 5 3-1.5-7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  logout: '<path d="M10 4H5v16h5"/><path d="M15 8l4 4-4 4M19 12H9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  leaf: '<path d="M5 19C5 10 10 4 20 4c0 10-6 15-15 15z"/><path d="M5 19c3-5 6-8 10-10"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
  alert: '<path d="M12 3L2 20h20z"/><path d="M12 10v4M12 17v.1"/>',
  wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  right: '<path d="M9 6l6 6-6 6"/>',
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h3v3h-3zM20 14v6h-3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  tasks: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  flame: '<path d="M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4 0-6 1-10z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c3 0 5 2 5 5"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.1"/>'
};
const ic = (n, s = 20) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[n] || ''}</svg>`;

/* ----- 50 SPESIES POHON ----- */
const SPS = [
  ['meranti', 'Meranti Merah', 'Shorea leprosula', 'Hutan hujan', 'Pohon dipterokarpa untuk restorasi hutan hujan dataran rendah.'],
  ['mahoni', 'Mahoni', 'Swietenia macrophylla', 'Kayu', 'Tajuk rimbun, populer untuk penghijauan dan peneduh.'],
  ['pinus', 'Pinus', 'Pinus merkusii', 'Konifer', 'Cocok untuk dataran tinggi dan reboisasi lahan kritis.'],
  ['trembesi', 'Trembesi', 'Samanea saman', 'Peneduh', 'Tajuk lebar yang meneduhkan dan tumbuh cepat.'],
  ['beringin', 'Beringin', 'Ficus benjamina', 'Peneduh', 'Akar kuat, berumur panjang, habitat banyak satwa.'],
  ['cemara', 'Cemara Laut', 'Casuarina equisetifolia', 'Konifer', 'Tahan angin dan tanah miskin hara.'],
  ['mangga', 'Mangga', 'Mangifera indica', 'Buah', 'Penghasil buah sekaligus peneduh.'],
  ['alpukat', 'Alpukat', 'Persea americana', 'Buah', 'Butuh tanah gembur dan drainase baik.'],
  ['jati', 'Jati', 'Tectona grandis', 'Kayu', 'Kayu bernilai tinggi, gugur daun saat kemarau.'],
  ['sengon', 'Sengon', 'Falcataria moluccana', 'Kayu', 'Pertumbuhan sangat cepat, memperbaiki tanah.'],
  ['durian', 'Durian', 'Durio zibethinus', 'Buah', 'Pohon buah besar bagi agroforestri.'],
  ['kemenyan', 'Kemenyan', 'Styrax sumatrana', 'Getah', 'Penghasil getah kemenyan khas Sumatera Utara.'],
  ['damar', 'Damar', 'Agathis dammara', 'Getah', 'Penghasil resin damar, batang lurus.'],
  ['ulin', 'Ulin (Kayu Besi)', 'Eusideroxylon zwageri', 'Kayu', 'Kayu sangat keras, tumbuh lambat.'],
  ['eboni', 'Eboni', 'Diospyros celebica', 'Kayu', 'Kayu hitam langka yang perlu dilestarikan.'],
  ['cendana', 'Cendana', 'Santalum album', 'Aromatik', 'Kayu aromatik, semi-parasit pada akar inang.'],
  ['bambu', 'Bambu', 'Bambusa vulgaris', 'Rumpun', 'Menahan erosi tepi sungai, cepat tumbuh.'],
  ['kayumanis', 'Kayu Manis', 'Cinnamomum burmannii', 'Rempah', 'Kulit batang dipanen sebagai rempah.'],
  ['rambutan', 'Rambutan', 'Nephelium lappaceum', 'Buah', 'Pohon buah tropis berbuah musiman.'],
  ['nangka', 'Nangka', 'Artocarpus heterophyllus', 'Buah', 'Tajuk lebat dan buah besar.'],
  ['kopi', 'Kopi Arabika', 'Coffea arabica', 'Perkebunan', 'Cocok ditanam di bawah naungan pohon lain.'],
  ['kakao', 'Kakao', 'Theobroma cacao', 'Perkebunan', 'Tumbuh baik di bawah naungan.'],
  ['karet', 'Karet', 'Hevea brasiliensis', 'Perkebunan', 'Penghasil getah lateks.'],
  ['akasia', 'Akasia', 'Acacia mangium', 'Kayu', 'Cepat tumbuh pada lahan terbuka.'],
  ['gmelina', 'Gmelina', 'Gmelina arborea', 'Kayu', 'Pohon kayu cepat tumbuh.'],
  ['mindi', 'Mindi', 'Melia azedarach', 'Kayu', 'Tahan kering dan cepat tumbuh.'],
  ['randu', 'Randu', 'Ceiba pentandra', 'Peneduh', 'Pohon tinggi berserat kapuk.'],
  ['aren', 'Aren', 'Arenga pinnata', 'Palma', 'Palma serbaguna penghasil nira.'],
  ['matoa', 'Matoa', 'Pometia pinnata', 'Buah', 'Pohon buah khas timur Indonesia.'],
  ['jabon', 'Jabon', 'Neolamarckia cadamba', 'Kayu', 'Pionir cepat tumbuh untuk lahan terbuka.'],
  ['sonokeling', 'Sonokeling', 'Dalbergia latifolia', 'Kayu', 'Kayu berkualitas tinggi, kerap ditanam sebagai peneduh.'],
  ['johar', 'Johar', 'Senna siamea', 'Peneduh', 'Peneduh jalan yang tahan kering dan cepat tumbuh.'],
  ['angsana', 'Angsana', 'Pterocarpus indicus', 'Peneduh', 'Tajuk lebar dengan bunga kuning.'],
  ['ketapang', 'Ketapang', 'Terminalia catappa', 'Peneduh', 'Tajuk bertingkat, tahan angin dan tanah pesisir.'],
  ['flamboyan', 'Flamboyan', 'Delonix regia', 'Peneduh', 'Tajuk payung dengan bunga merah jingga.'],
  ['kelapa', 'Kelapa', 'Cocos nucifera', 'Palma', 'Palma serbaguna dataran rendah.'],
  ['jambu', 'Jambu Biji', 'Psidium guajava', 'Buah', 'Pohon buah kecil yang mudah dirawat.'],
  ['belimbing', 'Belimbing', 'Averrhoa carambola', 'Buah', 'Pohon buah sedang dengan buah berusuk.'],
  ['manggis', 'Manggis', 'Garcinia mangostana', 'Buah', 'Tumbuh lambat dan menyukai naungan saat muda.'],
  ['langsat', 'Langsat', 'Lansium parasiticum', 'Buah', 'Pohon buah tropis berbuah bergerombol.'],
  ['petai', 'Petai', 'Parkia speciosa', 'Buah', 'Pohon polong tinggi yang membantu memperbaiki tanah.'],
  ['jengkol', 'Jengkol', 'Archidendron pauciflorum', 'Buah', 'Pohon polong cocok untuk agroforestri.'],
  ['pala', 'Pala', 'Myristica fragrans', 'Rempah', 'Penghasil biji dan fuli pala.'],
  ['cengkeh', 'Cengkeh', 'Syzygium aromaticum', 'Rempah', 'Kuncup bunganya dipanen sebagai rempah.'],
  ['kemiri', 'Kemiri', 'Aleurites moluccanus', 'Perkebunan', 'Bijinya dipakai sebagai bumbu dan minyak.'],
  ['sukun', 'Sukun', 'Artocarpus altilis', 'Buah', 'Pohon pangan bertajuk rimbun.'],
  ['bintangur', 'Bintangur', 'Calophyllum inophyllum', 'Peneduh', 'Pohon pantai tahan angin dengan tajuk rapat.'],
  ['tembesu', 'Tembesu', 'Fagraea fragrans', 'Kayu', 'Kayu awet dan bunga harum.'],
  ['pulai', 'Pulai', 'Alstonia scholaris', 'Peneduh', 'Batang lurus dengan tajuk bertingkat.'],
  ['kapur', 'Kapur Barus', 'Dryobalanops aromatica', 'Hutan hujan', 'Pohon dipterokarpa khas Sumatera penghasil kamper.']
];
const SP = Object.fromEntries(SPS.map(s => [
  s[0],
  { id: s[0], n: s[1], l: s[2], c: s[3], d: s[4] }
]));

/* ----- KAWASAN ----- */
const AREAS = {
  'SLK-2026': { n: 'Kawasan Silangkitang, Tapanuli Utara', lat: 1.9880, lng: 98.9380 },
  'HPK-2026': { n: 'Hutan Pemulihan Kampus Tarutung', lat: 2.0142, lng: 98.9691 },
  'BTR-2026': { n: 'Koridor Restorasi Batang Toru', lat: 1.5400, lng: 99.0800 }
};

/* ----- SOP MISI HARIAN ----- */
const MIS = {
  water: {
    n: 'Hidrasi Tanah',
    ic: 'drop',
    min: 15,
    pts: 60,
    tools: ['Air 3 L', 'Mulsa jerami 2 kg', 'Garu'],
    steps: ['Bersihkan gulma dalam radius 30 cm', 'Siram 3 liter air merata ke area akar', 'Tebar mulsa jerami setebal 3–5 cm'],
    eff: 'Kelembapan tanah +30%'
  },
  fert: {
    n: 'Pemupukan Organik',
    ic: 'leaf',
    min: 20,
    pts: 80,
    tools: ['Kompos 1 kg', 'Sekop kecil', 'Air 2 L'],
    steps: ['Buat alur dangkal mengelilingi tajuk', 'Taburkan kompos secara merata', 'Tutup alur dengan tanah lalu siram ringan'],
    eff: 'Kesuburan tanah +35%'
  },
  check: {
    n: 'Inspeksi Rutin',
    ic: 'search',
    min: 10,
    pts: 50,
    tools: ['Meteran', 'Jangka sorong', 'Ponsel'],
    steps: ['Periksa daun dan batang dari hama atau luka', 'Ukur tinggi dan diameter batang', 'Pastikan sensor tanah aktif dan bersih'],
    eff: 'Data jurnal diperbarui'
  }
};

/* ----- MATERI EDUKASI ----- */
const ECAT = ['Artikel', 'Panduan', 'Panduan Lapangan', 'Penyakit Daun', 'Kebakaran'];
const ART = [
  { id: 'a1', c: 'Artikel', i: 'tree', t: 'Mengapa Pohon Penting bagi Kita', s: 'Pohon memberi naungan, oksigen, dan menjaga tanah.', x: 'Pohon menyerap karbon dioksida, melepaskan oksigen, meneduhkan lingkungan, dan akarnya menahan tanah dari erosi.\nHutan juga menjadi rumah bagi beragam satwa dan sumber penghidupan bagi banyak masyarakat.' },
  { id: 'a2', c: 'Artikel', i: 'wind', t: 'Pohon dan Perubahan Iklim', s: 'Vegetasi membantu menyeimbangkan karbon.', x: 'Tutupan pohon membantu menyerap karbon dan menurunkan suhu mikro di sekitarnya.\nPohon adalah bagian dari solusi, namun tidak menggantikan upaya mengurangi emisi dan perubahan perilaku sehari-hari.' },
  { id: 'a3', c: 'Artikel', i: 'alert', t: 'Deforestasi: Penyebab dan Dampaknya', s: 'Hilangnya tutupan hutan mengganggu keseimbangan alam.', x: 'Alih fungsi lahan, pembalakan liar, dan kebakaran dapat mengurangi tutupan hutan.\nDampaknya antara lain hilangnya habitat, meningkatnya risiko banjir dan longsor, serta lepasnya karbon ke atmosfer.' },
  { id: 'a4', c: 'Artikel', i: 'sprout', t: 'Keanekaragaman Hayati di Hutan Tropis', s: 'Satu pohon dapat menopang banyak kehidupan.', x: 'Hutan tropis menampung beragam tumbuhan, serangga, burung, dan mamalia yang saling bergantung.\nMenanam beragam jenis pohon lokal membantu memulihkan jejaring kehidupan lebih baik daripada satu jenis saja.' },
  { id: 'a5', c: 'Artikel', i: 'drop', t: 'Hutan dan Siklus Air', s: 'Akar dan serasah membantu air meresap ke tanah.', x: 'Akar dan serasah hutan membantu air hujan meresap sehingga mengurangi limpasan dan menjaga mata air.\nDi lereng, tutupan pohon penting untuk menahan tanah dari longsor.' },
  { id: 'a6', c: 'Artikel', i: 'leaf', t: 'Agroforestri: Menanam sambil Menjaga', s: 'Lahan produktif tanpa kehilangan pohon.', x: 'Agroforestri memadukan pohon dengan tanaman pertanian agar lahan tetap produktif sekaligus lestari.\nDi sejumlah wilayah Tapanuli, kebun kemenyan dan tanaman campuran menjadi contoh pemanfaatan hutan yang tetap menjaga pohon.' },
  {
    id: 'p1',
    c: 'Panduan',
    i: 'drop',
    t: 'Teknik Penyiraman dan Mulsa',
    s: 'Siram dalam dan beri mulsa agar air bertahan.',
    x: 'Penyiraman yang tepat membuat akar tumbuh dalam dan bibit lebih tahan kering.',
    l: ['Siram pagi atau sore hari', 'Arahkan air ke area perakaran, bukan ke daun', 'Beri air perlahan agar meresap dalam', 'Tebar mulsa jerami 3–5 cm, jauhkan dari batang']
  },
  {
    id: 'p2',
    c: 'Panduan',
    i: 'leaf',
    t: 'Pemupukan Organik Bibit',
    s: 'Kompos memperbaiki struktur dan kesuburan tanah.',
    x: 'Pupuk organik melepaskan hara perlahan dan memperbaiki struktur tanah.',
    l: ['Buat alur dangkal mengelilingi tajuk', 'Taburkan kompos secara merata', 'Tutup dengan tanah tipis', 'Siram ringan setelahnya']
  },
  {
    id: 'p3',
    c: 'Panduan',
    i: 'sprout',
    t: 'Membuat Kompos Sederhana',
    s: 'Ubah sisa dedaunan menjadi pupuk.',
    x: 'Kompos dapat dibuat dari sisa dedaunan dan sisa dapur nabati di dekat lokasi tanam.',
    l: ['Kumpulkan dedaunan dan sisa dapur nabati', 'Campur bahan hijau dan cokelat seimbang', 'Jaga tetap lembap, bukan basah', 'Aduk berkala hingga gelap dan beraroma tanah']
  },
  {
    id: 'p4',
    c: 'Panduan',
    i: 'tree',
    t: 'Memilih Jenis Pohon yang Tepat',
    s: 'Sesuaikan jenis dengan tanah dan ketinggian.',
    x: 'Jenis yang cocok dengan kondisi setempat lebih mudah hidup dan memberi manfaat ekologis lebih besar.',
    l: ['Cek ketinggian dan curah hujan lokasi', 'Prioritaskan jenis asli setempat', 'Campur beberapa jenis agar lebih tangguh', 'Konsultasikan dengan koordinator kawasan']
  },
  {
    id: 'p5',
    c: 'Panduan',
    i: 'sprout',
    t: 'Menanam Bibit Langkah demi Langkah',
    s: 'Dari polibag ke tanah dengan benar.',
    x: 'Penanaman yang rapi mengurangi stres pada bibit dan meningkatkan peluang hidup.',
    l: ['Gali lubang sekitar dua kali lebar polibag', 'Lepas polibag tanpa merusak akar', 'Tanam sejajar permukaan tanah dan padatkan perlahan', 'Siram hingga lembap lalu pasang ajir dan tag']
  },
  {
    id: 'p6',
    c: 'Panduan',
    i: 'activity',
    t: 'Penyiangan dan Pemangkasan',
    s: 'Kurangi pesaing dan buang bagian mati.',
    x: 'Gulma bersaing dengan bibit untuk air, cahaya, dan hara.',
    l: ['Siangi gulma radius sekitar 30 cm', 'Gunakan alat bersih', 'Pangkas hanya cabang mati atau patah', 'Jangan melukai batang utama']
  },
  {
    id: 'f1',
    c: 'Panduan Lapangan',
    i: 'tasks',
    t: 'Checklist Sebelum Berangkat',
    s: 'Persiapan singkat agar kerja lancar dan aman.',
    x: 'Persiapan yang baik mencegah banyak masalah di lokasi yang jauh dari sinyal.',
    l: ['Cek cuaca dan kabari koordinator', 'Bawa air minum, topi, dan perlengkapan P3K', 'Isi daya ponsel dan aktifkan GPS', 'Simpan materi luring dan siapkan alat ukur', 'Berangkat berkelompok, jangan sendirian']
  },
  {
    id: 'f2',
    c: 'Panduan Lapangan',
    i: 'shield',
    t: 'Keselamatan di Lereng dan Hutan',
    s: 'Utamakan keselamatan di atas target kerja.',
    x: 'Medan lereng licin dan cuaca dapat berubah cepat.',
    l: ['Gunakan sepatu bertapak kuat', 'Hindari bekerja saat hujan lebat atau petir', 'Tetap dalam kelompok atau jangkauan sinyal', 'Kenali jalur evakuasi dan titik kumpul']
  },
  {
    id: 'f3',
    c: 'Panduan Lapangan',
    i: 'ruler',
    t: 'Cara Mengukur Tinggi dan Diameter Bibit',
    s: 'Pengukuran konsisten membuat data jurnal akurat.',
    x: 'Gunakan cara yang sama setiap inspeksi agar perubahan pertumbuhan dapat dibandingkan.',
    l: ['Ukur tinggi dari permukaan tanah sampai pucuk tertinggi', 'Ukur diameter pada ketinggian yang sama setiap kali', 'Catat dalam sentimeter', 'Ulangi bila ragu, lalu isi di Jurnal']
  },
  {
    id: 'f4',
    c: 'Panduan Lapangan',
    i: 'camera',
    t: 'Foto Dokumentasi yang Baik',
    s: 'Foto jelas memudahkan verifikasi.',
    x: 'Foto bukti membantu koordinator memantau perkembangan tanpa harus datang.',
    l: ['Pastikan tag atau ID pohon terlihat', 'Ambil foto keseluruhan dan foto dekat daun', 'Gunakan cahaya cukup', 'Ambil dari sudut yang sama setiap inspeksi']
  },
  {
    id: 'f5',
    c: 'Panduan Lapangan',
    i: 'pin',
    t: 'Menggunakan GPS dan Tag Pohon',
    s: 'Titik koordinat yang tepat memudahkan pencarian.',
    x: 'Koordinat dan tag membuat setiap pohon mudah ditemukan kembali.',
    l: ['Aktifkan lokasi akurasi tinggi', 'Tunggu titik GPS stabil sebelum menyimpan', 'Pasang tag pada ajir yang kuat', 'Catat plot dan ciri sekitar sebagai penanda']
  },
  {
    id: 'f6',
    c: 'Panduan Lapangan',
    i: 'help',
    t: 'Pertolongan Pertama Dasar',
    s: 'Panduan umum untuk kondisi ringan di lapangan.',
    x: 'Ini panduan umum; hubungi tenaga medis atau layanan darurat bila kondisi serius.',
    l: ['Hentikan aktivitas dan pastikan area aman', 'Luka ringan: bersihkan dengan air bersih lalu tutup', 'Kelelahan atau dehidrasi: istirahat di tempat teduh dan minum perlahan', 'Hubungi koordinator atau layanan darurat bila pingsan, luka parah, atau gigitan berbisa']
  },
  {
    id: 'd1',
    c: 'Penyakit Daun',
    i: 'alert',
    t: 'Daun Layu',
    s: 'Bedakan kurang air dan masalah akar.',
    x: 'Layu pada tanah kering biasanya berarti kurang air; layu padahal tanah lembap dapat menandakan masalah akar.',
    l: ['Cek kelembapan tanah dan sensor', 'Siram bila kering', 'Periksa pangkal batang bila tetap layu', 'Foto dan catat di jurnal']
  },
  {
    id: 'd2',
    c: 'Penyakit Daun',
    i: 'search',
    t: 'Bercak pada Daun',
    s: 'Bercak cokelat atau hitam perlu dicatat.',
    x: 'Bercak dapat disebabkan jamur atau bakteri, terutama pada kondisi lembap.',
    l: ['Foto bercak dari dekat', 'Singkirkan daun yang sangat terinfeksi', 'Kurangi kelembapan berlebih di sekitar bibit', 'Laporkan ke koordinator bila meluas']
  },
  {
    id: 'd3',
    c: 'Penyakit Daun',
    i: 'leaf',
    t: 'Daun Menguning',
    s: 'Bisa karena kurang hara atau tanah tergenang.',
    x: 'Menguning merata dapat menandakan kekurangan hara atau drainase buruk.',
    l: ['Cek drainase tanah', 'Beri kompos bila kesuburan rendah', 'Pantau beberapa hari']
  },
  {
    id: 'd4',
    c: 'Penyakit Daun',
    i: 'search',
    t: 'Hama Ulat dan Kutu',
    s: 'Deteksi dini lebih mudah ditangani.',
    x: 'Periksa bagian bawah daun dan pucuk muda saat inspeksi.',
    l: ['Periksa bagian bawah daun', 'Singkirkan ulat secara manual', 'Bersihkan kutu dengan semprotan air', 'Hindari pestisida tanpa arahan koordinator']
  },
  {
    id: 'd5',
    c: 'Penyakit Daun',
    i: 'alert',
    t: 'Jamur Putih pada Daun',
    s: 'Muncul di udara lembap dengan sirkulasi buruk.',
    x: 'Lapisan putih seperti tepung biasanya muncul bila udara lembap dan sirkulasi kurang.',
    l: ['Siangi gulma agar sirkulasi membaik', 'Singkirkan daun terinfeksi', 'Pantau penyebarannya']
  },
  {
    id: 'd6',
    c: 'Penyakit Daun',
    i: 'tree',
    t: 'Rayap dan Penggerek Batang',
    s: 'Cek pangkal batang secara berkala.',
    x: 'Lubang kecil, serbuk kayu, atau jalur tanah pada batang dapat menjadi tanda serangan.',
    l: ['Cari lubang kecil atau serbuk di pangkal batang', 'Cek jalur tanah di batang', 'Foto dan laporkan ke koordinator', 'Jaga area sekitar bersih dari kayu lapuk']
  },
  {
    id: 'k1',
    c: 'Kebakaran',
    i: 'flame',
    t: 'Mencegah Kebakaran Lereng',
    s: 'Kebakaran umumnya dipicu aktivitas manusia.',
    x: 'Pencegahan jauh lebih mudah daripada pemadaman.',
    l: ['Jangan membakar lahan atau sampah', 'Jangan buang puntung rokok sembarangan', 'Bersihkan semak kering di sekitar bibit', 'Laporkan aktivitas pembakaran mencurigakan']
  },
  { id: 'k2', c: 'Kebakaran', i: 'shield', t: 'Sekat Bakar dan Kesiapsiagaan', s: 'Jalur bersih memperlambat api.', x: 'Sekat bakar berupa jalur tanpa bahan mudah terbakar dapat memperlambat api.\nKenali jalur evakuasi dan nomor kontak darurat kawasan.' },
  { id: 'k3', c: 'Kebakaran', i: 'alert', t: 'Mengenali Tanda Awal Kebakaran', s: 'Asap tipis dan bau terbakar adalah tanda awal.', x: 'Asap tipis, bau terbakar, dan serasah menghitam adalah tanda awal.\nSemakin cepat dilaporkan, semakin kecil peluang api membesar.' },
  {
    id: 'k4',
    c: 'Kebakaran',
    i: 'flame',
    t: 'Jika Melihat Api atau Asap',
    s: 'Utamakan keselamatan dan laporkan segera.',
    x: 'Jangan mencoba memadamkan api besar sendirian.',
    l: ['Jauhi sumber api dan utamakan keselamatan', 'Hubungi koordinator dan pihak berwenang beserta lokasi GPS', 'Evakuasi ke titik kumpul', 'Bantu pendataan setelah situasi aman']
  },
  {
    id: 'k5',
    c: 'Kebakaran',
    i: 'clock',
    t: 'Musim Kering dan Risiko Api',
    s: 'Kemarau membuat serasah mudah terbakar.',
    x: 'Saat kemarau, serasah dan semak sangat kering sehingga api mudah menjalar.',
    l: ['Pantau prakiraan cuaca', 'Perbanyak patroli saat kemarau', 'Jaga kelembapan bibit dengan mulsa']
  },
  {
    id: 'k6',
    c: 'Kebakaran',
    i: 'sprout',
    t: 'Pemulihan Pascakebakaran',
    s: 'Lindungi tanah lalu tanam kembali jenis lokal.',
    x: 'Area bekas terbakar rentan erosi dan perlu ditanami kembali.',
    l: ['Nilai kerusakan bersama koordinator', 'Masuk hanya setelah area dinyatakan aman', 'Tanam jenis lokal yang tahan kering', 'Pantau dengan jurnal dan sensor']
  }
];

/* ----- TOPIK REFLEKSI HARIAN ----- */
const RCAT = ['Ekoteologi', 'Sains Alam', 'Kebiasaan Hijau', 'Aksi Bersama'];
const RF = [
  ['e1', 'Ekoteologi', 'Mengusahakan dan Memelihara', 'Kejadian 2:15', 'Manusia dipanggil merawat, bukan sekadar memanfaatkan. Setiap siraman pada bibit adalah wujud tanggung jawab itu.', 'Apa satu hal kecil yang bisa kamu rawat hari ini?'],
  ['e2', 'Ekoteologi', 'Penatalayan, Bukan Pemilik', 'Mazmur 24:1', 'Alam dipercayakan kepada kita untuk dijaga. Penatalayan baik memastikan yang ia kelola tetap lestari bagi orang lain.', 'Bagaimana kamu bisa menjadi penatalayan yang baik minggu ini?'],
  ['e3', 'Ekoteologi', 'Karya yang Beragam', 'Mazmur 104:24', 'Keanekaragaman hayati mencerminkan kekayaan ciptaan. Menjaga satu spesies berarti menjaga jejaring kehidupan di sekitarnya.', 'Makhluk hidup apa yang paling menarik perhatianmu hari ini?'],
  ['e3b', 'Ekoteologi', 'Syukur atas Alam', '', 'Rasa syukur membuat kita memandang alam sebagai anugerah, bukan sekadar sumber daya.', 'Sebutkan tiga hal dari alam yang kamu syukuri hari ini.'],
  ['s1', 'Sains Alam', 'Satu Pohon, Banyak Penghuni', '', 'Satu pohon dapat menjadi rumah bagi burung, serangga, lumut, dan jamur sekaligus.', 'Makhluk apa yang kamu temukan di sekitar pohon hari ini?'],
  ['s2', 'Sains Alam', 'Akar yang Tak Terlihat', '', 'Akar menahan tanah, menyimpan air, dan berbagi hara. Sebagian besar kerja pohon terjadi di bawah tanah.', 'Bagian alam mana yang jarang kamu perhatikan?'],
  ['s3', 'Sains Alam', 'Sejuknya Naungan', '', 'Tajuk pohon menurunkan suhu di bawahnya dengan menaungi dan melepaskan uap air.', 'Bandingkan suasana di bawah pohon dan di tempat terbuka. Apa bedanya?'],
  ['s4', 'Sains Alam', 'Siklus Karbon', '', 'Pohon menyerap karbon saat tumbuh dan menyimpannya pada batang, akar, dan tanah.', 'Bagaimana kamu bisa mengurangi jejak karbonmu minggu ini?'],
  ['k1', 'Kebiasaan Hijau', 'Mulai dari Botol Minum', '', 'Membawa botol minum sendiri mengurangi sampah plastik sekali pakai.', 'Apa kebiasaan kecil yang bisa kamu ganti hari ini?'],
  ['k2', 'Kebiasaan Hijau', 'Satu Hari Tanpa Plastik Sekali Pakai', '', 'Tantangan mini: hindari kantong dan kemasan plastik sekali pakai selama satu hari.', 'Ceritakan apa yang berhasil dan apa yang sulit.'],
  ['k3', 'Kebiasaan Hijau', 'Hemat Air', '', 'Air bersih berasal dari daerah resapan yang dijaga hutan. Menghemat air ikut menjaga siklusnya.', 'Di mana kamu bisa menghemat air hari ini?'],
  ['k4', 'Kebiasaan Hijau', 'Menghabiskan Makanan', '', 'Sisa makanan ikut menghasilkan emisi. Mengambil secukupnya adalah bentuk peduli lingkungan.', 'Bagaimana kamu mengurangi makanan terbuang hari ini?'],
  ['b1', 'Aksi Bersama', 'Ajak Satu Orang', '', 'Perubahan besar sering bermula dari ajakan kecil kepada teman atau keluarga.', 'Siapa yang akan kamu ajak peduli alam, dan bagaimana caranya?'],
  ['b2', 'Aksi Bersama', 'Bersih-bersih Kecil', '', 'Memungut beberapa sampah di sekitar rumah atau kampus sudah berarti.', 'Apa yang kamu bersihkan hari ini?'],
  ['b3', 'Aksi Bersama', 'Cerita dari Lapangan', '', 'Pengalaman di lapangan bisa menginspirasi relawan lain.', 'Apa momen paling berkesan saat merawat bibit?'],
  ['b4', 'Aksi Bersama', 'Terima Kasih untuk Penjaga Hutan', '', 'Banyak orang menjaga hutan tanpa sorotan, dari petani sampai petugas kehutanan.', 'Siapa yang ingin kamu apresiasi, dan mengapa?']
];

/* ----- LEVEL & MENU NAVIGASI ----- */
const LEVELS = [
  [0, 'Penjaga Bibit'],
  [100, 'Sahabat Pohon'],
  [250, 'Jagawana Muda'],
  [500, 'Jagawana Madya'],
  [1000, 'Jagawana Utama']
];
const NAV = [
  ['dashboard', 'Beranda', 'home'],
  ['map', 'Peta Kawasan', 'map'],
  ['trees', 'Direktori Pohon', 'tree'],
  ['missions', 'Misi Harian', 'target'],
  ['journal', 'Jurnal Pertumbuhan', 'file'],
  ['calendar', 'Kalender & Tim', 'calendar'],
  ['chat', 'Pesan', 'chat'],
  ['education', 'Edukasi', 'book'],
  ['reflection', 'Refleksi Harian', 'sprout'],
  ['impact', 'Jejak Kepedulian', 'chart'],
  ['profile', 'Profil', 'user'],
  ['settings', 'Pengaturan', 'sliders']
];
IC.menu = '<path d="M4 7h16M4 12h16M4 17h16"/>';

/* ----- JENIS PENGGUNA ----- */
const TYPES = ['Relawan Mahasiswa', 'Rimbawan', 'Pekerja Kehutanan', 'Peneliti', 'Lainnya'];
const typeLabel = u => u.type === 'Lainnya' ? (u.typeNote || 'Lainnya') : (u.type || '-');
Object.assign(IC, {
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  send: '<path d="M4 12l16-8-6 16-3-7z"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.1"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  play: '<path d="M8 5l11 7-11 7z"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
  tag: '<path d="M3 12V4h8l9 9-8 8z"/><circle cx="8" cy="8" r="1.5"/>',
  logout2: '<path d="M10 4H5v16h5"/><path d="M15 8l4 4-4 4M19 12H9"/>'
});

/* ----- PERAN KAWASAN ----- */
const ROLES = ['Penanam', 'Pemantau', 'Koordinator', 'Peneliti', 'Pekerja Kehutanan'];

/* ----- VIDEO YOUTUBE ----- */
const VIDEOS = [
  { id: 'v1', t: 'Cara menanam bibit pohon yang benar', tag: 'Praktik Lapangan', q: 'cara menanam bibit pohon yang benar', yt: '' },
  { id: 'v2', t: 'Membuat kompos sederhana dari dedaunan', tag: 'Panduan', q: 'cara membuat kompos sederhana dari daun', yt: '' },
  { id: 'v3', t: 'Penyiraman dan mulsa pada bibit pohon', tag: 'Panduan', q: 'mulsa jerami bibit pohon penyiraman', yt: '' },
  { id: 'v4', t: 'Mengukur tinggi dan diameter pohon', tag: 'Praktik Lapangan', q: 'cara mengukur diameter dan tinggi pohon kehutanan', yt: '' },
  { id: 'v5', t: 'Mengenali penyakit pada daun tanaman', tag: 'Penyakit Daun', q: 'penyakit daun tanaman bercak layu penyebab', yt: '' },
  { id: 'v6', t: 'Pencegahan kebakaran hutan dan lahan', tag: 'Kebakaran', q: 'pencegahan kebakaran hutan dan lahan karhutla', yt: '' },
  { id: 'v7', t: 'Rehabilitasi hutan dan lahan kritis', tag: 'Restorasi', q: 'rehabilitasi hutan dan lahan kritis penanaman', yt: '' },
  { id: 'v8', t: 'Pembibitan dan persemaian pohon', tag: 'Pembibitan', q: 'cara persemaian bibit pohon kehutanan', yt: '' }
];
const ytUrl = v => v.yt ? 'https://www.youtube.com/watch?v=' + v.yt : 'https://www.youtube.com/results?search_query=' + encodeURIComponent(v.q);

/* ----- KUIS HARIAN ----- */
const QUIZ = [
  {
    q: 'Kapan waktu terbaik menyiram bibit?',
    o: ['Siang terik', 'Pagi atau sore hari', 'Tengah malam', 'Saat hujan lebat'],
    a: 1,
    e: 'Pagi atau sore mengurangi penguapan sehingga air meresap ke akar.'
  },
  {
    q: 'Berapa ketebalan mulsa jerami yang dianjurkan?',
    o: ['0,5 cm', '3–5 cm', '20 cm', 'Tidak perlu mulsa'],
    a: 1,
    e: 'Mulsa 3–5 cm menahan penguapan dan menekan gulma; jauhkan dari batang.'
  },
  {
    q: 'Di bawah berapa persen kelembapan tanah dianggap butuh penyiraman darurat di AKAR?',
    o: ['80%', '60%', '40%', '10%'],
    a: 2,
    e: 'Ambang 40% menandai pohon berstatus kritis.'
  },
  {
    q: 'Jika melihat api di kawasan hutan, langkah pertama yang tepat?',
    o: ['Memadamkan sendiri', 'Menjauh lalu melapor', 'Merekam selama mungkin', 'Mengabaikan'],
    a: 1,
    e: 'Utamakan keselamatan, jauhi api, dan laporkan beserta lokasi GPS.'
  },
  {
    q: 'Tinggi bibit diukur dari mana?',
    o: ['Permukaan tanah sampai pucuk tertinggi', 'Ujung akar sampai pucuk', 'Dasar polibag sampai pucuk', 'Daun terendah sampai pucuk'],
    a: 0,
    e: 'Gunakan titik ukur yang sama setiap inspeksi agar data dapat dibandingkan.'
  },
  {
    q: 'Mengapa menanam beberapa jenis pohon lokal lebih baik?',
    o: ['Lebih tangguh dan beragam', 'Agar tidak perlu dirawat', 'Agar tumbuh seragam', 'Tidak ada alasan'],
    a: 0,
    e: 'Keragaman jenis membuat ekosistem lebih tahan hama dan perubahan cuaca.'
  }
];
