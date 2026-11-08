/* ===== js/journal.js ===== */
/* ----- JURNAL ----- */
const JF = { tree: QS.get('tree') || '', type: '' };

function journal() {
  const d = D();
  let L = d.journal.filter(j => inArea(j) && (!JF.tree || j.tid === JF.tree) && (!JF.type || j.type === JF.type)).sort((a, b) => b.ts - a.ts);
  const t0 = JF.tree && tree(JF.tree);
  return [
    `${head('Jurnal Pertumbuhan', 'Riwayat inspeksi dan perawatan, terbaru di atas.', `<button class="btn" onclick="jgo()">${ic('plus', 18)} Tambah Catatan</button>`)}
      <div class="row"><select onchange="JF.tree=this.value;render()"><option value="">Semua pohon</option>${trs().map(t => `<option value="${t.id}" ${JF.tree === t.id ? 'selected' : ''}>${t.id} · ${esc(t.name)}</option>`).join('')}</select><select onchange="JF.type=this.value;render()"><option value="">Semua jenis</option>${Object.keys(TY).map(k => `<option value="${k}" ${JF.type === k ? 'selected' : ''}>${TY[k]}</option>`).join('')}</select></div>
      <div class="grid two" style="margin-top:16px">
      <div class="card">
      <h3>Timeline</h3>
      <div class="tl" style="margin-top:14px">${L.slice(0, 40).map(j => {
        const t = tree(j.tid);
        return `<div><b>${TY[j.type]}</b> · ${t ? esc(t.id + ' ' + t.name) : '(dihapus)'} ${j.queued ? '<span class="bd warn">Antre sinkron</span>' : ''}<br><small>${fmtT(j.ts)}</small>
          <div class="mini">${j.leaf && j.leaf !== '-' ? `<span>Daun: ${j.leaf}</span><span>Batang: ${j.stem}</span>` : ''}<span>${ic('ruler', 14)}${j.h} cm</span>${j.moist != null ? `<span>${ic('drop', 14)}${j.moist}%</span>` : ''}</div>
          ${j.note ? `<p>${esc(j.note)}</p>` : ''}${thumbs(j.photos || (j.photo ? [j.photo] : []))}</div>`
      }).join('') || '<p class="mut">Belum ada entri.</p>'}</div>
      </div>
      <div class="card">
      <h3>${t0 ? 'Pertumbuhan Tinggi ' + esc(t0.id) : 'Aktivitas 14 Hari Terakhir'}</h3>
      <small>${t0 ? 'Tinggi pohon (cm) dari setiap catatan.' : 'Jumlah catatan jurnal dan misi per hari.'}</small>
      <div style="height:240px;margin-top:10px"><canvas id="cv"></canvas></div>
      </div>
      </div>`,
    'journal',
    () => {
      if (t0) {
        const E = d.journal.filter(j => j.tid === t0.id && j.h).sort((a, b) => a.ts - b.ts);
        chart('cv', 'line', E.map(j => new Date(j.ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })), E.map(j => j.h), 'Tanggal catatan', 'Tinggi (cm)')
      } else {
        const [a, b] = perDay(L, 14);
        chart('cv', 'bar', a, b, 'Tanggal', 'Jumlah entri')
      }
    }
  ]
}
const jgo = () => JF.tree ? location.href = 'journal-new.html?tree=' + JF.tree : location.href = 'journal-new.html';

