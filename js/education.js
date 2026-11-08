/* ===== js/education.js ===== */
/* ----- PUSTAKA EDUKASI ----- */
let EQ = '',
  EC = 'Artikel',
  RC = '';

function edu() {
  const d = D(),
    sv = d.saved,
    qd = d.quizDone.includes(ymd(Date.now())),
    k5 = ART.find(a => a.id === 'k5'),
    cats = [...ECAT, 'Video'];
  return [
    `${head('Pustaka Edukasi', ART.length + ' materi dan ' + VIDEOS.length + ' video tutorial.')}
      <div class="srch">${ic('search', 18)}<input placeholder="Cari panduan, artikel konservasi, SOP" value="${esc(EQ)}" oninput="EQ=this.value;drawEdu()"></div>
      <div class="chips" style="margin-top:12px">${cats.map(c => `<button class="chip ${EC === c ? 'on' : ''}" onclick="EC='${c}';render()">${c === 'Video' ? ic('video', 14) + ' ' : ''}${c}</button>`).join('')}<button class="chip ${EC === 'Tersimpan' ? 'on' : ''}" onclick="EC='Tersimpan';render()">${ic('download', 14)} Tersimpan (${sv.length})</button></div>
      <div class="grid two" style="margin-bottom:16px"><a class="card h feat" href="article.html?id=k5"><span class="bd bad">Prioritas Musim Kering</span>
      <h2>${k5.t}</h2>
      <p>${k5.s}</p>
      <small>${ic('clock', 14)} 3 menit baca · ${k5.c}</small></a>
      <div class="card quiz"><span class="bd ok">Tantangan Harian</span>
      <h3 style="margin:6px 0">Kuis Rimbawan Cilik</h3>
      <p class="mut" style="margin-bottom:10px">Jawab 3 pertanyaan singkat. Benar minimal 2 untuk meraih +20 poin.</p>
      <button class="btn" onclick="quizM()" ${qd ? 'disabled' : ''}>${qd ? 'Sudah diselesaikan hari ini' : 'Mulai Kuis (+20 poin)'}</button></div>
      </div>
      <p class="mut" style="font-size:.85rem;margin-bottom:10px">${EC === 'Tersimpan' ? 'Materi yang Anda simpan untuk dibaca luring muncul di sini.' : EC === 'Video' ? 'Tutorial lapangan dari YouTube. Tombol akan membuka YouTube di tab baru.' : 'Buka materi lalu tekan “Simpan untuk luring” agar muncul di tab Tersimpan.'}</p>
      <div id="ed" class="grid g-c"></div>`,
    'education',
    drawEdu
  ]
}
const acard = a => `<a class="card h" href="article.html?id=${a.id}"><span class="ib2">${ic(a.i, 20)}</span><span class="bd ok">${a.c}</span>
  <h3 style="margin:6px 0 4px">${a.t}</h3>
  <p class="mut" style="font-size:.9rem">${a.s}</p>
  ${D().saved.includes(a.id) ? `<span class="bd ok" style="margin-top:6px">${ic('download', 12)} Siap luring</span>` : ''}</a>`;
const vcard = v => `<div class="card h vid">
  <div class="vth ${v.yt ? '' : 'nov'}">${v.yt ? `<img src="https://img.youtube.com/vi/${v.yt}/hqdefault.jpg" alt="" onerror="this.remove()">` : ''}<span class="pl">${ic('play', 26)}</span></div>
  <span class="bd ok" style="margin-top:8px">${v.tag}</span>
  <h3 style="margin:6px 0">${v.t}</h3>
  <div class="row">${v.yt ? `<button class="btn s" onclick="ytPlay('${v.id}')">${ic('play', 14)} Putar</button>` : ''}<a class="btn o s" target="_blank" rel="noopener" href="${ytUrl(v)}">${ic('video', 14)} ${v.yt ? 'Buka di YouTube' : 'Cari di YouTube'}</a></div>
  </div>`;

