/* ===== js/trees.js ===== */
/* ----- DIREKTORI POHON ----- */
const TF = { q: '', sp: '', st: QS.get('status') || '' };

function trees() {
  const d = D(),
    A = trs(),
    sps = [...new Set(A.map(t => t.sp))];
  return [
    `${head('Direktori Pohon', A.length + ' pohon terdata di kawasan ' + d.area, `<a class="btn" href="tree-new.html">${ic('plus', 18)} Registrasi Pohon Baru</a>`)}
      <div class="row">
      <div class="srch" style="flex:3">${ic('search', 18)}<input placeholder="Cari ID pohon atau spesies" value="${esc(TF.q)}" oninput="TF.q=this.value;drawTrees()"></div>
      <select onchange="TF.sp=this.value;drawTrees()"><option value="">Semua spesies</option>${sps.map(k => `<option value="${k}" ${TF.sp === k ? 'selected' : ''}>${SP[k] ? SP[k].n : 'Lainnya'}</option>`).join('')}</select></div>
      <div class="chips" style="margin-top:12px">${[
        ['', 'Semua'],
        ['ok', 'Baik'],
        ['warn', 'Perlu Cek'],
        ['bad', 'Kritis']
      ].map(c => `<button class="chip ${TF.st === c[0] ? 'on' : ''}" onclick="TF.st='${c[0]}';render()">${c[1]}</button>`).join('')}</div>
      <div id="cnt" class="row2" style="margin:-4px 0 12px;flex-wrap:wrap"></div>
      <div id="gr" class="grid g-c"></div>`,
    'trees',
    drawTrees
  ]
}

function drawTrees() {
  const all = trs(),
    w = TF.q.toLowerCase().split(/\s+/).filter(Boolean),
    act = w.length || TF.sp || TF.st,
    L = all.filter(t => {
      const h = (t.id + ' ' + t.name + ' ' + t.latin + ' plot ' + t.plot).toLowerCase();
      return w.every(x => h.includes(x)) && (!TF.sp || t.sp === TF.sp) && (!TF.st || st(t)[1] === TF.st)
    });
  $('#cnt').innerHTML = `<small>${L.length} dari ${all.length} pohon${act ? ' · filter aktif' : ''}</small>${act ? `<button class="btn o s" onclick="TF.q='';TF.sp='';TF.st='';render()">Reset filter</button>` : ''}`;
  $('#gr').innerHTML = L.length ? L.map(tcard).join('') : `<div style="grid-column:1/-1">${empty('search', 'Pohon tidak ditemukan', 'Tidak ada pohon yang cocok dengan semua filter aktif. Ubah kata kunci atau status, atau tekan Reset filter.')}</div>`
}
const nextCode = () => 'AKR-' + String(nextNo()).padStart(3, '0');

/* ----- REGISTRASI POHON ----- */
const treeNew = () => {
  const d = D();
  PH.tn = [];
  return [
    `${head('Registrasi Pohon Baru', 'Daftarkan bibit ke ekosistem AKAR; ID baru dibuat otomatis.')}
      <div class="card" style="max-width:720px">
      <label>Kode pohon (otomatis &amp; unik)</label><input id="kd" readonly value="${nextCode()}"><small>Jenis pohon yang sama boleh didaftarkan berkali-kali; setiap pohon mendapat kode berbeda.</small>
      <label>Spesies (${SPS.length} pilihan)</label><select id="sp" onchange="spPick()">${SPS.map(s => `<option value="${s[0]}">${s[1]} – ${s[2]}</option>`).join('')}<option value="lain">Lainnya (isi manual)</option></select>
      <div class="row">
      <div><label>Nama lokal</label><input id="nm"></div>
      <div><label>Nama latin</label><input id="lt"></div>
      </div>
      <div class="row">
      <div><label>Plot kawasan</label><input id="pl" value="A1"></div>
      <div><label>Tinggi (cm)</label><input id="h0" type="number" value="30"></div>
      <div><label>Diameter (cm)</label><input id="d0" type="number" step="0.1" value="0.5"></div>
      </div>
      <label>Koordinat GNSS</label>
      <div class="row"><input id="la" readonly placeholder="Latitude"><input id="ln" readonly placeholder="Longitude"><button class="btn o s" onclick="gps()">${ic('pin', 16)} Ambil GPS</button></div>
      ${gal('tn', 5, 'Foto bibit')}
      <div id="err" class="err"></div>
      <button class="btn" style="margin-top:14px" onclick="saveTree()">Simpan &amp; Buat ID</button></div>`,
    'trees',
    () => {
      spPick();
      if (QS.get('lat')) {
        $('#la').value = (+QS.get('lat')).toFixed(5);
        $('#ln').value = (+QS.get('lng')).toFixed(5)
      } else gps();
      galDraw('tn', 5)
    }
  ]
};

