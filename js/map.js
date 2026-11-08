/* ===== js/map.js ===== */
/* ----- PETA KAWASAN ----- */
const MF = { st: '', q: '', lbl: true };
let MAP,
  LAY,
  WID = null,
  ME,
  MEA,
  FOL = true,
  FIRST = 1,
  LP = null;
const mapPg = () => {
  const T = trs(),
    n = k => T.filter(t => st(t)[1] === k).length;
  return [
    `${head('Peta Kawasan', 'Sebaran pohon di ' + esc(AREAS[D().area].n))}
      <div class="srch mapsr">${ic('search', 18)}<input id="msq" autocomplete="off" placeholder="Cari kode pohon (mis. AKR-007) atau nama spesies" value="${esc(MF.q)}" oninput="MF.q=this.value;mapFind()" onkeydown="if(event.key==='Enter')mapFirst()">
      <div id="mres" class="mres"></div>
      </div>
      <div class="chips">${[
        ['', 'Semua (' + T.length + ')'],
        ['ok', 'Baik (' + n('ok') + ')'],
        ['warn', 'Perlu Perhatian (' + n('warn') + ')'],
        ['bad', 'Kritis (' + n('bad') + ')']
      ].map(c => `<button class="chip ${MF.st === c[0] ? 'on' : ''}" data-v="${c[0]}" onclick="setMF('${c[0]}')">${c[1]}</button>`).join('')}<button id="lb" class="chip" onclick="locateMe()">${ic('compass', 14)} Lokasi Saya</button><button class="chip" onclick="backArea()">${ic('map', 14)} Ke Kawasan</button><button id="lbl" class="chip on" onclick="toggleLbl()">${ic('tag', 14)} Label</button></div>
      <div class="mapw">
      <div id="map"></div>
      <a id="fab" class="fab" href="tree-new.html">${ic('plus', 20)} Tambah Pohon</a></div>
      <div id="lc" class="mut" style="font-size:.85rem;margin-top:8px"></div>
      <div id="sheet" class="card" style="margin-top:12px"></div>`,
    'map',
    initMap
  ]
};

