/* ===== js/profile.js ===== */
/* ----- KOMPONEN BARIS PENGATURAN ----- */
const row = (
  i,
  t,
  dsc,
  right,
  click,
) => `<div class="set${click ? " clk" : ""}" ${click ? `onclick="${click}"` : ""}><span class="ib2" style="margin:0">${ic(i, 18)}</span>
  <div class="lm"><b>${t}</b>${dsc ? `<small>${dsc}</small>` : ""}</div>
  ${right || ""}</div>`;
const tgl = (on, fn) =>
  `<label class="sw2"><input type="checkbox" ${on ? "checked" : ""} onchange="${fn}"><i></i></label>`;
const chev = ic("right", 16);

/* ----- BAGIAN PENGATURAN ----- */
function secPref() {
  const d = D(),
    s = d.set,
    th = getTheme(),
    q = d.journal.filter((j) => j.queued).length;
  return (
    `<h3 class="sh">Preferensi Lapangan & Sistem</h3>
    <div class="card slist">` +
    row(
      "wifi",
      "Mode Siaga Lapangan",
      "Catatan disimpan lokal dan diantrekan (" + q + " menunggu)",
      tgl(
        s.offline,
        "D().set.offline=this.checked;save();toast(this.checked?'Mode offline aktif':'Mode offline dimatikan')",
      ),
    ) +
    row(
      "bell",
      "Pengingat Patroli & Cuaca",
      "Notifikasi jadwal dan kondisi pohon",
      tgl(
        s.notif,
        "D().set.notif=this.checked;save();toast('Pengaturan disimpan')",
      ),
    ) +
    row(
      "pin",
      "Akurasi Tinggi GNSS/GPS",
      "Gunakan GPS presisi untuk koordinat dan rute",
      tgl(
        s.gps,
        "D().set.gps=this.checked;save();toast('Pengaturan disimpan')",
      ),
    ) +
    row(
      th === "gelap" ? "moon" : "sun",
      "Tema Tampilan",
      "Terang, gelap, atau ikuti perangkat",
      `<div class="segs">${[
        ["terang", "Terang"],
        ["gelap", "Gelap"],
        ["otomatis", "Otomatis"],
      ]
        .map(
          (t) =>
            `<button class="chip ${th === t[0] ? "on" : ""}" onclick="setTheme('${t[0]}');render()">${t[1]}</button>`,
        )
        .join("")}</div>`,
    ) +
    row(
      "globe",
      "Bahasa Aplikasi",
      "",
      `<select style="width:auto" onchange="D().set.lang=this.value;save();toast('Bahasa disimpan')"><option value="id" ${s.lang === "id" ? "selected" : ""}>Bahasa Indonesia</option><option value="en" ${s.lang === "en" ? "selected" : ""}>English (segera hadir)</option></select>`,
    ) +
    row(
      "file",
      "Teks Lebih Besar",
      "",
      tgl(s.big, "D().set.big=this.checked;sync()"),
    ) +
    row(
      "refresh",
      "Sinkronisasi",
      "Antrean catatan dan posisi GPS",
      `<div class="row" style="flex-wrap:wrap;gap:6px"><button class="btn o s" style="flex:1;min-width:90px" onclick="flushQ()">Sinkronkan</button><button class="btn o s" style="flex:1;min-width:60px" onclick="gpsSync()">GPS</button></div>`,
    ) +
    `</div>
    <div id="gs" class="mut" style="margin-top:6px;font-size:.85rem"></div>`
  );
}

function secSec() {
  return (
    `<h3 class="sh">Keamanan & Data</h3>
    <div class="card slist">` +
    row(
      "lock",
      "Ubah Kata Sandi",
      "Perbarui kata sandi akun",
      chev,
      "passM()",
    ) +
    row(
      "download",
      "Unduh Data Saya",
      "Ekspor jurnal, pohon, dan pengaturan (JSON)",
      chev,
      "exportData()",
    ) +
    row(
      "refresh",
      "Reset Data Akun",
      "Kembalikan ke data awal",
      chev,
      "confirmD('Reset seluruh data akun ini ke kondisi awal?',()=>{db.data[db.session]=newData(me().area,me().username==='demo'?18:6);if(me().username==='demo')demoize(D());save();toast('Data direset','warn');render()},'Reset')",
    ) +
    row(
      "trash",
      "Hapus Akun",
      "Hapus akun dan semua datanya",
      chev,
      "delAcc()",
    ) +
    `</div>`
  );
}

