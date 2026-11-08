/* ===== js/calendar.js ===== */
/* ----- KALENDER ----- */
let CM = new Date();
CM.setDate(1);
let CS = ymd(Date.now());
const EVT = {
  patrol: ['Patroli', 'var(--p)'],
  pupuk: ['Pemupukan', 'var(--wn)'],
  audit: ['Audit Kawasan', '#3B6EA5'],
  misi: ['Misi selesai', 'var(--lf)']
};
const REM = [
  [0, 'Tanpa pengingat'],
  [15, '15 menit sebelumnya'],
  [30, '30 menit sebelumnya'],
  [60, '1 jam sebelumnya'],
  [1440, '1 hari sebelumnya']
];
const tav = ids => `<span class="tavs">${ids.slice(0, 5).map(i => {
    const c = D().contacts.find(x => x.id === i);
    return c ? `<span class="avi tav" title="${esc(c.name)}">${ini(c.name)}</span>` : ''
  }).join('')}</span>`;
const evOn = (d, k) => d.events.filter(e => e.date === k).sort((a, b) => (a.time || '').localeCompare(b.time || '')).concat(d.done.filter(x => ymd(x.ts) === k).map(x => ({
  t: 'misi',
  title: `${MIS[x.ty].n} – ${x.tid}`,
  note: '+' + x.pts + ' poin',
  time: '',
  status: 'Selesai'
})));

function calPg() {
  const d = D(),
    y = CM.getFullYear(),
    m = CM.getMonth(),
    off = (new Date(y, m, 1).getDay() + 6) % 7,
    n = new Date(y, m + 1, 0).getDate(),
    td = ymd(Date.now()),
    teams = d.teams.filter(t => t.area === d.area);
  let cells = '';
  for (let i = 0; i < off; i++) cells += '<div class="cd x"></div>';
  for (let i = 1; i <= n; i++) {
    const k = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(i).padStart(2, '0');
    cells += `<div class="cd ${k === td ? 'td' : ''} ${k === CS ? 'on' : ''}" onclick="CS='${k}';render()"><b>${i}</b><br>${evOn(d, k).slice(0, 3).map(e => `<i class="dot" style="background:${EVT[e.t][1]}"></i>`).join('')}</div>`
  }
  const up = d.events.filter(e => e.status !== 'Selesai' && e.date >= td).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || ''))).slice(0, 4);
  return [
    `${head('Kalender & Tim', 'Jadwal patroli, pemupukan, dan audit bersama tim.', `<button class="btn" onclick="evM()">${ic('plus', 18)} Tambah Jadwal</button>`)}
      <div class="card" style="margin-bottom:16px">
      <div class="row2">
      <h3>${ic('users', 18)} Tim Saya</h3>
      <button class="btn o s" onclick="teamM()">${ic('plus', 14)} Buat Tim</button></div>
      <div class="grid g-c" style="margin-top:10px">${teams.map(t => `<div class="card" style="box-shadow:none"><b>${esc(t.name)}</b>
        <div style="margin:8px 0">${tav(t.members)} <small>${t.members.length} anggota</small></div>
        <div class="row"><a class="btn s" href="chat-room.html?c=team:${t.id}">${ic('chat', 14)} Chat</a><button class="btn o s" onclick="callM('team:${t.id}')">${ic('phone', 14)} Telepon</button></div>
        </div>`).join('') || '<p class="mut">Belum ada tim. Buat tim pertama Anda.</p>'}</div>
      </div>
      <div class="grid two">
      <div class="card">
      <div class="row2" style="margin-bottom:10px"><button class="btn o s" onclick="CM.setMonth(CM.getMonth()-1);render()">${ic('left', 16)}</button>
      <h3>${CM.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
      <button class="btn o s" onclick="CM.setMonth(CM.getMonth()+1);render()">${ic('right', 16)}</button></div>
      <div class="cal">${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(x => `<div class="wd">${x}</div>`).join('')}${cells}</div>
      <div class="chips" style="margin-top:12px">${Object.values(EVT).map(e => `<span class="chip"><i class="dot" style="background:${e[1]}"></i>${e[0]}</span>`).join('')}</div>
      <h3 style="margin-top:14px">Agenda Mendatang</h3>
      ${up.map(e => `<div class="lr" onclick="CS='${e.date}';CM=new Date('${e.date}T12:00');CM.setDate(1);render()"><span class="ib2" style="margin:0">${ic('calendar', 18)}</span>
        <div class="lm"><b>${esc(e.title)}</b><small>${fmt(new Date(e.date + 'T12:00'))} · ${e.time || '-'}${teamName(e.team) ? ' · ' + esc(teamName(e.team)) : ''}</small></div>
        </div>`).join('') || '<p class="mut">Tidak ada agenda.</p>'}</div>
      <div class="card">
      <h3>${fmt(new Date(CS + 'T12:00'))}</h3>
      ${evOn(d, CS).map(e => {
        const tm = d.teams.find(t => t.id === e.team);
        return `<div class="evr">
          <div class="row2"><b>${e.time ? e.time + ' · ' : ''}${esc(e.title)}</b><span class="bd ${e.status === 'Selesai' ? 'ok' : e.status === 'Berlangsung' ? 'warn' : ''}">${e.status || 'Direncanakan'}</span></div>
          <small>${EVT[e.t][0]}${tm ? ' · ' + esc(tm.name) : ''}${e.remind ? ' · pengingat ' + e.remind + ' menit' : ''}${e.note ? ' · ' + esc(e.note) : ''}</small>${tm ? `<div>${tav(tm.members)}</div>` : ''}
          ${e.id ? `<div class="row evb">${e.status === 'Direncanakan' ? `<button class="btn s" onclick="evStatus('${e.id}','Berlangsung')">Mulai</button>` : e.status === 'Berlangsung' ? `<button class="btn s" onclick="evStatus('${e.id}','Selesai')">Selesaikan</button>` : ''}${tm ? `<a class="btn o s" href="chat-room.html?c=team:${tm.id}">${ic('chat', 14)} Chat tim</a><button class="btn o s" onclick="callM('team:${tm.id}')">${ic('phone', 14)} Telepon</button>` : ''}<button class="btn o s" onclick="evDel('${e.id}')">${ic('trash', 14)}</button></div>` : ''}</div>`
      }).join('') || '<p class="mut">Tidak ada agenda pada tanggal ini.</p>'}</div>
      </div>`,
    'calendar'
  ]
}

