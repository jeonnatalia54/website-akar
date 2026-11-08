/* ===== js/auth.js ===== */
/* ----- LOGIN & SSO ----- */
function loginAs(u) {
  db.session = u.username;
  save();
  location.href = u.area ? 'dashboard.html' : 'setup.html'
}
const startDemo = () => loginAs(db.users.find(u => u.username === 'demo'));

function sheet() {
  modal(`<h3>Masuk ke AKAR</h3>
    <p class="mut" style="margin-bottom:8px">Pilih cara masuk atau mulai sebagai relawan baru.</p>
    <button class="btn o sso" onclick="ssoM('Google')"><b style="color:#4285F4">G</b> Masuk dengan Google</button>
    <button class="btn o sso" onclick="ssoM('Apple')">${ic('shield', 18)} Masuk dengan Apple</button>
    <a class="btn o sso" href="auth.html">${ic('mail', 18)} Masuk dengan Email</a>
    <div class="or">atau</div>
    <button class="btn o sso" onclick="startDemo()">${ic('users', 18)} Coba Akun Demo</button>
    <a class="btn sso" href="auth.html?tab=daftar">${ic('sprout', 18)} Mulai Merawat Pohon (Daftar)</a>`)
}

function ssoM(p) {
  modal(`<h3>Lanjutkan dengan ${p}</h3>
    <p class="mut">Simulasi prototype. Integrasi ${p} sungguhan memerlukan server OAuth.</p>
    <label>Nama</label><input id="sn"><label>Email</label><input id="se" type="email" placeholder="nama@gmail.com" oninput="chkEmail(this)"><small id="se-m" class="fm"></small>
    <div id="err" class="err"></div>
    <div class="acts"><button class="btn o" onclick="closeM()">Batal</button><button class="btn" onclick="ssoGo('${p}')">Lanjutkan</button></div>`)
}

function ssoGo(p) {
  const e = val('se').toLowerCase(),
    n = val('sn');
  if (!emailOk(e) || n.length < 2) {
    $('#err').textContent = 'Isi nama dan email yang valid.';
    return
  }
  let u = db.users.find(x => x.email.toLowerCase() === e);
  if (!u) {
    u = {
      id: uid(),
      name: n,
      username: e.split('@')[0] + uid().slice(0, 3),
      email: e,
      pw: null,
      provider: p,
      type: '',
      area: '',
      avatar: null,
      joined: Date.now()
    };
    db.users.push(u)
  }
  loginAs(u)
}

/* ----- ONBOARDING ----- */
const SL = [
  ['sprout', 'Setiap Pohon Punya Kehidupan', 'Satu bibit yang dirawat hari ini menjadi rumah bagi banyak kehidupan esok hari. Mulailah dari kesadaran ekologis.'],
  ['activity', 'Pantau Pertumbuhannya', 'Catat tinggi, kondisi daun, dan kelembapan tanah. Sensor IoT membantu memberi saran perawatan yang tepat.'],
  ['users', 'Tumbuhkan Kepedulian', 'Bergabunglah dengan relawan lain memulihkan hutan. Alam adalah ciptaan yang dipercayakan untuk kita jaga.']
];
let SI = 0;
const slide = () => {
  const s = SL[SI];
  return `<div class="sl">
    <div class="art">${ic(s[0], 84)}<img alt="" src="assets/bg/lingkaran-${SI + 1}.jpg" onerror="this.remove()"></div>
    <div class="pn">
    <h1>${s[1]}</h1>
    <p class="mut">${s[2]}</p>
    </div>
    <div class="dots">${SL.map((_, i) => `<i class="${i === SI ? 'on' : ''}"></i>`).join('')}</div>
    <div class="row" style="justify-content:center;margin-top:22px">${SI < 2 ? `<button class="btn o" onclick="sheet()">Lewati</button><button class="btn" onclick="nextS()">Lanjut</button>` : `<button class="btn" onclick="sheet()">Mulai</button>`}</div>
    </div>`
};
const nextS = () => {
  SI = Math.min(2, SI + 1);
  $('#sl').innerHTML = slide();
  const o = $('.ob');
  if (o && o.dataset) o.dataset.s = SI
};