function secHelp() {
  return (
    `<h3 class="sh">Bantuan & Informasi</h3>
    <div class="card slist">` +
    row(
      "help",
      "Panduan & Kontak Posko",
      "Bantuan lapangan dan hubungi koordinator",
      chev,
      "legal('help')",
    ) +
    row("shield", "Kebijakan Privasi", "", chev, "legal('priv')") +
    row("file", "Syarat & Ketentuan", "", chev, "legal('terms')") +
    row("info", "Tentang AKAR", "Versi 2.1 (prototype)", chev, "aboutM()") +
    row("logout", "Keluar", "Akhiri sesi di perangkat ini", chev, "logout()") +
    `</div>`
  );
}
const aboutM = () =>
  modal(`<div style="text-align:center">${logo(70)}
  <h3>AKAR</h3>
  <p class="mut">Aksi dan Kepedulian Alam untuk Regenerasi<br>Versi 2.1 · prototype</p>
  </div>
  <div class="acts"><button class="btn" onclick="closeM()">Tutup</button></div>`);
const areaRow = (a) => {
  const A = AREAS[a.code] || { n: a.code },
    act = a.code === D().area,
    n = D().trees.filter((t) => t.area === a.code).length,
    isPending = a.status === "pending";
  return `<div class="arow ${act ? "on" : ""}"><span class="ib2" style="margin:0">${ic("globe", 18)}</span>
    <div class="lm"><b>${esc(A.n)}</b><small>${a.code} · ${esc(a.role)} · ${n} pohon</small>
    <div class="chips" style="margin:6px 0 0">${isPending ? '<span class="bd warn"><span class="spinner" style="width:10px;height:10px;display:inline-block;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:4px"></span>Menunggu Verifikasi</span>' : '<span class="bd ok"><span style="display:inline-flex;align-items:center;">' + ic("shield", 11) + "</span> Terverifikasi</span>"}${act && !isPending ? '<span class="bd warn">Area aktif</span>' : ""}</div>
    </div>
    <div class="col" style="display:flex;flex-direction:column;gap:6px;min-width:90px">${!isPending && !act ? `<button class="btn s" onclick="switchA('${a.code}')">Aktifkan</button>` : ""}<button class="btn o s" onclick="leaveA('${a.code}')">${isPending ? "Batalkan" : "Keluar"}</button></div></div>`;
};