function drawEdu() {
  const sv = D().saved,
    q = EQ.toLowerCase(),
    A = ART.filter(a => q ? (a.t + ' ' + a.s).toLowerCase().includes(q) : EC === 'Tersimpan' ? sv.includes(a.id) : EC !== 'Video' && a.c === EC),
    V = VIDEOS.filter(v => q ? v.t.toLowerCase().includes(q) : EC === 'Video');
  $('#ed').innerHTML = V.map(vcard).join('') + A.map(acard).join('') || `<div style="grid-column:1/-1">${empty(EC === 'Tersimpan' ? 'download' : 'search', EC === 'Tersimpan' ? 'Belum ada materi tersimpan' : 'Materi tidak ditemukan', 'Simpan materi dari halaman artikel agar tersedia di sini.')}</div>`
}

function ytPlay(id) {
  const v = VIDEOS.find(x => x.id === id);
  modal(`<h3>${v.t}</h3>
    <div class="yt"><iframe src="https://www.youtube.com/embed/${v.yt}" title="${esc(v.t)}" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div>
    <div class="acts"><a class="btn o" target="_blank" rel="noopener" href="${ytUrl(v)}">Buka di YouTube</a><button class="btn" onclick="closeM()">Tutup</button></div>`)
}

/* ----- KUIS HARIAN ----- */
let QZ = null;

function quizM() {
  const day = Math.floor(Date.now() / DAY);
  QZ = {
    L: [0, 1, 2].map(i => QUIZ[(day + i * 2) % QUIZ.length]),
    i: 0,
    s: 0
  };
  quizDraw()
}

function quizDraw() {
  const z = QZ;
  if (z.i >= z.L.length) {
    const ok = z.s >= 2,
      d = D(),
      td = ymd(Date.now());
    let msg = 'Belum lulus. Baca materi lalu coba lagi.';
    if (ok) {
      msg = 'Lulus!';
      if (!d.quizDone.includes(td)) {
        d.quizDone.push(td);
        d.pts += 20;
        notify('Kuis Rimbawan Cilik lulus. +20 poin.');
        save();
        msg = 'Lulus! +20 poin diperoleh.'
      }
    }
    modal(`<h3>Hasil Kuis</h3>
      <p style="font-size:1.4rem;font-weight:800;color:var(--p)">${z.s}/${z.L.length} benar</p>
      <p>${msg}</p>
      <div class="acts"><button class="btn" onclick="closeM();render()">Selesai</button></div>`);
    return
  }
  const q = z.L[z.i];
  modal(`<small>Pertanyaan ${z.i + 1} dari ${z.L.length}</small>
    <h3>${q.q}</h3>
    ${q.o.map((o, k) => `<button class="btn o sso" onclick="quizAns(${k})">${o}</button>`).join('')}`)
}

function quizAns(k) {
  const z = QZ,
    q = z.L[z.i],
    ok = k === q.a;
  if (ok) z.s++;
  modal(`<h3>${ok ? 'Benar!' : 'Kurang tepat'}</h3>
    <p>${q.e}</p>
    <div class="acts"><button class="btn" onclick="QZ.i++;quizDraw()">${z.i + 1 < z.L.length ? 'Lanjut' : 'Lihat hasil'}</button></div>`)
}