/* ----- FOOTER ----- */
const foot = () => `<footer class="ft">
  <div class="ftg">
  <div><b class="flg">${logo(30, 1)} AKAR</b>
  <p>Aksi dan Kepedulian Alam untuk Regenerasi — platform pemantauan dan edukasi restorasi hutan berbasis relawan.</p>
  </div>
  <div><b>Platform</b><a onclick="legal('priv')">Kebijakan Privasi</a><a onclick="legal('terms')">Syarat &amp; Ketentuan</a></div>
  <div><b>Bantuan</b><a onclick="legal('help')">Panduan Lapangan</a><a onclick="legal('contact')">Hubungi Kami</a></div>
  </div>
  <div class="ftb">© 2026 AKAR. Hak cipta dilindungi. Prototipe pengembangan – seluruh data dan angka bersifat simulasi.</div>
  </footer>`;

/* ----- HALAMAN DEPAN ----- */
const landing = () => `<div class="splash">${logo(120, 1)}
  <h1>AKAR</h1>
  <p>Pulihkan Alam, Rawat Kehidupan</p>
  </div>
  <div class="ob" data-s="0">
  <div class="obt"><b class="alg">${logo(36)} AKAR</b><button class="btn s" onclick="sheet()">Masuk</button></div>
  <div class="obm">
  <div id="sl">${slide()}</div>
  </div>
  ${foot()}</div>`;

/* ----- MASUK & DAFTAR ----- */
let AT = QS.get('tab') === 'daftar' ? 'daftar' : 'masuk';
const fLogin = () => `<label>Email atau username</label><input id="li" autocomplete="username" oninput="chkId(this)"><small id="li-m" class="fm"></small><label>Kata sandi</label>
  <div style="position:relative"><input id="lp" type="password"><a onclick="eye('lp')" style="position:absolute;right:12px;top:11px">${ic('eye', 20)}</a></div>
  <div id="err" class="err"></div>
  <button class="btn" style="width:100%;margin-top:14px" onclick="doLogin()">Masuk</button>
  <p class="mut" style="margin-top:10px;font-size:.85rem">Demo: <b>demo</b> / <b>demo123</b></p>`;
const fReg = () => `<label>Nama lengkap</label><input id="rn"><label>Username</label><input id="ru"><label>Email</label><input id="re" type="email" placeholder="nama@gmail.com" oninput="chkEmail(this)"><small id="re-m" class="fm"></small><label>Kata sandi</label><input id="rp" type="password" oninput="chkPw(this)"><small id="rp-m" class="fm"></small><label>Konfirmasi kata sandi</label><input id="rq" type="password" oninput="chkSame(this,'rp')"><small id="rq-m" class="fm"></small><label style="display:flex;gap:8px;align-items:center;font-weight:400"><input id="rk" type="checkbox" style="width:20px;min-height:0"> Saya menyetujui Syarat &amp; Ketentuan Konservasi</label>
  <div id="err" class="err"></div>
  <button class="btn" style="width:100%;margin-top:14px" onclick="doReg()">Daftar</button>`;
const eye = id => {
  const i = $('#' + id);
  i.type = i.type === 'password' ? 'text' : 'password'
};
const tab = t => {
  AT = t;
  render()
};
const authPg = () => `<div class="au">
  <div class="card">
  <div class="row2"><a href="index.html" class="alg">${logo(40)} AKAR</a><a class="btn o s" href="index.html">${ic('left', 16)} Kembali</a></div>
  <div class="tabs"><button class="${AT === 'masuk' ? 'on' : ''}" onclick="tab('masuk')">Masuk</button><button class="${AT === 'daftar' ? 'on' : ''}" onclick="tab('daftar')">Daftar</button></div>
  ${AT === 'masuk' ? fLogin() : fReg()}
  <div class="or">atau lanjutkan dengan</div>
  <div class="row"><button class="btn o" onclick="ssoM('Google')"><b style="color:#4285F4">G</b> Google</button><button class="btn o" onclick="ssoM('Apple')">${ic('shield', 16)} Apple</button></div>
  </div>
  </div>`;

function doLogin() {
  const id = val('li').toLowerCase(),
    pw = $('#lp').value;
  if (!id || !pw) {
    $('#err').textContent = 'Email/username dan kata sandi wajib diisi.';
    return
  }
  const u = db.users.find(u => (u.email.toLowerCase() === id || u.username.toLowerCase() === id) && u.pw === pw);
  if (!u) {
    $('#err').textContent = 'Email/username atau kata sandi salah.';
    return
  }
  loginAs(u)
}