/* ----- PROFIL ----- */
function profile() {
  const u = me(),
    d = D(),
    li = lvl(d.pts),
    nx = LEVELS[li + 1];
  PHCB.pf = (x) => {
    me().avatar = x;
    save();
    render();
  };
  return [
    `<div class="card pro">
      <div class="flex">
      <div class="avw">${av(u, 84)}<label class="cam">${ic("camera", 14)}<input type="file" accept="image/*" hidden onchange="photoIn(this,'pf')"></label></div>
      <div style="flex:1;min-width:0">
      <h2>${esc(u.name)}</h2>
      <p class="mut">@${esc(u.username)} · ${esc(u.email)}</p>
      <div class="chips" style="margin:8px 0 0"><span class="chip">${ic("user", 14)} ${esc(typeLabel(u))}</span><span class="chip">${ic("award", 14)} ${LEVELS[li][1]} · Level ${li + 1}</span></div>
      </div>
      </div>
      <div class="grid g-st" style="margin-top:14px">
      <div class="card stat c1"><b>${d.done.length}</b><small>Misi selesai</small></div>
      <div class="card stat c2"><b>${d.journal.filter((j) => j.type !== "registrasi").length}</b><small>Jurnal tersimpan</small></div>
      <div class="card stat c3"><b>${d.trees.length}</b><small>Bibit terdaftar</small></div>
      <div class="card stat c4"><b>${d.pts}</b><small>Poin</small></div>
      </div>
      <div class="card" style="margin-top:12px;box-shadow:none;background:var(--sf)">
      <div class="row2"><b>${nx ? "Menuju " + nx[1] : "Level tertinggi tercapai"}</b><small>${nx ? nx[0] - d.pts + " poin lagi" : ""}</small></div>
      <div class="pb" style="margin:8px 0"><i style="width:${nx ? Math.min(100, ((d.pts - LEVELS[li][0]) / (nx[0] - LEVELS[li][0])) * 100) : 100}%"></i></div>
      <small>Level naik otomatis seiring Poin Kepedulian dari misi, jurnal, refleksi, dan kuis.</small></div>
      </div>
      <h3 class="sh">Akun</h3>
      <div class="card slist">${row("edit", "Edit Profil", "Nama, email, peran / jenis pengguna", chev, "editM()")}${row("award", "Sertifikat & Lencana", "Lihat pencapaian dan e-sertifikat", chev, "location.href='impact.html'")}</div>
      <h3 class="sh">Wilayah Konservasi</h3>
      <div class="card">${d.areas.map(areaRow).join("")}<button class="btn" style="width:100%;margin-top:12px" onclick="areaM('join')">${ic("plus", 18)} Tambah Wilayah</button><small>Gabung ke kawasan lain dengan kode registrasi plot untuk menanam atau memantau, atau buat area baru.</small></div>
      ${secPref()}${secSec()}${secHelp()}`,
    "profile",
  ];
}
const settings = () => [
  head("Pengaturan", "Preferensi, keamanan, dan bantuan.") +
    secPref() +
    secSec() +
    secHelp(),
  "settings",
];

/* ----- EDIT PROFIL ----- */
function editM() {
  const u = me();
  modal(`<h3>Edit Profil</h3>
    <label>Nama lengkap</label><input id="pn" value="${esc(u.name)}"><label>Email</label><input id="pe" type="email" value="${esc(u.email)}" oninput="chkEmail(this)"><small id="pe-m" class="fm"></small><label>Peran / jenis pengguna</label><select id="pt" onchange="$('#ptw').style.display=this.value==='Lainnya'?'block':'none'">${TYPES.map((t) => `<option ${u.type === t ? "selected" : ""}>${t}</option>`).join("")}</select>
    <div id="ptw" style="display:${u.type === "Lainnya" ? "block" : "none"}"><label>Keterangan</label><input id="px" maxlength="40" value="${esc(u.typeNote || "")}"></div>
    <div id="err" class="err"></div>
    <div class="acts"><button class="btn o" onclick="closeM()">Batal</button><button class="btn" onclick="saveProf()">Simpan</button></div>`);
}

function saveProf() {
  const n = val("pn"),
    e = val("pe"),
    u = me();
  if (n.length < 3) {
    $("#err").textContent = "Nama minimal 3 karakter.";
    return;
  }
  if (!emailOk(e)) {
    $("#err").textContent = "Format email tidak valid. Contoh: nama@gmail.com";
    return;
  }
  const ty = val("pt"),
    tx = val("px");
  if (ty === "Lainnya" && tx.length < 3) {
    $("#err").textContent = "Isi keterangan jenis pengguna (min. 3 karakter).";
    return;
  }
  u.name = n;
  u.email = e;
  u.type = ty;
  u.typeNote = ty === "Lainnya" ? tx : "";
  save();
  closeM();
  toast("Profil diperbarui");
  render();
}

/* ----- WILAYAH KONSERVASI ----- */
let AMT = "join";

