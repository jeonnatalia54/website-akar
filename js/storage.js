/* ===== js/storage.js ===== */
/* ----- STORAGE ----- */
const H = 36e5,
  DAY = 864e5,
  K = "akar_v3",
  QS = new URLSearchParams(location.search);
let db = JSON.parse(localStorage.getItem(K) || "null") || {
  users: [],
  session: null,
  data: {},
};
Object.assign(AREAS, db.areas || {});
const save = () => {
  try {
    localStorage.setItem(K, JSON.stringify(db));
  } catch (e) {
    toast("Penyimpanan penuh – hapus beberapa foto.", "bad");
  }
};
const me = () => db.users.find((u) => u.username === db.session),
  D = () => db.data[db.session];
const uid = () => Math.random().toString(36).slice(2, 9),
  $ = (s) => document.querySelector(s),
  val = (id) => String($("#" + id).value).trim();
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const fmt = (t) =>
  new Date(t).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const fmtT = (t) =>
  new Date(t).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
const ymd = (t) => {
  const d = new Date(t);
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
};
const TY = {
  registrasi: "Registrasi bibit",
  inspeksi: "Inspeksi lapangan",
  misi: "Misi perawatan",
};

/* ----- SENSOR TANAH (IoT simulasi) ----- */
const mo = (t) =>
    Math.max(0, Math.round(t.moist - ((Date.now() - t.mTs) / H) * 0.4)),
  fe = (t) =>
    Math.max(0, Math.round(t.fert - ((Date.now() - t.fTs) / H) * 0.05));
const st = (t) => {
  const m = mo(t),
    f = fe(t);
  return m < 40 || f < 25
    ? ["Kritis", "bad"]
    : m < 55 || f < 45
      ? ["Perlu Cek", "warn"]
      : ["Baik", "ok"];
};
const age = (t) => Math.floor((Date.now() - t.date) / DAY),
  tree = (id) => D().trees.find((t) => t.id === id),
  trs = () => {
    const d = D();
    return d.trees.filter((t) => t.area === d.area);
  },
  hs = (t) => Math.round((mo(t) + fe(t)) / 2),
  nextNo = () => {
    const d = D();
    return Math.max(d.seq || 0, ...d.trees.map((t) => +t.id.split("-")[1])) + 1;
  },
  inArea = (j) => {
    const t = tree(j.tid);
    return !t || t.area === D().area;
  };
const co2 = (t) =>
  +(0.0509 * 0.6 * t.dia * t.dia * (t.h / 100) * 0.47 * 3.67).toFixed(2);
const actCount = (d) => d.journal.filter((j) => j.type !== "registrasi").length;
const lvl = (p) => {
  let i = 0;
  LEVELS.forEach((l, k) => {
    if (p >= l[0]) i = k;
  });
  return i;
};
const badge = (t) => {
  const s = st(t);
  return `<span class="bd ${s[1]}">${s[0]}</span>`;
};
const ph = (t, c = "") =>
  `<div class="ph ${c}">${ic("tree", 34)}<img alt="" loading="lazy" src="${(t.photos && t.photos[0]) || t.photo || "assets/trees/" + t.sp + ".jpg"}" onerror="this.remove()"></div>`;