function spPick() {
  const s = SP[$('#sp').value];
  if (s) {
    $('#nm').value = s.n;
    $('#lt').value = s.l
  } else {
    $('#nm').value = '';
    $('#lt').value = ''
  }
}

function gps() {
  getPos(p => {
    $('#la').value = (p.lat + (p.sim ? (Math.random() - .5) * .001 : 0)).toFixed(5);
    $('#ln').value = (p.lng + (p.sim ? (Math.random() - .5) * .001 : 0)).toFixed(5)
  })
}

function saveTree() {
  const d = D(),
    nm = val('nm'),
    h = +val('h0'),
    dia = +val('d0'),
    la = +val('la'),
    ln = +val('ln');
  if (nm.length < 2 || !(h > 0) || !(dia > 0) || !la || !ln) {
    $('#err').textContent = 'Lengkapi nama pohon, tinggi, diameter, dan koordinat GPS.';
    return
  }
  const id = nextCode(),
    n = +id.split('-')[1],
    now = Date.now(),
    sp = $('#sp').value;
  d.seq = n;
  d.trees.push({
    id,
    tag: id,
    sp,
    name: nm,
    latin: val('lt'),
    plot: val('pl') || 'A1',
    lat: la,
    lng: ln,
    date: now,
    photo: (PH.tn || [])[0] || null,
    photos: PH.tn || [],
    area: d.area,
    h,
    dia,
    moist: 70,
    mTs: now,
    fert: 60,
    fTs: now,
    sync: now,
    lastCheck: now,
    batt: 100
  });
  jadd({
    tid: id,
    type: 'registrasi',
    leaf: 'Segar',
    stem: 'Kokoh',
    h,
    dia,
    note: 'Bibit didaftarkan dengan kode unik.',
    photos: PH.tn || []
  });
  d.pts += 20;
  notify(`${id} (${nm}) terdaftar di peta kawasan. +20 poin.`);
  PH.tn = [];
  save();
  location.href = 'tree-detail.html?id=' + id
}

/* ----- PASPOR POHON ----- */
function detail() {
  const t = tree(QS.get('id')),
    d = D();
  if (!t) return [
    `${head('Pohon tidak ditemukan')}<a class="btn" href="trees.html">Kembali</a>`,
    'trees'
  ];
  const ms = missions().filter(x => x.tid === t.id),
    J = d.journal.filter(j => j.tid === t.id).sort((a, b) => b.ts - a.ts).slice(0, 3),
    m = mo(t),
    f = fe(t),
    P = t.photos && t.photos.length ? t.photos : (t.photo ? [t.photo] : []);
  const meter = (l, i, v, c) => `<div style="margin:10px 0">
    <div class="row2"><span>${ic(i, 16)} ${l}</span><b>${v}%</b></div>
    <div class="pb"><i class="${c}" style="width:${v}%"></i></div>
    </div>`;
  return [
    `<div class="card tmapc">
      <div id="tmap"></div>
      <div class="tmo"><span class="chip">${ic('pin', 14)} ${(+t.lat).toFixed(5)}, ${(+t.lng).toFixed(5)}</span><span class="chip" id="tdst">${ic('compass', 14)} menghitung jarak…</span><a class="chip" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${t.lat},${t.lng}">${ic('map', 14)} Buka rute</a></div>
      </div>
      <div class="grid two" style="margin-top:16px">
      <div class="card">${ph(t, 'big')}${P.length > 1 ? `<div class="ths" style="margin-top:8px">${P.map(u => `<img class="th" src="${u}" alt="" onclick="lightbox(this.src)">`).join('')}</div>` : ''}
      <div class="row2" style="margin-top:12px">
      <h1 style="font-size:1.4rem">${esc(t.name)}</h1>
      ${badge(t)}</div>
      <p class="mut"><i>${esc(t.latin)}</i></p>
      <div class="chips"><span class="chip">${ic('qr', 14)} Kode ${esc(t.id)}</span><span class="chip">${ic('pin', 14)} Plot ${esc(t.plot)}</span><span class="chip">${ic('clock', 14)} ${age(t)} hari</span><span class="chip">${ic('globe', 14)} ${esc(t.area || d.area)}</span></div>
      <small>Ditanam ${fmt(t.date)}</small><br>
      <label class="btn o s" style="margin-top:10px">${ic('camera', 16)} Tambah foto (${P.length}/5)<input type="file" accept="image/*" multiple hidden onchange="addTreePhotos(this,'${t.id}')"></label>
      <h3 style="margin-top:18px">Riwayat Inspeksi Terkini</h3>
      ${J.map(j => `<div style="padding:10px 0;border-bottom:1px solid var(--sf)"><b>${TY[j.type]}</b> · <small>${fmtT(j.ts)}</small><br>${esc(j.note || '')}${thumbs(j.photos || (j.photo ? [j.photo] : []))}</div>`).join('') || '<p class="mut">Belum ada riwayat.</p>'}</div>
      <div class="grid">
      <div class="card">
      <div class="row2">
      <h3>${ic('wifi', 18)} Telemetri Sensor IoT</h3>
      <span class="bd ok">Terhubung</span></div>
      <small>Sensor tanah ${esc(t.id)}-S1 · sinkron ${fmtT(t.sync || Date.now())} · baterai ${t.batt}% · data simulasi</small>
      ${meter('Kelembapan tanah', 'drop', m, m < 40 ? 'bad' : m < 55 ? 'warn' : '')}${meter('Kesuburan tanah', 'leaf', f, f < 25 ? 'bad' : f < 45 ? 'warn' : '')}
      <div class="mini" style="font-size:.9rem"><span>${ic('ruler', 16)} Tinggi ${t.h} cm</span><span>Diameter ${t.dia} cm</span><span>${ic('wind', 16)} ${co2(t)} kg CO₂e (estimasi)</span></div>
      <button class="btn o s" style="margin-top:10px" onclick="syncSensor('${t.id}')">${ic('refresh', 16)} Sinkronkan sensor</button></div>
      <div class="card">
      <h3>Rekomendasi Tindakan</h3>
      ${recs(t).map(r => `<div class="card" style="margin-top:10px;box-shadow:none;border-left:4px solid var(--${r[0] === 'bad' ? 'dg' : r[0] === 'warn' ? 'wn' : 'lf'})"><b>${r[1]}</b>
        <p class="mut" style="font-size:.9rem">${r[2]}</p>
        </div>`).join('')}</div>
      <div class="grid">${ms.length ? `<a class="btn" href="mission.html?tree=${t.id}&type=${ms[0].ty}">${ic('tasks', 18)} Mulai Misi Perawatan</a>` : `<button class="btn" disabled>Tidak ada misi aktif</button>`}<a class="btn o" href="journal.html?tree=${t.id}">${ic('file', 18)} Jurnal Pertumbuhan</a><a class="btn o" href="journal-new.html?tree=${t.id}">${ic('plus', 18)} Tambah Catatan</a><a class="btn o" href="map.html?tree=${t.id}">${ic('map', 18)} Lihat di Peta</a><button class="btn d" onclick="delT('${t.id}')">${ic('trash', 18)} Hapus dari Koleksi</button></div>
      </div>
      </div>`,
    'trees',
    () => initTMap(t)
  ]
}