function areaM(tab) {
  AMT = tab || AMT;
  const d = D();
  modal(`<h3>Tambah Wilayah</h3>
    <div class="tabs"><button class="${AMT === "join" ? "on" : ""}" onclick="areaM('join')">Gabung ke Area</button><button class="${AMT === "new" ? "on" : ""}" onclick="areaM('new')">Buat Area Baru</button></div>
    ${
      AMT === "join"
        ? `<label>Kode registrasi plot kawasan</label>
      <div class="row" style="flex-wrap:wrap;gap:6px"><input id="ja" list="al2" placeholder="mis. HPK-2026" style="flex:1;min-width:140px"><button class="btn o s" onclick="joinCheck()">Cek Validasi</button></div>
      <datalist id="al2">${Object.keys(AREAS)
        .filter((k) => !d.areas.some((a) => a.code === k))
        .map((k) => `<option value="${k}">${AREAS[k].n}</option>`)
        .join(
          "",
        )}</datalist><label>Peran di area ini</label><select id="jr">${ROLES.map((r) => `<option>${r}</option>`).join("")}</select>
      <div id="jv" style="margin-top:8px"></div>`
        : `<label>Nama area</label><input id="na" maxlength="60" placeholder="mis. Hutan Rakyat Sipoholon"><label>Titik pusat</label>
      <div class="row" style="flex-wrap:wrap;gap:6px"><input id="nla" readonly placeholder="Latitude" style="flex:1;min-width:100px"><input id="nln" readonly placeholder="Longitude" style="flex:1;min-width:100px"><button class="btn o s" onclick="areaGps()">${ic("pin", 14)} Ambil GPS</button></div>`
    }
    <div id="err" class="err"></div>
    <div class="acts"><button class="btn o" onclick="closeM()">Batal</button><button class="btn" onclick="${AMT === "join" ? "joinGo()" : "newAreaGo()"}">${AMT === "join" ? "Kirim Permintaan Gabung" : "Buat Area"}</button></div>`);
}

function joinCheck() {
  const c = val("ja").toUpperCase(),
    a = AREAS[c];
  $("#jv").innerHTML = !a
    ? '<p class="err">Kode tidak dikenal. Minta kode kepada koordinator kawasan.</p>'
    : D().areas.some((x) => x.code === c)
      ? '<p class="err">Anda sudah terdaftar di area ini.</p>'
      : `<div class="card" style="box-shadow:none;background:var(--sf)"><b>${ic("shield", 16)} Area Terverifikasi</b><br>${esc(a.n)}<br><small>Titik pusat ${a.lat.toFixed(4)}, ${a.lng.toFixed(4)}</small></div>`;
}

function joinGo() {
  const c = val("ja").toUpperCase();
  const a = AREAS[c];
  if (!a) {
    $("#err").textContent = "Masukkan kode registrasi area yang valid.";
    return;
  }
  const d = D();
  if (d.areas.some((x) => x.code === c)) {
    $("#err").textContent =
      "Anda sudah terdaftar atau sedang menunggu verifikasi di area ini.";
    return;
  }

  // Masukkan ke daftar area dengan status pending (Menunggu Verifikasi)
  d.areas.push({
    code: c,
    role: val("jr"),
    status: "pending",
  });
  save();
  closeM();
  toast("Permintaan gabung dikirim. Menunggu verifikasi koordinator.");
  render();
}
const areaGps = () =>
  getPos((p) => {
    $("#nla").value = p.lat.toFixed(5);
    $("#nln").value = p.lng.toFixed(5);
  });

function newAreaGo() {
  const n = val("na"),
    la = +val("nla"),
    ln = +val("nln");
  if (n.length < 4 || !la || !ln) {
    $("#err").textContent =
      "Isi nama area (min. 4 karakter) dan ambil titik GPS.";
    return;
  }
  const c = newArea(n, la, ln);
  closeM();
  toast("Area dibuat & langsung aktif. Kode: " + c);
  render();
}
const switchA = (c) => {
  const targetArea = D().areas.find((a) => a.code === c);
  if (targetArea && targetArea.status === "pending") {
    toast("Area masih menunggu verifikasi koordinator", "warn");
    return;
  }
  D().area = c;
  save();
  toast("Area aktif: " + AREAS[c].n);
  render();
};
const leaveA = (c) =>
  confirmD(
    "Batalkan permohonan atau keluar dari area ini? Pohon dan jurnal pada area ini ikut dihapus jika sudah bergabung.",
    () => {
      const d = D();
      d.areas = d.areas.filter((a) => a.code !== c);
      const ids = d.trees.filter((t) => t.area === c).map((t) => t.id);
      d.trees = d.trees.filter((t) => t.area !== c);
      d.journal = d.journal.filter((j) => !ids.includes(j.tid));
      save();
      render();
    },
    "Keluar",
  );