function setMF(s) {
  MF.st = s;
  document.querySelectorAll('.chips .chip[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === s));
  drawPins()
}
const hit = (t, q) => (t.id + ' ' + t.name + ' ' + t.latin).toLowerCase().includes(q);

function mapFind() {
  const q = MF.q.trim().toLowerCase(),
    box = $('#mres');
  drawPins();
  if (!q) {
    box.innerHTML = '';
    return
  }
  const L = trs().filter(t => hit(t, q)).slice(0, 6);
  box.innerHTML = L.map(t => `<a onclick="mapPick('${t.id}')"><b>${t.id}</b> · ${esc(t.name)} <span class="bd ${st(t)[1]}">${st(t)[0]}</span></a>`).join('') || '<span class="mut" style="padding:8px">Tidak ditemukan</span>'
}

function mapPick(id) {
  const b = $('#mres');
  if (b) b.innerHTML = '';
  const t = tree(id);
  if (t) {
    focus(t);
    if (MAP) MAP.setView([t.lat, t.lng], 19)
  }
}

function mapFirst() {
  const q = MF.q.trim().toLowerCase(),
    t = trs().find(x => hit(x, q));
  if (t) mapPick(t.id)
}

function toggleLbl() {
  MF.lbl = !MF.lbl;
  $('#map').classList.toggle('nolabel', !MF.lbl);
  $('#lbl').classList.toggle('on', MF.lbl)
}

function initMap() {
  const d = D(),
    A = AREAS[d.area],
    f = QS.get('tree');
  if (typeof L === 'undefined') {
    $('#map').innerHTML = '<div class="emp">Peta memerlukan koneksi internet (Leaflet).</div>';
    return
  }
  MAP = L.map('map').setView([A.lat, A.lng], 17);
  mapBase(MAP);
  const pts = trs().map(t => [t.lat, t.lng]);
  if (pts.length) L.rectangle(L.latLngBounds(pts).pad(.15), { color: '#245B3A', weight: 2, dashArray: '6', fillOpacity: .05 }).addTo(MAP).bindTooltip('Batas plot kerja ' + d.area);
  LAY = L.layerGroup().addTo(MAP);
  drawPins();
  MAP.on('zoomend', () => $('#map').classList.toggle('lz', MAP.getZoom() < 16));
  MAP.on('moveend', () => {
    const c = MAP.getCenter(),
      a = $('#fab');
    if (a) a.href = 'tree-new.html?lat=' + c.lat.toFixed(5) + '&lng=' + c.lng.toFixed(5)
  });
  if (f && tree(f)) {
    const t = tree(f);
    MAP.setView([t.lat, t.lng], 19);
    focus(t)
  } else {
    $('#sheet').innerHTML = '<small>Ketuk pin pohon untuk melihat ringkasan. Hijau = baik, kuning = perlu cek, merah berdenyut = kritis.</small>';
    if (pts.length) MAP.fitBounds(pts, {
      padding: [30, 30]
    })
  }
  setTimeout(() => MAP.invalidateSize(), 250)
}

/* ----- PIN POHON ----- */
function drawPins() {
  if (!LAY) return;
  LAY.clearLayers();
  const q = MF.q.trim().toLowerCase();
  trs().filter(t => (!MF.st || st(t)[1] === MF.st) && (!q || hit(t, q))).forEach(t => {
    const s = st(t);
    L.marker([t.lat, t.lng], {
      icon: L.divIcon({
        className: '',
        html: `<div class="pinwrap">
          <div class="pin ${s[1]}"></div>
          <div class="plabel ${s[1]}"><b>${t.id}</b><span>${esc(t.name)} · ${s[0]}</span></div>
          </div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      })
    }).on('click', () => focus(t)).addTo(LAY)
  })
}

/* ----- RINGKASAN & RUTE ----- */
function focus(t) {
  $('#sheet').innerHTML = `<div class="flex">${ph(t, 'sm')}
    <div style="flex:1">
    <div class="row2"><b>${t.id} · ${esc(t.name)}</b>${badge(t)}</div>
    <small>Plot ${esc(t.plot)} · kelembapan ${mo(t)}% · ${age(t)} hari · ${t.lat.toFixed(5)}, ${t.lng.toFixed(5)}</small>
    <div id="dst" class="mut" style="font-size:.85rem">Menghitung jarak…</div>
    </div>
    </div>
    <div class="row" style="margin-top:10px"><a class="btn s" href="tree-detail.html?id=${t.id}">Buka Paspor</a><a class="btn o s" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${t.lat},${t.lng}">${ic('compass', 16)} Buka Rute Terdekat</a></div>`;
  (LP ? (cb => cb(LP)) : getPos)(p => {
    const m = Math.round(dist(p.lat, p.lng, t.lat, t.lng)),
      b = bearing(p.lat, p.lng, t.lat, t.lng);
    const e = $('#dst');
    if (e) e.textContent = `Jarak ${m} m ke arah ${b[1]} (${b[0]}°)${p.sim ? ' – dihitung dari pusat plot (lokasi simulasi)' : ''}`
  });
  if (MAP) MAP.panTo([t.lat, t.lng])
}

/* ----- LOKASI REAL-TIME ----- */
const lbl = on => {
  const b = $('#lb');
  if (b) {
    b.innerHTML = ic('compass', 14) + (on ? ' Hentikan Lokasi' : ' Lokasi Saya');
    b.classList.toggle('on', on)
  }
};

function stopLoc() {
  if (WID !== null && typeof navigator !== 'undefined') navigator.geolocation.clearWatch(WID);
  WID = null;
  LP = null;
  if (ME && MAP) {
    MAP.removeLayer(ME);
    MAP.removeLayer(MEA)
  }
  ME = null;
  const l = $('#lc');
  if (l) l.textContent = '';
  lbl(false)
}

function locateMe() {
  if (!MAP) {
    toast('Peta belum siap.', 'warn');
    return
  }
  if (WID !== null) {
    stopLoc();
    return
  }
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    toast('Browser tidak mendukung lokasi.', 'warn');
    return
  }
  FOL = true;
  FIRST = 1;
  lbl(true);
  $('#lc').textContent = 'Mencari sinyal lokasi…';
  WID = navigator.geolocation.watchPosition(p => {
    const ll = [p.coords.latitude, p.coords.longitude],
      a = p.coords.accuracy;
    LP = { lat: ll[0], lng: ll[1] };
    if (!ME) {
      MEA = L.circle(ll, { radius: a, color: '#3B6EA5', weight: 1, fillOpacity: .08 }).addTo(MAP);
      ME = L.circleMarker(ll, { radius: 8, color: '#fff', weight: 3, fillColor: '#3B6EA5', fillOpacity: 1 }).addTo(MAP).bindTooltip('Lokasi Anda (real-time)');
      ME.on('click', () => {
        FOL = true;
        MAP.panTo(ME.getLatLng())
      });
      MAP.off('dragstart');
      MAP.on('dragstart', () => {
        FOL = false
      })
    } else {
      ME.setLatLng(ll);
      MEA.setLatLng(ll);
      MEA.setRadius(a)
    }
    if (FIRST) {
      FIRST = 0;
      MAP.setView(ll, 17)
    } else if (FOL) MAP.panTo(ll);
    $('#lc').textContent = `Real-time aktif · ${ll[0].toFixed(5)}, ${ll[1].toFixed(5)} · akurasi ±${Math.round(a)} m · diperbarui ${new Date().toLocaleTimeString('id-ID')}` + (p.coords.speed ? ` · ${(p.coords.speed * 3.6).toFixed(1)} km/j` : '')
  }, e => {
    toast(e.code === 1 ? 'Izin lokasi ditolak. Izinkan akses lokasi pada browser.' : 'Lokasi tidak tersedia. Pastikan GPS aktif.', 'warn');
    stopLoc()
  }, { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 })
}

function backArea() {
  const d = D(),
    A = AREAS[d.area],
    p = trs().map(t => [t.lat, t.lng]);
  p.length ? MAP.fitBounds(p, {
    padding: [30, 30]
  }) : MAP.setView([A.lat, A.lng], 17)
}
PAGES.map = mapPg;