/* ----- PETA POHON ----- */
function initTMap(t) {
  const box = $('#tmap');
  if (typeof L === 'undefined') {
    if (box) box.innerHTML = '<div class="emp">Peta memerlukan koneksi internet.</div>';
    return
  }
  const M = L.map('tmap', { zoomControl: false }).setView([t.lat, t.lng], 18);
  mapBase(M);
  L.control.zoom({ position: 'bottomright' }).addTo(M);
  trs().filter(x => x.id !== t.id).forEach(x => L.circleMarker([x.lat, x.lng], { radius: 5, color: '#fff', weight: 2, fillColor: '#6f8a78', fillOpacity: .9 }).addTo(M).bindTooltip(x.id));
  L.marker([t.lat, t.lng], {
    icon: L.divIcon({
      className: '',
      html: `<div class="pinwrap">
        <div class="pin ${st(t)[1]}"></div>
        <div class="plabel ${st(t)[1]}"><b>${t.id}</b><span>${esc(t.name)} · ${st(t)[0]}</span></div>
        </div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    })
  }).addTo(M);
  getPos(p => {
    const e = $('#tdst');
    if (e) e.textContent = 'Jarak ' + Math.round(dist(p.lat, p.lng, t.lat, t.lng)) + ' m' + (p.sim ? ' (dari pusat kawasan)' : ' dari lokasi Anda')
  });
  setTimeout(() => M.invalidateSize(), 250)
}

function addTreePhotos(inp, id) {
  const t = tree(id),
    room = 5 - (t.photos || []).length;
  if (room <= 0) {
    toast('Maksimal 5 foto per pohon.', 'warn');
    return
  }
  pickMany([...inp.files], room, L => {
    t.photos = (t.photos || []).concat(L.filter(Boolean));
    t.photo = t.photos[0];
    save();
    toast('Foto ditambahkan');
    render()
  })
}

function syncSensor(id) {
  const t = tree(id);
  t.sync = Date.now();
  save();
  toast('Data sensor diperbarui');
  render()
}
const delT = id => confirmD(`Hapus <b>${esc(id)}</b> beserta seluruh riwayat jurnalnya?`, () => {
  const d = D();
  d.trees = d.trees.filter(t => t.id !== id);
  d.journal = d.journal.filter(j => j.tid !== id);
  save();
  toast('Pohon dihapus', 'warn');
  location.href = 'trees.html'
}, 'Hapus');
PAGES.trees = trees;
PAGES.treenew = treeNew;
PAGES.tree = detail;