function doReg() {
  const er = [],
    n = val('rn'),
    un = val('ru'),
    em = val('re'),
    p = $('#rp').value;
  if (n.length < 3) er.push('Nama lengkap minimal 3 karakter.');
  if (!/^[a-z0-9_]{3,20}$/i.test(un)) er.push('Username 3–20 karakter (huruf, angka, _).');
  if (!emailOk(em)) er.push('Format email tidak valid. Contoh: nama@gmail.com');
  if (p.length < 6) er.push('Kata sandi minimal 6 karakter.');
  if (p !== $('#rq').value) er.push('Konfirmasi kata sandi tidak sama.');
  if (!$('#rk').checked) er.push('Setujui Syarat & Ketentuan.');
  if (db.users.some(u => u.username.toLowerCase() === un.toLowerCase() || u.email.toLowerCase() === em.toLowerCase())) er.push('Username atau email sudah terdaftar.');
  if (er.length) {
    $('#err').innerHTML = er.join('<br>');
    return
  }
  const u = {
    id: uid(),
    name: n,
    username: un,
    email: em,
    pw: p,
    type: '',
    area: '',
    avatar: null,
    joined: Date.now()
  };
  db.users.push(u);
  loginAs(u)
}

/* ----- LENGKAPI PROFIL ----- */
let SU = { avatar: null, type: 'Relawan Mahasiswa' };
const setupPg = () => {
  const u = me();
  return `<div class="au">
    <div class="card" style="width:min(480px,100%)">
    <h2>Lengkapi Profil</h2>
    <p class="mut">Tentukan peran dan kawasan konservasi Anda.</p>
    <div class="flex" style="margin:14px 0">
    <div id="pva">${av(u, 72)}</div>
    <label class="btn o s" style="margin:0">${ic('camera', 16)} Unggah foto<input type="file" accept="image/*" hidden onchange="photoIn(this,'av')"></label></div>
    <label>Jenis pengguna</label>
    <div class="segs">${TYPES.map(t => `<button type="button" class="chip ${SU.type === t ? 'on' : ''}" data-v="${t}" onclick="setU('${t}')">${t}</button>`).join('')}</div>
    <div id="tw" style="display:none"><label>Keterangan jenis pengguna</label><input id="tx" maxlength="40" placeholder="mis. Guru, Petani, Mahasiswa Teologi"></div>
    <label>Kode Area Konservasi</label><input id="ac" list="al" value="SLK-2026"><datalist id="al">${Object.keys(AREAS).map(k => `<option value="${k}">${AREAS[k].n}</option>`).join('')}</datalist><small>Kode contoh: SLK-2026 (Kawasan Silangkitang, Tapanuli Utara)</small>
    <div id="err" class="err"></div>
    <button class="btn" style="width:100%;margin-top:14px" onclick="doSetup()">Gabung &amp; Sinkronkan Peta</button></div>
    </div>`
};
PHCB.av = u => {
  SU.avatar = u;
  $('#pva').innerHTML = `<img class="avi" style="width:72px;height:72px" src="${u}" alt="">`
};
const setU = t => {
  SU.type = t;
  document.querySelectorAll('.segs .chip').forEach(b => b.classList.toggle('on', b.dataset.v === t));
  const w = $('#tw');
  if (w && w.style) w.style.display = t === 'Lainnya' ? 'block' : 'none'
};

function doSetup() {
  const c = val('ac').toUpperCase(),
    u = me();
  if (!AREAS[c]) {
    $('#err').textContent = 'Kode area tidak dikenal. Gunakan kode dari koordinator.';
    return
  }
  if (SU.type === 'Lainnya' && val('tx').length < 3) {
    $('#err').textContent = 'Isi keterangan jenis pengguna (min. 3 karakter).';
    return
  }
  u.type = SU.type;
  u.typeNote = SU.type === 'Lainnya' ? val('tx') : '';
  u.area = c;
  if (SU.avatar) u.avatar = SU.avatar;
  db.data[u.username] = newData(c, 6);
  save();
  toast('Batas plot lokal berhasil disinkronkan');
  setTimeout(() => location.href = 'dashboard.html', 900)
}
PAGES.landing = landing;
PAGES.auth = authPg;
PAGES.setup = setupPg;