/* ----- GPS & FOTO ----- */
const dist = (a, b, c, d) => {
  const R = 6371e3,
    r = (x) => (x * Math.PI) / 180,
    x = r(c - a),
    y = r(d - b),
    h =
      Math.sin(x / 2) ** 2 +
      Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(y / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const bearing = (a, b, c, d) => {
  const r = (x) => (x * Math.PI) / 180,
    y = Math.sin(r(d - b)) * Math.cos(r(c)),
    x =
      Math.cos(r(a)) * Math.sin(r(c)) -
      Math.sin(r(a)) * Math.cos(r(c)) * Math.cos(r(d - b)),
    g = Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360);
  return [
    g,
    [
      "Utara",
      "Timur Laut",
      "Timur",
      "Tenggara",
      "Selatan",
      "Barat Daya",
      "Barat",
      "Barat Laut",
    ][Math.round(g / 45) % 8],
  ];
};

function getPos(cb) {
  const A = AREAS[(D() || { area: "SLK-2026" }).area];
  if (typeof navigator === "undefined" || !navigator.geolocation)
    return cb({ lat: A.lat, lng: A.lng, sim: 1 });
  navigator.geolocation.getCurrentPosition(
    (p) => cb({ lat: p.coords.latitude, lng: p.coords.longitude }),
    () => cb({ lat: A.lat, lng: A.lng, sim: 1 }),
    {
      timeout: 6000,
      enableHighAccuracy: !(D() && D().set && D().set.gps === false),
    },
  );
}

function pickPhoto(file, cb) {
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const s = Math.min(1, 560 / Math.max(im.width, im.height)),
        c = document.createElement("canvas");
      c.width = im.width * s;
      c.height = im.height * s;
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      cb(c.toDataURL("image/jpeg", 0.62));
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
}

function demoize(d) {
  d.pts = 520;
  d.refl = [2, 1].map((i) => ({
    date: ymd(Date.now() - i * DAY),
    id: "e1",
    text: "Merawat bibit membuat saya lebih sabar dan bersyukur.",
    ts: Date.now() - i * DAY,
    pts: 10,
  }));
}

/* ----- DATA DEMO ----- */
function rnd(s) {
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function seedTrees(code, n) {
  const A = AREAS[code],
    r = rnd(code.length * 97 + n),
    ks = [
      "meranti",
      "pinus",
      "mahoni",
      "trembesi",
      "kemenyan",
      "jati",
      "sengon",
      "damar",
      "alpukat",
      "durian",
      "kapur",
      "kemiri",
      "sonokeling",
      "petai",
    ],
    now = Date.now(),
    L = [];
  for (let i = 1; i <= n; i++) {
    const k = i === 7 ? "meranti" : ks[Math.floor(r() * ks.length)],
      s = SP[k],
      a = i === 7 ? 42 : Math.floor(20 + r() * 300),
      p = String(i).padStart(3, "0");
    L.push({
      id: "AKR-" + p,
      tag: "TRT-" + p,
      area: code,
      photos: [],
      sp: k,
      name: s.n,
      latin: s.l,
      plot: "ABC"[i % 3] + (1 + (i % 4)),
      lat: A.lat + (r() - 0.5) * 0.003,
      lng: A.lng + (r() - 0.5) * 0.003,
      date: now - a * DAY,
      photo: null,
      h: i === 7 ? 58 : Math.round(30 + a * 0.45 + r() * 20),
      dia: i === 7 ? 1.8 : +(0.6 + a * 0.012 + r() * 0.3).toFixed(1),
      moist: i === 7 ? 38 : Math.round(40 + r() * 55),
      mTs: now,
      fert: Math.round(35 + r() * 60),
      fTs: now,
      sync: now,
      lastCheck: now - Math.floor(r() * 10) * DAY,
      batt: Math.round(60 + r() * 40),
    });
  }
  return L;
}

function newData(code, n = 18) {
  const now = Date.now(),
    trees = seedTrees(code, n),
    journal = trees.map((t) => ({
      id: "JRN-R" + t.id.slice(-3),
      tid: t.id,
      ts: t.date,
      type: "registrasi",
      leaf: "Segar",
      stem: "Kokoh",
      h: Math.round(t.h * 0.5),
      dia: +(t.dia * 0.5).toFixed(1),
      moist: 70,
      note: "Bibit didaftarkan dan diberi tag.",
      photo: null,
    }));
  if (n >= 7)
    [
      [28, 38, "Segar", "Pertumbuhan awal baik."],
      [14, 49, "Segar", "Tunas baru muncul."],
      [3, 58, "Layu", "Daun terlihat layu ringan, tanah kering."],
    ].forEach((x, i) =>
      journal.push({
        id: "JRN-S" + i,
        tid: "AKR-007",
        ts: now - x[0] * DAY,
        type: "inspeksi",
        leaf: x[2],
        stem: "Kokoh",
        h: x[1],
        dia: 1.2 + i * 0.3,
        moist: [62, 55, 41][i],
        note: x[3],
        photo: null,
      }),
    );
  const ev = (o, t, title, note) => ({
    id: uid(),
    date: ymd(now + o * DAY),
    t,
    title,
    note,
  });
  return migrate({
    area: code,
    trees,
    journal,
    done: [],
    pts: 0,
    notifs: [
      {
        id: uid(),
        k: "w",
        text:
          "Selamat datang di AKAR! Kawasan " + code + " berhasil disinkronkan.",
        read: 0,
        ts: now,
        type: "ok",
      },
    ],
    learned: [],
    saved: [],
    reflected: [],
    refl: [],
    seq: n,
    set: { offline: false, big: false },
    events: [
      ev(1, "patrol", "Patroli kelompok Plot B", "Kumpul di pos 1 pukul 07.00"),
      ev(4, "pupuk", "Rotasi pemupukan organik", "Plot A dan C"),
      ev(8, "patrol", "Patroli kelompok Plot A", ""),
      ev(
        12,
        "audit",
        "Audit Kawasan",
        "Verifikasi oleh petugas kehutanan; siapkan dokumentasi jurnal",
      ),
    ],
  });
}
if (!db.users.length) {
  db.users.push({
    id: "u1",
    name: "Natali Sihombing",
    username: "demo",
    email: "demo@akar.id",
    pw: "demo123",
    type: "Relawan Mahasiswa",
    area: "SLK-2026",
    avatar: null,
    joined: Date.now() - 45 * DAY,
  });
  db.data.demo = newData("SLK-2026");
  demoize(db.data.demo);
  save();
}
db.users.forEach((u) => {
  if (db.data[u.username]) migrate(db.data[u.username]);
});

/* ----- JURNAL & NOTIFIKASI ----- */
function jadd(o) {
  const d = D(),
    t = tree(o.tid),
    e = {
      id: "JRN-" + uid().toUpperCase().slice(0, 5),
      ts: Date.now(),
      moist: t ? mo(t) : null,
      queued: !!d.set.offline,
      ...o,
    };
  e.photos = e.photos || (e.photo ? [e.photo] : []);
  e.photo = e.photos[0] || null;
  d.journal.unshift(e);
  return e;
}
const notify = (text, type = "ok", k) =>
  D().notifs.unshift({ id: uid(), k, text, read: 0, ts: Date.now(), type });

function sync() {
  const d = D();
  d.events.forEach((e) => {
    e.title = e.title.replace("Audit KSDA", "Audit Kawasan");
  });
  d.trees.forEach((t) => {
    if (st(t)[0] === "Kritis") {
      const k = t.id + "K" + ymd(Date.now());
      if (!d.notifs.some((n) => n.k === k))
        notify(
          `${t.id} (${t.name}) dalam kondisi kritis – kelembapan ${mo(t)}%.`,
          "warn",
          k,
        );
    }
  });
  const nowT = Date.now();
  d.events.forEach((e) => {
    if (e.status === "Selesai" || !e.remind) return;
    const at = new Date(e.date + "T" + (e.time || "07:00")).getTime();
    if (at - nowT <= DAY && at > nowT - H) {
      const k = "rm" + e.id + e.date;
      if (!d.notifs.some((n) => n.k === k))
        notify(
          `Pengingat: ${e.title} – ${fmt(at)} pukul ${e.time || "07:00"}${teamName(e.team) ? " (" + teamName(e.team) + ")" : ""}.`,
          "warn",
          k,
        );
    }
  });
  document.body.classList.toggle("big", !!d.set.big);
  save();
}

/* ----- MISI HARIAN ----- */
function missions() {
  const d = D(),
    n = Date.now(),
    out = [];
  trs().forEach((t) => {
    const m = mo(t),
      f = fe(t),
      ci = (n - t.lastCheck) / DAY;
    const add = (ty, urg) => {
      const key = t.id + "|" + ty + "|" + ymd(n);
      if (d.done.some((x) => x.key === key)) return;
      out.push({
        key,
        tid: t.id,
        ty,
        urg,
        pts: ty === "water" && urg ? 120 : MIS[ty].pts,
      });
    };
    if (m < 45) add("water", m < 40);
    if (f < 45) add("fert", f < 30);
    if (ci >= 7) add("check", ci >= 14);
  });
  return out.sort((a, b) => b.urg - a.urg || b.pts - a.pts);
}

function finish(tid, ty, photos) {
  const d = D(),
    t = tree(tid),
    ms = missions().find((x) => x.tid === tid && x.ty === ty);
  if (!ms || !t) return null;
  const n = Date.now(),
    b = st(t)[0];
  if (ty === "water") {
    t.moist = Math.min(100, mo(t) + 30);
    t.mTs = n;
  }
  if (ty === "fert") {
    t.fert = Math.min(100, fe(t) + 35);
    t.fTs = n;
  }
  t.lastCheck = n;
  t.sync = n;
  d.done.push({ key: ms.key, tid, ty, ts: n, pts: ms.pts });
  d.pts += ms.pts;
  const j = jadd({
    tid,
    type: "misi",
    leaf: "-",
    stem: "-",
    h: t.h,
    dia: t.dia,
    note: `Misi ${MIS[ty].n} selesai. ${MIS[ty].eff}.`,
    photos,
  });
  notify(`Misi ${MIS[ty].n} ${tid} selesai: +${ms.pts} poin.`);
  const r = {
    tid,
    ty,
    pts: ms.pts,
    before: b,
    after: st(t)[0],
    moist: mo(t),
    jid: j.id,
    lv: lvl(d.pts),
  };
  sessionStorage.setItem("akar_last", JSON.stringify(r));
  save();
  return r;
}

/* ----- REKOMENDASI & KARBON ----- */
function recs(t) {
  const m = mo(t),
    f = fe(t),
    ci = Math.floor((Date.now() - t.lastCheck) / DAY),
    L = [];
  if (m < 40)
    L.push([
      "bad",
      "Penyiraman darurat segera",
      `Kelembapan tanah ${m}% di bawah ambang 40%. Siram 3 L air dan tebar mulsa jerami 3–5 cm.`,
      "water",
    ]);
  else if (m < 55)
    L.push([
      "warn",
      "Pantau kelembapan",
      `Kelembapan ${m}% mendekati ambang. Siram bila tidak turun hujan 24 jam ke depan.`,
      "water",
    ]);
  if (f < 45)
    L.push([
      "warn",
      "Pemupukan organik",
      `Kesuburan tanah ${f}%. Beri kompos di sekeliling tajuk.`,
      "fert",
    ]);
  if (ci >= 7)
    L.push([
      "warn",
      "Inspeksi rutin",
      `Terakhir diperiksa ${ci} hari lalu. Ukur tinggi dan periksa daun.`,
      "check",
    ]);
  if (!L.length)
    L.push([
      "ok",
      "Kondisi stabil",
      "Semua indikator sensor dalam batas normal.",
      null,
    ]);
  return L;
}

function carbonSeries() {
  const d = D(),
    now = new Date(),
    L = [],
    V = [];
  for (let i = 5; i >= 0; i--) {
    const e = Math.min(
      new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59).getTime(),
      Date.now(),
    );
    L.push(
      new Date(now.getFullYear(), now.getMonth() - i, 1).toLocaleDateString(
        "id-ID",
        { month: "short" },
      ),
    );
    V.push(
      +trs()
        .reduce(
          (s, t) =>
            t.date > e
              ? s
              : s +
                co2(t) *
                  Math.pow(
                    Math.max(
                      0,
                      Math.min(
                        1,
                        (e - t.date) / Math.max(1, Date.now() - t.date),
                      ),
                    ),
                    1.3,
                  ),
          0,
        )
        .toFixed(1),
    );
  }
  return [L, V];
}

function perDay(list, n) {
  const L = [],
    V = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY);
    L.push(d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }));
    V.push(list.filter((j) => ymd(j.ts) === ymd(d)).length);
  }
  return [L, V];
}

