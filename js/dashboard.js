/* ===== js/dashboard.js ===== */
/* ----- BERANDA ----- */
function dash() {
  const d = D(),
    T = trs(),
    c = { ok: 0, warn: 0, bad: 0 };
  T.forEach(t => c[st(t)[1]]++);
  const ms = missions(),
    A = AREAS[d.area],
    pct = T.length ? Math.round((T.length - c.bad) / T.length * 100) : 0,
    li = lvl(d.pts),
    need = T.filter(t => st(t)[1] !== 'ok').sort((a, b) => hs(a) - hs(b)).slice(0, 5),
    nx = nextEvent(d),
    wk = d.journal.filter(j => j.type !== 'registrasi' && Date.now() - j.ts < 7 * DAY).length;
  const S = (h, i, n, l, sb, k) => `<a class="card h stat ${k}" href="${h}"><span class="ib2">${ic(i, 20)}</span><b>${n}</b><small>${l}</small><em class="sub">${sb}</em></a>`;
  const msg = c.bad ? c.bad + ' pohon kritis butuh tindakan' : c.warn ? c.warn + ' pohon perlu dicek' : 'Semua pohon dalam kondisi baik';
  return [
    `<div class="hero2">
      <div class="hz"><span class="chip hc">${ic('pin', 14)} ${esc(A.n)} · ${d.area}</span>
      <h1>${msg}</h1>
      <p>${ms.length} misi aktif hari ini · ${d.pts} poin kepedulian</p>
      <div class="row hb"><a class="btn" href="missions.html">${ic('target', 18)} Mulai Misi</a><a class="btn o" href="journal-new.html">${ic('file', 18)} Catat Jurnal</a></div>
      </div>
      <div class="ring" style="--v:${pct}">
      <div><b>${pct}%</b><small>Tegakan sehat</small></div>
      </div>
      </div>
      <div class="grid g-st sts">${S('trees.html', 'tree', T.length, 'Pohon dirawat', (c.bad + c.warn) + ' butuh perhatian', 'c1') + S('trees.html?status=ok', 'leaf', c.ok, 'Pohon sehat', pct + '% dari total', 'c2') + S('journal.html', 'activity', actCount(d), 'Aktivitas perawatan', wk + ' dalam 7 hari', 'c3') + S('impact.html', 'award', d.pts, 'Poin kepedulian', 'Level ' + (li + 1) + ' · ' + LEVELS[li][1], 'c4')}</div>
      <div class="qa">${[
        ['tree-new.html', 'plus', 'Daftarkan Pohon', 'c1'],
        ['journal-new.html', 'file', 'Catat Jurnal', 'c2'],
        ['map.html', 'map', 'Buka Peta', 'c3'],
        ['chat.html', 'chat', 'Chat Tim', 'c4']
      ].map(q => `<a class="card h tile ${q[3]}" href="${q[0]}"><span class="ib2">${ic(q[1], 22)}</span><b>${q[2]}</b></a>`).join('')}</div>
      <div class="grid two" style="margin-top:16px">
      <div class="grid">
      <div class="card">
      <div class="row2">
      <h3>${ic('alert', 18)} Pohon yang Harus Segera Dicek</h3>
      <a class="btn o s" href="trees.html?status=bad">Lihat semua</a></div>
      ${need.map(t => `<a class="lr" href="tree-detail.html?id=${t.id}">${ph(t, 'sm')}
        <div class="lm"><b>${t.id} · ${esc(t.name)}</b><small>Plot ${esc(t.plot)} · kelembapan ${mo(t)}% · kesuburan ${fe(t)}%</small>
        <div class="pb"><i class="${st(t)[1]}" style="width:${hs(t)}%"></i></div>
        </div>
        ${badge(t)}</a>`).join('') || `<p class="mut" style="margin-top:10px">${ic('shield', 16)} Tidak ada pohon yang perlu segera dicek.</p>`}</div>
      <div class="card">
      <h3>Aktivitas Perawatan 7 Hari Terakhir</h3>
      <small>Jumlah misi selesai dan catatan jurnal per hari.</small>
      <div style="height:220px;margin-top:10px"><canvas id="cv"></canvas></div>
      <small>Sumbu X: tanggal · Sumbu Y: jumlah aktivitas</small></div>
      </div>
      <div class="grid">
      <div class="card">
      <h3>${ic('calendar', 18)} Jadwal Terdekat</h3>
      ${nx ? `<div class="evc"><b>${esc(nx.title)}</b><small>${fmt(new Date(nx.date + 'T12:00'))} · ${nx.time || '-'}${teamName(nx.team) ? ' · ' + esc(teamName(nx.team)) : ''}</small>
        <div class="row"><a class="btn s" href="calendar.html">Lihat kalender</a>${nx.team ? `<a class="btn o s" href="chat-room.html?c=team:${nx.team}">${ic('chat', 14)} Chat tim</a>` : ''}</div>
        </div>` : '<p class="mut">Belum ada jadwal mendatang.</p>'}</div>
      <div class="card">
      <div class="row2">
      <h3>${ic('target', 18)} Misi Prioritas</h3>
      <a class="btn o s" href="missions.html">Semua</a></div>
      ${ms.slice(0, 3).map(m => {
        const t = tree(m.tid);
        return `<a class="lr" href="mission.html?tree=${m.tid}&type=${m.ty}"><span class="ib2" style="margin:0">${ic(MIS[m.ty].ic, 20)}</span>
          <div class="lm"><b>${MIS[m.ty].n}</b><small>${t.id} · ${esc(t.name)}</small></div>
          <b style="color:var(--p)">+${m.pts}</b></a>`
      }).join('') || '<p class="mut">Semua misi sudah selesai.</p>'}</div>
      <div class="card motiv">
      <p>“Setiap tindakan kecil yang kamu lakukan hari ini adalah investasi bagi kehidupan di masa depan.”</p>
      </div>
      </div>
      </div>`,
    'dashboard',
    () => {
      const [L, V] = perDay(d.journal.filter(j => j.type !== 'registrasi'), 7);
      chart('cv', 'bar', L, V, 'Tanggal', 'Jumlah aktivitas')
    }
  ]
}
PAGES.dashboard = dash;