/* ----- ARTIKEL ----- */
function article() {
  const a = ART.find(x => x.id === QS.get('id')),
    d = D();
  if (!a) return [
    empty('book', 'Materi tidak ditemukan', '') + `<a class="btn" href="education.html">Kembali</a>`,
    'education'
  ];
  if (!d.learned.includes(a.id)) {
    d.learned.push(a.id);
    save()
  }
  const rel = ART.filter(x => x.c === a.c && x.id !== a.id).slice(0, 3);
  return [
    `<div class="card" style="max-width:760px;margin:12px auto"><span class="ib2">${ic(a.i, 22)}</span><span class="bd ok">${a.c}</span>
      <h1 style="margin:8px 0">${a.t}</h1>
      ${a.x.split('\n').map(p => `<p>${p}</p>`).join('')}${a.l ? `<h3 style="margin-top:16px">${a.c === 'Panduan Lapangan' || a.c === 'Panduan' ? 'Langkah-langkah' : 'Yang perlu dilakukan'}</h3>
        <ol>${a.l.map(x => `<li>${x}</li>`).join('')}</ol>` : ''}
      <a class="btn o s" style="margin:14px 8px 0 0" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(a.t)}">${ic('video', 16)} Tutorial YouTube</a><button class="btn o s" style="margin-top:14px" onclick="saveOff('${a.id}')">${ic('download', 16)} ${d.saved.includes(a.id) ? 'Hapus dari luring' : 'Simpan untuk luring'}</button>
      <p class="mut" style="margin-top:10px;font-size:.85rem">Dipelajari: ${d.learned.length}/${ART.length} materi · materi tersimpan ada di Edukasi › Tersimpan</p>
      </div>
      ${rel.length ? `<div style="max-width:760px;margin:0 auto">
        <h3 style="margin:14px 0 8px">Materi terkait</h3>
        <div class="grid g-c">${rel.map(x => `<a class="card h" href="article.html?id=${x.id}"><b>${x.t}</b><br><small>${x.s}</small></a>`).join('')}</div>
        </div>` : ''}`,
    'education'
  ]
}

function saveOff(id) {
  const d = D(),
    i = d.saved.indexOf(id);
  i < 0 ? d.saved.push(id) : d.saved.splice(i, 1);
  save();
  toast(i < 0 ? 'Tersimpan: buka Edukasi › Tersimpan' : 'Dihapus dari penyimpanan luring');
  render()
}

/* ----- REFLEKSI HARIAN ----- */
function streak(d) {
  const S = new Set((d.refl || []).map(r => r.date));
  let n = 0,
    t = Date.now();
  if (!S.has(ymd(t))) t -= DAY;
  while (S.has(ymd(t))) {
    n++;
    t -= DAY
  }
  return n
}

function weekDays() {
  const m = new Date();
  m.setHours(12, 0, 0, 0);
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return [0, 1, 2, 3, 4, 5, 6].map(i => ymd(m.getTime() + i * DAY))
}