/* ----- KATA SANDI & DATA ----- */
function passM() {
  const u = me();
  modal(`<h3>Ubah Kata Sandi</h3>
    ${u.pw ? '<label>Kata sandi saat ini</label><input id="pw0" type="password">' : '<p class="mut">Akun Anda masuk lewat Google/Apple. Buat kata sandi untuk login dengan email.</p>'}<label>Kata sandi baru</label><input id="pw1" type="password" oninput="chkPw(this)"><small id="pw1-m" class="fm"></small><label>Konfirmasi kata sandi baru</label><input id="pw2" type="password" oninput="chkSame(this,'pw1')"><small id="pw2-m" class="fm"></small>
    <div id="err" class="err"></div>
    <div class="acts"><button class="btn o" onclick="closeM()">Batal</button><button class="btn" onclick="savePass()">Simpan</button></div>`);
}

function savePass() {
  const u = me(),
    n = $("#pw1").value;
  if (u.pw && $("#pw0").value !== u.pw) {
    $("#err").textContent = "Kata sandi saat ini salah.";
    return;
  }
  if (n.length < 6) {
    $("#err").textContent = "Kata sandi baru minimal 6 karakter.";
    return;
  }
  if (n !== $("#pw2").value) {
    $("#err").textContent = "Konfirmasi kata sandi tidak sama.";
    return;
  }
  if (u.pw && n === u.pw) {
    $("#err").textContent = "Kata sandi baru harus berbeda dari yang lama.";
    return;
  }
  u.pw = n;
  save();
  closeM();
  toast("Kata sandi diperbarui");
}

function exportData() {
  const b = new Blob(
      [
        JSON.stringify(
          {
            user: { ...me(), pw: undefined },
            data: D(),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    ),
    a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = "data-akar-" + me().username + ".json";
  a.click();
  toast("Data diunduh");
}
const delAcc = () =>
  confirmD(
    "Hapus akun ini beserta seluruh datanya? Tindakan ini tidak dapat dibatalkan.",
    () => {
      const un = db.session;
      db.users = db.users.filter((u) => u.username !== un);
      delete db.data[un];
      db.session = null;
      save();
      location.href = "index.html";
    },
    "Hapus Akun",
  );

/* ----- SINKRONISASI ----- */
function flushQ() {
  const n = D().journal.filter((j) => j.queued).length;
  D().journal.forEach((j) => (j.queued = false));
  save();
  toast(n ? n + " catatan tersinkronkan" : "Tidak ada antrean");
  render();
}

function gpsSync() {
  getPos((p) => {
    $("#gs").textContent =
      `Posisi: ${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}${p.sim ? " (simulasi – GPS tidak tersedia)" : " (GPS perangkat)"}`;
  });
}

/* ----- NOTIFIKASI ----- */
function notifs() {
  const d = D();
  return [
    `${head("Notifikasi", "", `<button class="btn o s" onclick="D().notifs.forEach(n=>n.read=1);save();render()">Tandai semua dibaca</button>`)}
      <div class="grid">${
        d.notifs
          .slice(0, 40)
          .map(
            (
              n,
            ) => `<div class="card" style="border-left:5px solid var(--${n.type === "warn" ? "wn" : "lf"});opacity:${n.read ? 0.6 : 1}">
        <div class="row2"><span>${ic(n.type === "warn" ? "alert" : "check", 18)} ${esc(n.text)}<br><small>${fmtT(n.ts)}</small></span>${n.read ? "" : `<button class="btn o s" onclick="D().notifs.find(x=>x.id==='${n.id}').read=1;save();render()">Dibaca</button>`}</div>
        </div>`,
          )
          .join("") || empty("bell", "Tidak ada notifikasi", "")
      }</div>`,
    "notifications",
  ];
}
PAGES.profile = profile;
PAGES.settings = settings;
PAGES.notifications = notifs;
