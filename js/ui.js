/* ===== js/ui.js ===== */
/* ----- REGISTRI HALAMAN ----- */
const PAGES = {},
  PH = {},
  PHCB = {};

/* ----- TOAST & MODAL ----- */
function toast(m, t = "") {
  const e = document.createElement("div");
  e.className = "ts " + t;
  e.textContent = m;
  $("#toasts").append(e);
  setTimeout(() => e.remove(), 3200);
}

function modal(h) {
  $("#modal").innerHTML =
    `<div class="ov" onclick="if(event.target===this)closeM()">
    <div class="md">${h}</div>
    </div>`;
}
const closeM = () => ($("#modal").innerHTML = "");
let CB;

function confirmD(m, cb, l = "Ya, lanjutkan") {
  CB = cb;
  modal(`<h3>Konfirmasi</h3>
    <p>${m}</p>
    <div class="acts"><button class="btn o" onclick="closeM()">Batal</button><button class="btn d" onclick="closeM();CB()">${l}</button></div>`);
}

/* ----- GRAFIK ----- */
const CHS = {};

function chart(id, type, labels, data, xt, yt, dec) {
  const c = document.getElementById(id);
  if (!c || typeof Chart === "undefined") return;
  if (CHS[id]) CHS[id].destroy();
  if (typeof Chart !== "undefined") {
    const dk = document.documentElement.classList.contains("dark");
    Chart.defaults.color = dk ? "#9BAAA0" : "#666";
    Chart.defaults.borderColor = dk ? "#2A3B31" : "rgba(0,0,0,.1)";
  }
  CHS[id] = new Chart(c, {
    type,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: "#65A66F",
          borderColor: "#245B3A",
          borderRadius: 6,
          tension: 0.3,
          pointRadius: 4,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          title: { display: true, text: xt },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: yt },
          ticks: { precision: dec ? 1 : 0 },
        },
      },
    },
  });
}

/* ----- UNGGAH FOTO ----- */
function photoIn(inp, k) {
  const f = inp.files && inp.files[0];
  if (!f) return;
  pickPhoto(f, (u) => {
    PH[k] = u;
    PHCB[k]
      ? PHCB[k](u)
      : ($("#pv-" + k).innerHTML = `<img class="jp" src="${u}" alt="">`);
  });
}

/* ----- KOMPONEN ----- */
const logo = (h, putih) =>
  `<img class="logo" style="height:${h}px" src="assets/logo/${putih ? "logo-putih" : "logo"}.png" alt="AKAR">`;
const av = (u, s = 44) =>
  u.avatar
    ? `<img class="avi" style="width:${s}px;height:${s}px" src="${u.avatar}" alt="">`
    : `<span class="avi" style="width:${s}px;height:${s}px;font-size:${Math.round(s * 0.4)}px">${esc(
        u.name
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
      )}</span>`;
const head = (
  t,
  s = "",
  r = "",
) => `<div class="pg row2" style="flex-wrap:wrap">
  <div>
  <h1>${t}</h1>
  <p class="mut">${s}</p>
  </div>
  <div>${r}</div>
  </div>`;
const empty = (i, t, b) => `<div class="emp card">
  <div style="color:var(--lf)">${ic(i, 44)}</div>
  <h3 style="margin-top:8px">${t}</h3>
  <p class="mut">${b}</p>
  </div>`;
const tcard = (
  t,
) => `<a class="card h tc" href="tree-detail.html?id=${t.id}">${ph(t)}
  <div class="row2" style="margin-top:10px"><b>${t.id}</b>${badge(t)}</div>
  <h3>${esc(t.name)}</h3>
  <small>${esc(t.latin)} • ${age(t)} hari</small>
  <div class="mini"><span>${ic("drop", 14)}${mo(t)}%</span><span>${ic("leaf", 14)}${fe(t)}%</span><span>${ic("ruler", 14)}${t.h} cm</span></div>
  </a>`;