/* ----- MIGRASI, TIM, CHAT, KAWASAN, TEMA ----- */
function migrate(d) {
  const now = Date.now();
  d.areas = d.areas || [
    { code: d.area, role: "Penanam", verified: true, date: now },
  ];
  d.trees.forEach((t) => {
    t.area = t.area || d.area;
    t.photos = t.photos || (t.photo ? [t.photo] : []);
  });
  d.journal.forEach((j) => {
    j.photos = j.photos || (j.photo ? [j.photo] : []);
  });
  d.set = Object.assign(
    { offline: false, big: false, gps: true, notif: true, lang: "id" },
    d.set || {},
  );
  d.quizDone = d.quizDone || [];
  d.chatRead = d.chatRead || {};
  if (!d.contacts) {
    d.contacts = [
      {
        id: "c1",
        name: "Natali Sihombing",
        role: "Koordinator Lapangan",
        phone: "",
      },
      { id: "c2", name: "Daniel Hutagalung", role: "Rimbawan", phone: "" },
      {
        id: "c3",
        name: "Maria Nainggolan",
        role: "Relawan Penanam",
        phone: "",
      },
      { id: "c4", name: "Ronaldo Siagian", role: "Peneliti", phone: "" },
    ];
    d.teams = [
      {
        id: "t1",
        name: "Tim Patroli Plot B",
        area: d.area,
        members: ["c1", "c2", "c3"],
      },
      {
        id: "t2",
        name: "Tim Pemupukan Plot A",
        area: d.area,
        members: ["c2", "c4"],
      },
    ];
    d.chats = {
      "team:t1": [
        {
          id: uid(),
          from: "c1",
          text: "Selamat pagi tim. Besok patroli Plot B, kumpul di pos 1 pukul 07.00 ya.",
          ts: now - 3 * H,
        },
        {
          id: uid(),
          from: "c3",
          text: "Siap, saya bawa alat ukur dan mulsa.",
          ts: now - 2.5 * H,
        },
      ],
      "c:c1": [
        {
          id: uid(),
          from: "c1",
          text: "Tolong cek AKR-007 hari ini, kelembapannya turun.",
          ts: now - 5 * H,
        },
      ],
    };
  }
  d.chats = d.chats || {};
  d.events.forEach((e) => {
    if (e.time === undefined) {
      e.time = "07:00";
      e.team = e.t === "patrol" ? "t1" : e.t === "pupuk" ? "t2" : "";
      e.status = "Direncanakan";
      e.remind = 30;
    }
  });
  return d;
}
const teamName = (id) =>
  ((D().teams || []).find((t) => t.id === id) || {}).name || "";
