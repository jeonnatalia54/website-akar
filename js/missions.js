/* ===== js/missions.js ===== */
/* ----- DAFTAR MISI ----- */
function missionsPg() {
  const d = D(),
    ms = missions(),
    today = d.done.filter(x => ymd(x.ts) === ymd(Date.now()));
  return [
    `${head('Misi Harian', 'Dibangkitkan otomatis dari kondisi sensor pohon. ' + ms.length + ' misi aktif.')}
      <div class="grid g-c">${ms.map(m => {
        const t = tree(m.tid),
          M = MIS[m.ty];
        return `<a class="card h" style="border-left:5px solid var(--${m.urg ? 'dg' : 'wn'})" href="mission.html?tree=${m.tid}&type=${m.ty}">
          <div class="row2"><span class="bd ${m.urg ? 'bad' : 'warn'}">${m.urg ? 'Prioritas Tinggi' : 'Rutin'}</span><b style="color:var(--p)">+${m.pts} poin</b></div>
          <h3 style="margin:8px 0 4px">${ic(M.ic, 20)} ${M.n}</h3>
          <p>${t.id} · ${esc(t.name)} · Plot ${esc(t.plot)}</p>
          <small>${ic('clock', 14)} ±${M.min} menit · kelembapan ${mo(t)}% · kesuburan ${fe(t)}%</small></a>`
      }).join('') || `<div style="grid-column:1/-1">${empty('shield', 'Semua misi selesai', 'Tidak ada pohon yang memerlukan tindakan saat ini.')}</div>`}</div>
      <h2 style="margin:22px 0 10px">Selesai Hari Ini (${today.length})</h2>
      <div class="grid g-c">${today.map(x => `<div class="card">${ic('check', 18)} <b>${MIS[x.ty].n}</b> · ${x.tid}<br><small>${fmtT(x.ts)} · +${x.pts} poin</small></div>`).join('') || '<p class="mut">Belum ada misi diselesaikan hari ini.</p>'}</div>`,
    'missions'
  ]
}

/* ----- DETAIL MISI ----- */
const MS = {
  c: [0, 0, 0],
  photos: []
};
let TMI = null,
  TMS = 0;

function missionPg() {
  const tid = QS.get('tree'),
    ty = QS.get('type'),
    t = tree(tid),
    M = MIS[ty],
    m = missions().find(x => x.tid === tid && x.ty === ty);
  if (!t || !M || !m) return [
    `${empty('check', 'Misi tidak tersedia', 'Misi ini sudah selesai atau kondisi pohon sudah membaik.')}`,
    'missions'
  ];
  MS.c = [0, 0, 0];
  MS.photos = [];
  PH.ms = [];
  TMS = M.min * 60;
  PHCB.ms = L => {
    MS.photos = L;
    mupd()
  };
  return [
    `${head(M.n, esc(t.id) + ' · ' + esc(t.name) + ' · Plot ' + esc(t.plot))}
      <div class="grid two">
      <div class="grid">
      <div class="card">
      <div class="row2"><span class="bd ${m.urg ? 'bad' : 'warn'}">${m.urg ? 'Prioritas Tinggi' : 'Rutin'}</span><b style="color:var(--p)">+${m.pts} poin</b></div>
      <div class="tm" id="tm">${String(M.min).padStart(2, '0')}:00</div>
      <div class="row" style="justify-content:center"><button class="btn o s" onclick="tmGo()">${ic('clock', 16)} Mulai Timer</button></div>
      <p class="mut" style="margin-top:10px">Kelembapan ${mo(t)}% · kesuburan ${fe(t)}%</p>
      </div>
      <div class="card">
      <h3>Peralatan</h3>
      <div class="chips">${M.tools.map(x => `<span class="chip">${x}</span>`).join('')}</div>
      </div>
      </div>
      <div class="card">
      <h3>SOP &amp; Checklist</h3>
      ${M.steps.map((s, i) => `<label class="chk"><input type="checkbox" onchange="MS.c[${i}]=this.checked?1:0;mupd()"> <span>${i + 1}. ${s}</span></label>`).join('')}
      <div class="chk" style="cursor:default"><span>${M.steps.length + 1}. Dokumentasi foto hasil perawatan (wajib, 1–5 foto)</span></div>
      ${gal('ms', 5, 'Foto dokumentasi')}
      <button id="fin" class="btn" style="width:100%;margin-top:14px" disabled onclick="mfin('${tid}','${ty}')">Selesaikan Misi (+${m.pts} Poin)</button><small>Tombol aktif setelah semua langkah dicentang dan foto diunggah.</small></div>
      </div>`,
    'missions',
    () => galDraw('ms', 5)
  ]
}
const mupd = () => {
  const b = $('#fin');
  if (b) b.disabled = !(MS.c.every(x => x) && MS.photos.length)
};

function tmGo() {
  if (TMI) return;
  TMI = setInterval(() => {
    TMS = Math.max(0, TMS - 1);
    const e = $('#tm');
    if (e) e.textContent = String(Math.floor(TMS / 60)).padStart(2, '0') + ':' + String(TMS % 60).padStart(2, '0');
    if (!TMS) {
      clearInterval(TMI);
      TMI = null
    }
  }, 1000)
}

function mfin(tid, ty) {
  if (!(MS.c.every(x => x) && MS.photos.length)) {
    toast('Lengkapi checklist dan foto dulu.', 'warn');
    return
  }
  const r = finish(tid, ty, MS.photos);
  if (!r) {
    toast('Misi sudah selesai.', 'warn');
    return
  }
  location.href = 'mission-done.html'
}

/* ----- MISI SELESAI ----- */
function mdone() {
  const r = JSON.parse(sessionStorage.getItem('akar_last') || 'null'),
    d = D();
  if (!r) return [
    empty('target', 'Tidak ada data misi', 'Buka daftar misi untuk memulai.') + `<a class="btn" href="missions.html">Ke Misi</a>`,
    'missions'
  ];
  const nx = LEVELS[r.lv + 1];
  return [
    `<div class="card" style="max-width:540px;margin:24px auto;text-align:center">
      <div style="width:84px;height:84px;border-radius:50%;background:var(--sf);color:var(--p);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">${ic('award', 44)}</div>
      <h2>Misi Selesai!</h2>
      <p style="font-size:1.6rem;font-weight:800;color:var(--p)">+${r.pts} Poin Kepedulian</p>
      <div class="card" style="box-shadow:none;background:var(--sf);margin:14px 0;text-align:left"><b>${r.tid} · ${esc((tree(r.tid) || { name: '' }).name)}</b><br>Status: ${r.before} → <b>${r.after}</b> · Kelembapan sekarang ${r.moist}%</div>
      <p class="mut">Level: ${LEVELS[r.lv][1]} · total ${d.pts} poin${nx ? ' · ' + (nx[0] - d.pts) + ' poin lagi menuju ' + nx[1] : ''}</p>
      <div class="grid" style="margin-top:14px"><a class="btn" href="missions.html">Kembali ke Misi</a><a class="btn o" href="tree-detail.html?id=${r.tid}">Lihat Paspor</a><a class="btn o" href="impact.html">Jejak Kepedulian</a></div>
      </div>`,
    'missions'
  ]
}
PAGES.missions = missionsPg;
PAGES.mission = missionPg;
PAGES.mdone = mdone;
