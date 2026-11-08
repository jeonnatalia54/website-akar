/* ===== js/impact.js ===== */
/* ----- JEJAK KEPEDULIAN ----- */
function impact() {
  const d = D(),
    u = me(),
    T = trs(),
    [L, V] = carbonSeries(),
    tot = +T.reduce((s, t) => s + co2(t), 0).toFixed(1),
    c = { ok: 0, warn: 0, bad: 0 };
  T.forEach(t => c[st(t)[1]]++);
  const surv = T.length ? Math.round((T.length - c.bad) / T.length * 100) : 0,
    li = lvl(d.pts),
    nx = LEVELS[li + 1],
    ok = d.pts >= 200 && T.length >= 5,
    sp = {};
  T.forEach(t => {
    const k = SP[t.sp] ? SP[t.sp].n : t.name;
    sp[k] = (sp[k] || 0) + 1
  });
  const spL = Object.entries(sp).sort((a, b) => b[1] - a[1]).slice(0, 5),
    mx = spL.length ? spL[0][1] : 1,
    docs = d.journal.filter(inArea).flatMap(j => j.photos || (j.photo ? [j.photo] : [])).slice(0, 6),
    pc = n => T.length ? Math.round(n / T.length * 100) : 0,
    a1 = pc(c.ok),
    a2 = a1 + pc(c.warn),
    now = new Date(),
    A6 = [
      [],
      []
    ];
  for (let i = 5; i >= 0; i--) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    A6[0].push(m.toLocaleDateString('id-ID', { month: 'short' }));
    A6[1].push(d.journal.filter(j => j.type !== 'registrasi' && new Date(j.ts).getMonth() === m.getMonth() && new Date(j.ts).getFullYear() === m.getFullYear()).length)
  }
  const B = [
    ['Penjaga Bibit', 'sprout', T.length >= 1],
    ['Sahabat Pohon', 'leaf', actCount(d) >= 5],
    ['Penjaga Hutan', 'tree', T.length >= 10],
    ['Pahlawan Lingkungan', 'award', d.pts >= 500]
  ];
  return [
    `${head('Jejak Kepedulian', 'Dampak perawatan Anda di ' + esc(AREAS[d.area].n) + ' (estimasi simulasi).')}
      <div class="grid g-st">${[
        ['tree', T.length, 'Pohon terdata'],
        ['shield', surv + '%', 'Tingkat kelangsungan hidup'],
        ['wind', tot + ' kg', 'Estimasi serapan CO₂e'],
        ['award', d.pts, 'Poin kepedulian']
      ].map((s, i) => `<div class="card stat c${i + 1}"><span class="ib2">${ic(s[0], 20)}</span><b>${s[1]}</b><small>${s[2]}</small></div>`).join('')}</div>
      <div class="grid two" style="margin-top:16px">
      <div class="grid">
      <div class="card">
      <h3>Aktivitas Patroli & Jurnal</h3>
      <small>Jumlah catatan jurnal dan misi per bulan (6 bulan terakhir).</small>
      <div style="height:220px;margin-top:10px"><canvas id="cv2"></canvas></div>
      </div>
      <div class="card">
      <h3>Serapan Karbon 6 Bulan Terakhir</h3>
      <small>Estimasi akumulasi CO₂e seluruh pohon (kg), dari tinggi dan diameter.</small>
      <div style="height:230px;margin-top:10px"><canvas id="cv"></canvas></div>
      </div>
      <div class="card">
      <h3>Dokumentasi Petak</h3>
      ${docs.length ? `<div class="ths" style="margin-top:10px">${docs.map(u => `<img class="th big" src="${u}" alt="" onclick="lightbox(this.src)">`).join('')}</div>` : '<p class="mut">Foto dari jurnal dan misi akan muncul di sini.</p>'}</div>
      </div>
      <div class="grid">
      <div class="card">
      <h3>Kesehatan Tegakan</h3>
      <div class="flex" style="margin-top:12px">
      <div class="donut" style="--g:conic-gradient(var(--lf) 0 ${a1}%,var(--wn) ${a1}% ${a2}%,var(--dg) ${a2}% 100%)">
      <div><b>${T.length}</b><small>pohon</small></div>
      </div>
      <div class="lm">${[
        ['ok', 'Sehat optimal', c.ok],
        ['warn', 'Butuh perhatian', c.warn],
        ['bad', 'Kritis', c.bad]
      ].map(r => `<div class="row2" style="padding:4px 0"><span><i class="dt ${r[0]}"></i> ${r[1]}</span><b>${r[2]} (${pc(r[2])}%)</b></div>`).join('')}</div>
      </div>
      </div>
      <div class="card">
      <h3>Spesies Pohon Asuh</h3>
      ${spL.map(r => `<div style="margin:10px 0">
        <div class="row2"><b>${esc(r[0])}</b><small>${r[1]} pohon</small></div>
        <div class="pb"><i style="width:${r[1] / mx * 100}%"></i></div>
        </div>`).join('') || '<p class="mut">Belum ada pohon.</p>'}</div>
      <div class="card">
      <h3>Level: ${LEVELS[li][1]}</h3>
      <div class="pb" style="margin:10px 0"><i style="width:${nx ? Math.min(100, (d.pts - LEVELS[li][0]) / (nx[0] - LEVELS[li][0]) * 100) : 100}%"></i></div>
      <small>${nx ? (nx[0] - d.pts) + ' poin lagi menuju ' + nx[1] : 'Level tertinggi tercapai'}</small>
      <div class="grid g-st" style="margin-top:12px">${B.map(b => `<div style="text-align:center;opacity:${b[2] ? 1 : .4}"><span class="ib2" style="margin:0 auto 4px">${ic(b[1], 20)}</span><small>${b[0]}</small></div>`).join('')}</div>
      </div>
      <div class="card">
      <h3>e-Sertifikat Jagawana</h3>
      <p class="mut" style="font-size:.9rem">Syarat: ≥ 200 poin dan ≥ 5 pohon dirawat.</p>
      <button class="btn" style="margin-top:8px" ${ok ? '' : 'disabled'} onclick="cert()">${ic('file', 16)} Lihat Sertifikat</button></div>
      </div>
      </div>`,
    'impact',
    () => {
      chart('cv2', 'bar', A6[0], A6[1], 'Bulan', 'Jumlah aktivitas');
      chart('cv', 'bar', L, V, 'Bulan', 'kg CO₂e (estimasi)', 1)
    }
  ]
}

/* ----- E-SERTIFIKAT ----- */
const cert = () => {
  const u = me(),
    d = D();
  modal(`<div class="cert"><small>SERTIFIKAT KEPEDULIAN</small>
    <h2 style="margin:8px 0">${esc(u.name)}</h2>
    <p>telah merawat ${d.trees.length} pohon di kawasan ${esc(AREAS[d.area].n)} dan meraih ${d.pts} poin dengan level ${LEVELS[lvl(d.pts)][1]}.</p>
    <small>Diterbitkan ${fmt(Date.now())} · dokumen simulasi prototype</small></div>
    <div class="acts"><button class="btn o" onclick="closeM()">Tutup</button><button class="btn" onclick="window.print()">Cetak</button></div>`)
};
PAGES.impact = impact;