const nextEvent = (d) =>
  d.events
    .filter(
      (e) =>
        e.status !== "Selesai" &&
        new Date(e.date + "T" + (e.time || "00:00")).getTime() >=
          Date.now() - H,
    )
    .sort((a, b) =>
      (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")),
    )[0];

function pickMany(files, max, cb) {
  const L = [...files].slice(0, max),
    out = [];
  let n = 0;
  if (!L.length) return cb(out);
  L.forEach((f, i) =>
    pickPhoto(f, (u) => {
      out[i] = u;
      if (++n === L.length) cb(out);
    }),
  );
}
const cname = (id) =>
  id === "me"
    ? "Saya"
    : (D().contacts.find((c) => c.id === id) || {}).name || "?";

function convs() {
  const d = D(),
    L = [];
  d.teams
    .filter((t) => t.area === d.area)
    .forEach((t) =>
      L.push({
        id: "team:" + t.id,
        name: t.name,
        sub: t.members.length + " anggota",
        team: t,
        msgs: d.chats["team:" + t.id] || [],
      }),
    );
  d.contacts.forEach((c) =>
    L.push({
      id: "c:" + c.id,
      name: c.name,
      sub: c.role,
      contact: c,
      msgs: d.chats["c:" + c.id] || [],
    }),
  );
  return L.map((c) => {
    c.last = c.msgs[c.msgs.length - 1];
    c.unread = c.msgs.filter(
      (m) => m.from !== "me" && m.ts > (d.chatRead[c.id] || 0),
    ).length;
    return c;
  }).sort((a, b) => ((b.last || {}).ts || 0) - ((a.last || {}).ts || 0));
}
const REPLIES = [
  "Siap, terima kasih infonya.",
  "Oke, saya segera ke lokasi.",
  "Noted. Nanti saya kabari lagi ya.",
  "Baik, jadwalnya saya catat.",
  "Mantap, sampai ketemu di lapangan.",
  "Sudah saya cek, aman terkendali.",
];

function sendMsg(cid, text) {
  const d = D();
  (d.chats[cid] = d.chats[cid] || []).push({
    id: uid(),
    from: "me",
    text,
    ts: Date.now(),
  });
  d.chatRead[cid] = Date.now();
  save();
  const m = cid.startsWith("team:")
    ? (
        d.teams.find((t) => t.id === cid.slice(5)) || {
          members: [],
        }
      ).members
    : [cid.slice(2)];
  setTimeout(() => {
    const f = m[Math.floor(Math.random() * m.length)];
    if (!f) return;
    (d.chats[cid] = d.chats[cid] || []).push({
      id: uid(),
      from: f,
      text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
      ts: Date.now(),
    });
    save();
    if (typeof onChatUpdate === "function") onChatUpdate(cid);
  }, 1500);
}

function joinArea(code, role) {
  const d = D();
  if (!AREAS[code]) return "Kode area tidak dikenal.";
  if (d.areas.some((x) => x.code === code))
    return "Anda sudah terdaftar di area ini.";
  d.areas.push({ code, role, verified: true, date: Date.now() });
  let n = nextNo();
  seedTrees(code, 8).forEach((t) => {
    t.id = "AKR-" + String(n).padStart(3, "0");
    t.tag = t.id;
    n++;
    d.trees.push(t);
  });
  d.seq = n - 1;
  d.area = code;
  save();
  return "";
}

function newArea(name, lat, lng) {
  const d = D(),
    code = "USR-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  AREAS[code] = { n: name, lat, lng };
  db.areas = db.areas || {};
  db.areas[code] = { n: name, lat, lng };
  d.areas.push({ code, role: "Koordinator", verified: true, date: Date.now() });
  d.area = code;
  save();
  return code;
}
const getTheme = () => localStorage.getItem("akar_theme") || "terang";

function applyTheme() {
  const t = getTheme(),
    r = document.documentElement;
  if (!r) return;
  r.classList.toggle(
    "dark",
    t === "gelap" ||
      (t === "otomatis" &&
        typeof matchMedia !== "undefined" &&
        matchMedia("(prefers-color-scheme: dark)").matches),
  );
}

function setTheme(t) {
  localStorage.setItem("akar_theme", t);
  applyTheme();
}