/* ----- KERANGKA HALAMAN ----- */
function shell(c, act) {
  const u = me(),
    d = D(),
    un = d.notifs.filter((n) => !n.read).length,
    cu = convs().reduce((s, c) => s + c.unread, 0),
    L = NAV.map(
      (n) =>
        `<a class="ni ${act === n[0] ? "on" : ""}" href="${n[0]}.html" title="${n[1]}">${ic(n[2], 20)}<em>${n[1]}</em></a>`,
    ).join(""),
    out = `<a class="ni" onclick="logout()" title="Keluar">${ic("logout", 20)}<em>Keluar</em></a>`;
  return `<div class="lay">
    <div class="bgf"></div>
    <aside class="sb">
    <div class="lg">${logo(34)}<span>AKAR</span></div>
    ${L}${out}</aside>
    <main>
    <header class="hd">
    <div class="hl">${act !== "dashboard" ? `<button class="ib bk" onclick="goBack()" aria-label="Kembali">${ic("left", 19)}</button>` : ""}
    <div class="ht">
    <h2>Halo, ${esc(u.name.split(" ")[0])}</h2>
    <small>${new Date().toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</small></div>
    </div>
    <div class="hr"><a class="ib" href="chat.html" title="Pesan">${ic("chat", 18)}${cu ? `<i>${cu}</i>` : ""}</a><a class="ib" href="notifications.html" title="Notifikasi">${ic("bell", 18)}${un ? `<i>${un}</i>` : ""}</a><button class="ib mbtn" onclick="$('#mnav').classList.toggle('open')" aria-label="Menu navigasi">${ic("menu", 20)}</button></div>
    <nav id="mnav" class="mnav">${L}${out}</nav>
    </header>
    <div class="ct">${c}</div>
    </main>
    <nav class="bn">${[
      ["dashboard", "Beranda", "home"],
      ["map", "Peta", "map"],
      ["missions", "Misi", "target"],
      ["education", "Edukasi", "book"],
      ["profile", "Profil", "user"],
    ]
      .map(
        (n) =>
          `<a class="${act === n[0] ? "on" : ""}" href="${n[0]}.html">${ic(n[2], 22)}<span>${n[1]}</span></a>`,
      )
      .join("")}</nav>
    </div>`;
}

/* ----- VALIDASI FORM & GALERI FOTO ----- */
function goBack() {
  if (history.length > 1) history.back();
  else location.href = "dashboard.html";
}
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

function fmsg(inp, ok, txt) {
  const m = $("#" + inp.id + "-m");
  if (m) m.textContent = ok ? "" : txt;
  inp.classList.toggle("bad", !ok);
}
const chkEmail = (inp) =>
  fmsg(
    inp,
    !inp.value.trim() || emailOk(inp.value.trim()),
    "Format email tidak valid. Contoh: nama@gmail.com",
  );
const chkId = (inp) => {
  const v = inp.value.trim();
  fmsg(
    inp,
    !v.includes("@") || emailOk(v),
    "Format email tidak valid. Contoh: nama@gmail.com",
  );
};
const chkPw = (inp) =>
  fmsg(
    inp,
    !inp.value || inp.value.length >= 6,
    "Kata sandi minimal 6 karakter",
  );
const chkSame = (inp, o) =>
  fmsg(
    inp,
    !inp.value || inp.value === $("#" + o).value,
    "Konfirmasi kata sandi belum sama",
  );
const thumbs = (a) =>
  a && a.length
    ? `<div class="ths">${a.map((u) => `<img class="th" src="${u}" alt="" onclick="lightbox(this.src)">`).join("")}</div>`
    : "";

function lightbox(s) {
  modal(`<img src="${s}" style="width:100%;border-radius:12px" alt="">
    <div class="acts"><button class="btn" onclick="closeM()">Tutup</button></div>`);
}