function reflection() {
  const d = D();
  d.refl = d.refl || [];
  const S = new Set(d.refl.map(r => r.date)),
    td = ymd(Date.now()),
    sk = streak(d),
    wd = weekDays(),
    wc = wd.filter(k => S.has(k)).length,
    done = d.refl.find(r => r.date === td),
    pool = RF.filter(r => !RC || r[1] === RC),
    r = pool[Math.floor(Date.now() / DAY) % pool.length],
    tot = d.refl.reduce((s, x) => s + (x.pts || 0), 0);
  const nxt = sk < 3 ? [3, 15] : sk < 7 ? [7, 40] : sk < 14 ? [14, 80] : null;
  return [
    `${head('Refleksi Harian', 'Luangkan satu menit merenung. Poin bertambah, kebiasaan peduli alam ikut tumbuh.')}
      <div class="grid g-st">
      <div class="card stat c4"><span class="ib2">${ic('flame', 20)}</span><b>${sk}</b><small>Hari beruntun</small></div>
      <div class="card stat c3"><span class="ib2">${ic('calendar', 20)}</span><b>${wc}/7</b><small>Minggu ini</small></div>
      <div class="card stat c2"><span class="ib2">${ic('file', 20)}</span><b>${d.refl.length}</b><small>Total refleksi</small></div>
      <div class="card stat c1"><span class="ib2">${ic('award', 20)}</span><b>${tot}</b><small>Poin dari refleksi</small></div>
      </div>
      <div class="card" style="margin-top:16px">
      <div class="row2">
      <h3>Perjalanan Minggu Ini</h3>
      ${wc >= 5 ? `<span class="bd ok">${ic('award', 12)} Perenung Alam</span>` : `<small>${5 - wc} hari lagi untuk lencana Perenung Alam</small>`}</div>
      <div class="wk" style="margin-top:8px">${wd.map((k, i) => `<div>${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}<i class="${S.has(k) ? 'on' : ''} ${k === td ? 'td' : ''}">${S.has(k) ? ic('check', 16) : ''}</i></div>`).join('')}</div>
      ${nxt ? `<small>Lanjutkan sampai hari ke-${nxt[0]} berturut-turut untuk bonus +${nxt[1]} poin.</small>` : '<small>Anda sudah melewati semua bonus beruntun. Pertahankan!</small>'}</div>
      <div class="grid two" style="margin-top:16px">
      <div class="card" style="background:var(--dk);color:#fff">
      <div class="chips">${['Semua', ...RCAT].map(c => `<button class="chip ${(c === 'Semua' ? '' : c) === RC ? 'on' : ''}" onclick="RC='${c === 'Semua' ? '' : c}';render()">${c}</button>`).join('')}</div>
      <small style="color:#b9d4bd">${r[1]}${r[3] ? ' · ' + r[3] : ''}</small>
      <h2 style="margin:6px 0">${r[2]}</h2>
      <p>${r[4]}</p>
      <p style="margin-top:10px"><b>${r[5]}</b></p>
      ${done ? `<div class="card" style="margin-top:12px;background:rgba(255,255,255,.12);color:#fff;box-shadow:none"><b>${ic('check', 16)} Sudah direnungkan hari ini (+${done.pts || 0} poin)</b>
        <p style="font-size:.9rem">${esc(done.text)}</p>
        </div>` : `<textarea id="rt" rows="3" maxlength="300" placeholder="Tulis refleksimu (min. 15 karakter)" style="margin-top:12px"></textarea>
        <div id="err" class="err" style="color:#ffb4b4"></div>
        <button class="btn" style="margin-top:10px;background:#fff;color:var(--dk)" onclick="sendRefl('${r[0]}')">Simpan Refleksi (+10 poin)</button>`}</div>
      <div class="grid">
      <div class="card">
      <h3>Cara Mendapat Poin</h3>
      <ul><li>+10 poin untuk refleksi harian (1x per hari)</li><li>Bonus +15 pada hari ke-3 beruntun</li><li>Bonus +40 pada hari ke-7 beruntun</li><li>Bonus +80 pada hari ke-14 beruntun</li><li>5 hari dalam seminggu: lencana Perenung Alam</li></ul>
      </div>
      <div class="card">
      <h3>Refleksi Saya</h3>
      ${d.refl.slice().sort((a, b) => b.ts - a.ts).slice(0, 5).map(x => {
        const q = RF.find(z => z[0] === x.id);
        return `<div style="padding:8px 0;border-bottom:1px solid var(--sf)"><small>${fmt(x.ts)} · ${q ? q[2] : ''} · +${x.pts || 0}</small><br>${esc(x.text)}</div>`
      }).join('') || '<p class="mut">Belum ada refleksi.</p>'}</div>
      </div>
      </div>`,
    'reflection'
  ]
}

function sendRefl(id) {
  const d = D(),
    t = val('rt'),
    td = ymd(Date.now());
  d.refl = d.refl || [];
  if (d.refl.some(r => r.date === td)) {
    toast('Refleksi hari ini sudah tercatat.', 'warn');
    return
  }
  if (t.length < 15) {
    $('#err').textContent = 'Tulis minimal 15 karakter agar refleksi bermakna.';
    return
  }
  const e = { date: td, id, text: t, ts: Date.now() };
  d.refl.push(e);
  const s = streak(d),
    b = s === 3 ? 15 : s === 7 ? 40 : s === 14 ? 80 : 0;
  e.pts = 10 + b;
  d.pts += e.pts;
  notify(`Refleksi harian tersimpan: +${e.pts} poin${b ? ' (bonus ' + s + ' hari beruntun)' : ''}.`);
  if (weekDays().filter(k => d.refl.some(r => r.date === k)).length === 5) notify('Lencana Perenung Alam diraih! 5 refleksi dalam minggu ini.');
  save();
  toast(`+${e.pts} poin${b ? ' · bonus beruntun ' + s + ' hari' : ''}`);
  render()
}
PAGES.education = edu;
PAGES.article = article;
PAGES.reflection = reflection;