/* ----- FORM CATAT JURNAL ----- */
const JN = { leaf: 'Segar', stem: 'Kokoh' };
const jnew = () => {
  const d = D();
  PH.jn = [];
  const t = tree(QS.get('tree')) || trs()[0];
  if (!t) return [empty('tree', 'Belum ada pohon', 'Daftarkan pohon dulu.'), 'journal'];
  const sg = (k, L) => `<div class="segs">${L.map(x => `<button type="button" class="chip ${JN[k] === x ? 'on' : ''}" data-k="${k}" data-v="${x}" onclick="seg('${k}','${x}')">${x}</button>`).join('')}</div>`;
  return [
    `${head('Tambah Catatan Jurnal', 'Observasi langsung di lokasi pohon.')}
      <div class="card" style="max-width:700px"><label>Pohon</label><select id="jt">${trs().map(x => `<option value="${x.id}" ${x.id === t.id ? 'selected' : ''}>${x.id} · ${esc(x.name)}</option>`).join('')}</select>
      <label>Kondisi daun</label>${sg('leaf', ['Segar', 'Layu', 'Hama'])}<label>Kondisi batang</label>${sg('stem', ['Kokoh', 'Retak', 'Terluka'])}
      <div class="row">
      <div><label>Tinggi terkini (cm)</label>
      <div class="stp"><button class="btn o" type="button" onclick="stp('jh',-1)">−</button><input id="jh" type="number" value="${t.h}"><button class="btn o" type="button" onclick="stp('jh',1)">+</button></div>
      </div>
      <div><label>Diameter (cm)</label><input id="jd" type="number" step="0.1" value="${t.dia}"></div>
      </div>
      ${gal('jn', 5, 'Foto bukti lapangan')}<label>Catatan</label><textarea id="jc" rows="3" maxlength="300"></textarea>
      <div id="err" class="err"></div>
      <button class="btn" style="margin-top:14px" onclick="saveJ()">Simpan Catatan</button></div>`,
    'journal',
    () => galDraw('jn', 5)
  ]
};
const seg = (k, v) => {
  JN[k] = v;
  document.querySelectorAll(`[data-k="${k}"]`).forEach(b => b.classList.toggle('on', b.dataset.v === v))
};
const stp = (id, n) => {
  $('#' + id).value = Math.max(1, +$('#' + id).value + n)
};

function saveJ() {
  const d = D(),
    t = tree(val('jt')),
    h = +val('jh'),
    dia = +val('jd');
  if (!t || !(h > 0) || !(dia > 0)) {
    $('#err').textContent = 'Tinggi dan diameter harus berupa angka lebih dari 0.';
    return
  }
  const first = !d.journal.some(j => j.tid === t.id && j.type === 'inspeksi' && ymd(j.ts) === ymd(Date.now()));
  t.h = h;
  t.dia = dia;
  t.lastCheck = Date.now();
  const e = jadd({
    tid: t.id,
    type: 'inspeksi',
    leaf: JN.leaf,
    stem: JN.stem,
    h,
    dia,
    note: val('jc'),
    photos: PH.jn || []
  });
  PH.jn = [];
  if (first) {
    d.pts += 10;
    notify(`Catatan jurnal ${e.id} tersimpan. +10 poin.`)
  }
  save();
  location.href = 'journal-ok.html?id=' + e.id + '&tree=' + t.id
}

/* ----- KONFIRMASI JURNAL ----- */
const jok = () => {
  const t = QS.get('tree'),
    e = D().journal.find(j => j.id === QS.get('id'));
  return [
    `<div class="card" style="max-width:520px;margin:30px auto;text-align:center">
      <div style="width:84px;height:84px;border-radius:50%;background:var(--sf);color:var(--p);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">${ic('check', 44)}</div>
      <h2>Jurnal Berhasil Disimpan</h2>
      <p class="mut">ID entri: <b>${e ? e.id : '-'}</b>${e && e.queued ? '<br>Mode lapangan offline: menunggu sinkronisasi.' : ''}<br>Terima kasih atas pencatatan Anda hari ini.</p>
      <div class="grid" style="margin-top:16px"><a class="btn" href="tree-detail.html?id=${t}">Kembali ke Paspor Pohon</a><a class="btn o" href="journal.html?tree=${t}">Lihat Jurnal</a></div>
      </div>`,
    'journal'
  ]
};
PAGES.journal = journal;
PAGES.jnew = jnew;
PAGES.jok = jok;