function galIn(inp, k, max) {
  const files = [...(inp.files || [])];
  if (!files.length) return;
  const cur = (PH[k] = PH[k] || []),
    room = max - cur.length;
  if (room <= 0) {
    toast("Maksimal " + max + " foto.", "warn");
    return;
  }
  pickMany(files, room, (L) => {
    PH[k] = cur.concat(L.filter(Boolean));
    galDraw(k, max);
    if (PHCB[k]) PHCB[k](PH[k]);
  });
  inp.value = "";
}

function galDraw(k, max) {
  const el = $("#gal-" + k),
    A = PH[k] || [];
  if (el)
    el.innerHTML =
      A.map(
        (u, i) =>
          `<div class="gi"><img src="${u}" alt=""><button type="button" onclick="galDel('${k}',${i},${max})" aria-label="Hapus foto">${ic("x", 14)}</button></div>`,
      ).join("") +
      (A.length < max
        ? `<label class="gi add">${ic("plus", 22)}<small>${A.length}/${max}</small><input type="file" accept="image/*" multiple hidden onchange="galIn(this,'${k}',${max})"></label>`
        : "");
}

function galDel(k, i, max) {
  PH[k].splice(i, 1);
  galDraw(k, max);
  if (PHCB[k]) PHCB[k](PH[k]);
}
const gal = (k, max, label) => `<label>${label} (maks. ${max} foto)</label>
  <div id="gal-${k}" class="gal"><label class="gi add">${ic("camera", 22)}<small>0/${max}</small><input type="file" accept="image/*" multiple hidden onchange="galIn(this,'${k}',${max})"></label></div>`;

/* ----- BASE MAP ----- */
function mapBase(M) {
  const E = "https://server.arcgisonline.com/ArcGIS/rest/services/",
    at = "Tiles © Esri",
    street = L.tileLayer(E + "World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: at + " — nama jalan & daerah",
    }),
    topo = L.tileLayer(E + "World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: at + " — topografi",
    }),
    sat = L.layerGroup([
      L.tileLayer(E + "World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: at + " — citra satelit",
      }),
      L.tileLayer(
        E + "Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 },
      ),
    ]);
  M.attributionControl.setPrefix(
    '<svg width="14" height="10" viewBox="0 0 14 10" style="vertical-align:-1px"><rect width="14" height="5" fill="#E70011"/><rect y="5" width="14" height="5" fill="#fff" stroke="#ccc" stroke-width=".5"/></svg> AKAR · Indonesia',
  );
  street.addTo(M);
  L.control
    .layers({ Peta: street, Topografi: topo, "Satelit + nama": sat })
    .addTo(M);
  street.on("tileerror", () => {
    if (!window.__te) {
      window.__te = 1;
      toast(
        "Peta gagal dimuat. Periksa koneksi internet atau pilih layer lain.",
        "warn",
      );
    }
  });
  return street;
}

/* ----- DIALOG LEGAL & KELUAR ----- */
function legal(k) {
  const T = {
    priv: [
      "Kebijakan Privasi",
      "Prototype ini menyimpan data hanya di perangkat Anda (localStorage) dan tidak mengirimkannya ke server. Jangan gunakan kata sandi asli. Foto dikompres dan disimpan lokal.",
    ],
    terms: [
      "Syarat & Ketentuan",
      "Data pohon, sensor, karbon, dan poin adalah simulasi untuk keperluan pengembangan dan demonstrasi. Tidak menjadi klaim dampak lingkungan nyata.",
    ],
    help: [
      "Panduan Lapangan",
      "1) Pastikan GPS aktif.<br>2) Cari kode pohon di Direktori atau Peta.<br>3) Ikuti SOP pada Misi Harian.<br>4) Foto hasil perawatan.<br>5) Catat pertumbuhan di Jurnal.",
    ],
    contact: [
      "Hubungi Kami",
      "Koordinator kawasan: kontak@akar.example (alamat contoh).",
    ],
  }[k];
  modal(`<h3>${T[0]}</h3>
    <p>${T[1]}</p>
    <div class="acts"><button class="btn" onclick="closeM()">Tutup</button></div>`);
}

function logout() {
  db.session = null;
  save();
  location.href = "index.html";
}
const ini = (n) =>
  n
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