/* ----- FORM JADWAL & TIM ----- */
function evM() {
  const d = D();
  modal(`<h3>Tambah Jadwal</h3>
    <label>Judul</label><input id="et">
    <div class="row">
    <div><label>Tanggal</label><input id="ed" type="date" value="${CS}"></div>
    <div><label>Jam</label><input id="etm" type="time" value="07:00"></div>
    </div>
    <label>Jenis</label><select id="ey"><option value="patrol">Patroli</option><option value="pupuk">Pemupukan</option><option value="audit">Audit Kawasan</option></select>
    <label>Tim bertugas</label><select id="eteam"><option value="">Pribadi (tanpa tim)</option>${d.teams.filter(t => t.area === d.area).map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join('')}</select><label>Pengingat</label><select id="erm">${REM.map(r => `<option value="${r[0]}" ${r[0] === 30 ? 'selected' : ''}>${r[1]}</option>`).join('')}</select><label>Catatan</label><input id="en" maxlength="80">
    <small>Patroli: keliling kawasan · Pemupukan: pupuk organik · Audit Kawasan: verifikasi data oleh koordinator atau petugas kehutanan.</small>
    <div id="err" class="err"></div>
    <div class="acts"><button class="btn o" onclick="closeM()">Batal</button><button class="btn" onclick="addEv()">Simpan</button></div>`)
}

function addEv() {
  const t = val('et'),
    dt = val('ed'),
    tm = val('etm');
  if (t.length < 3 || !dt || !tm) {
    $('#err').textContent = 'Isi judul (min. 3 karakter), tanggal, dan jam.';
    return
  }
  D().events.push({
    id: uid(),
    date: dt,
    time: tm,
    t: val('ey'),
    title: t,
    note: val('en'),
    team: val('eteam'),
    status: 'Direncanakan',
    remind: +val('erm')
  });
  CS = dt;
  save();
  closeM();
  toast('Jadwal ditambahkan');
  render()
}

function evStatus(id, s) {
  const d = D(),
    e = d.events.find(x => x.id === id);
  e.status = s;
  if (s === 'Selesai' && !e.paid) {
    e.paid = 1;
    d.pts += 15;
    notify(`Agenda “${e.title}” selesai. +15 poin.`)
  }
  save();
  toast('Status: ' + s);
  render()
}
const evDel = id => confirmD('Hapus agenda ini?', () => {
  const d = D();
  d.events = d.events.filter(e => e.id !== id);
  save();
  render()
}, 'Hapus');

function teamM() {
  const d = D();
  modal(`<h3>Buat Tim</h3>
    <label>Nama tim</label><input id="tn2"><label>Anggota</label>${d.contacts.map(c => `<label class="chk"><input type="checkbox" id="tm-${c.id}"><span>${esc(c.name)}<br><small>${esc(c.role)}</small></span></label>`).join('')}
    <div id="err" class="err"></div>
    <div class="acts"><button class="btn o" onclick="closeM()">Batal</button><button class="btn" onclick="saveTeam()">Simpan</button></div>`)
}

function saveTeam() {
  const d = D(),
    n = val('tn2'),
    m = d.contacts.filter(c => $('#tm-' + c.id).checked).map(c => c.id);
  if (n.length < 3 || !m.length) {
    $('#err').textContent = 'Isi nama tim (min. 3 karakter) dan pilih minimal 1 anggota.';
    return
  }
  d.teams.push({ id: 't' + uid(), name: n, area: d.area, members: m });
  save();
  closeM();
  toast('Tim dibuat');
  render()
}
PAGES.calendar = calPg;
