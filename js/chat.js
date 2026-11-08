/* ===== js/chat.js ===== */
/* ----- DAFTAR CHAT ----- */
const CQ = { q: '' };
const tmx = ts => {
  const d = new Date(ts);
  return ymd(d) === ymd(Date.now()) ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
};

function chatList() {
  return [
    `${head('Pesan', 'Chat tim dan pribadi.', `<div class="row"><button class="btn o" onclick="contactsM()">${ic('users', 18)} Kontak</button><button class="btn" onclick="newChatM()">${ic('plus', 18)} Pesan Baru</button></div>`)}
      <div class="srch">${ic('search', 18)}<input placeholder="Cari percakapan" value="${esc(CQ.q)}" oninput="CQ.q=this.value;drawChats()"></div>
      <div id="cl" class="card cl" style="margin-top:12px;padding:6px"></div>`,
    'chat',
    drawChats
  ]
}

function drawChats() {
  const q = CQ.q.toLowerCase(),
    L = convs().filter(c => c.name.toLowerCase().includes(q));
  $('#cl').innerHTML = L.map(c => `<a class="cli" href="chat-room.html?c=${c.id}"><span class="avi cav">${c.team ? ic('users', 20) : ini(c.name)}</span>
    <div class="lm">
    <div class="row2"><b>${esc(c.name)}</b><small>${c.last ? tmx(c.last.ts) : ''}</small></div>
    <div class="row2"><small class="ell">${c.last ? (c.last.from === 'me' ? 'Anda: ' : c.team ? cname(c.last.from).split(' ')[0] + ': ' : '') + esc(c.last.text) : c.sub}</small>${c.unread ? `<span class="bd bad">${c.unread}</span>` : ''}</div>
    </div>
    </a>`).join('') || '<p class="mut" style="padding:14px">Tidak ada percakapan.</p>'
}

/* ----- RUANG CHAT ----- */
function chatRoom() {
  const id = QS.get('c'),
    cv = convs().find(x => x.id === id);
  if (!cv) return [empty('chat', 'Percakapan tidak ditemukan', '<a class="btn" href="chat.html">Kembali</a>'), 'chat'];
  D().chatRead[id] = Date.now();
  save();
  return [
    `<div class="card chroom">
      <div class="chh"><span class="avi cav">${cv.team ? ic('users', 20) : ini(cv.name)}</span>
      <div class="lm"><b>${esc(cv.name)}</b><small>${esc(cv.sub)}</small></div>
      <button class="btn o s" onclick="callM('${id}')" aria-label="Telepon">${ic('phone', 16)} Telepon</button></div>
      <div id="msgs" class="msgs"></div>
      <div class="cin"><input id="mi" placeholder="Tulis pesan…" autocomplete="off" onkeydown="if(event.key==='Enter')sendM()"><button class="btn" onclick="sendM()" aria-label="Kirim">${ic('send', 18)}</button></div>
      </div>`,
    'chat',
    drawMsgs
  ]
}

function drawMsgs() {
  const id = QS.get('c'),
    M = D().chats[id] || [],
    team = id.startsWith('team:'),
    e = $('#msgs');
  if (!e) return;
  e.innerHTML = M.map(m => `<div class="bub ${m.from === 'me' ? 'me' : ''}">${team && m.from !== 'me' ? `<small class="who">${esc(cname(m.from))}</small>` : ''}
    <p>${esc(m.text)}</p>
    <small>${tmx(m.ts)}</small></div>`).join('') || '<p class="mut" style="text-align:center">Belum ada pesan. Mulai percakapan!</p>';
  e.scrollTop = e.scrollHeight
}

function sendM() {
  const t = val('mi');
  if (!t) return;
  sendMsg(QS.get('c'), t);
  $('#mi').value = '';
  drawMsgs()
}

function onChatUpdate(cid) {
  const p = document.body.dataset.page;
  if (p === 'chatroom' && QS.get('c') === cid) {
    D().chatRead[cid] = Date.now();
    save();
    drawMsgs()
  } else if (p === 'chat') drawChats()
}

/* ----- KONTAK & TELEPON ----- */
function newChatM() {
  modal(`<h3>Pesan Baru</h3>
    ${convs().map(c => `<a class="cli" href="chat-room.html?c=${c.id}"><span class="avi cav">${c.team ? ic('users', 20) : ini(c.name)}</span>
      <div class="lm"><b>${esc(c.name)}</b><small>${esc(c.sub)}</small></div>
      </a>`).join('')}
    <div class="acts"><button class="btn o" onclick="closeM()">Tutup</button></div>`)
}

function contactsM() {
  const d = D();
  modal(`<h3>Kontak</h3>
    ${d.contacts.map(c => `<div class="cli"><span class="avi cav">${ini(c.name)}</span>
      <div class="lm"><b>${esc(c.name)}</b><small>${esc(c.role)}${c.phone ? ' · ' + esc(c.phone) : ''}</small></div>
      <a class="btn o s" href="chat-room.html?c=c:${c.id}">${ic('chat', 14)}</a><button class="btn o s" onclick="callUi('${c.id}')">${ic('phone', 14)}</button></div>`).join('')}
    <h3 style="margin-top:14px">Tambah Kontak</h3>
    <div class="row"><input id="kn" placeholder="Nama"><input id="kr" placeholder="Peran (mis. Relawan)"></div>
    <input id="kp" placeholder="Nomor telepon (opsional)" inputmode="tel" style="margin-top:8px">
    <div id="err" class="err"></div>
    <div class="acts"><button class="btn o" onclick="closeM()">Tutup</button><button class="btn" onclick="addContact()">Simpan Kontak</button></div>`)
}

function addContact() {
  const n = val('kn');
  if (n.length < 2) {
    $('#err').textContent = 'Isi nama kontak.';
    return
  }
  D().contacts.push({ id: 'c' + uid(), name: n, role: val('kr') || 'Relawan', phone: val('kp') });
  save();
  toast('Kontak ditambahkan');
  contactsM()
}

function callM(cid) {
  const d = D();
  if (cid.startsWith('team:')) {
    const t = d.teams.find(x => x.id === cid.slice(5));
    modal(`<h3>Telepon anggota ${esc(t.name)}</h3>
      ${t.members.map(m => {
        const c = d.contacts.find(x => x.id === m);
        return `<button class="btn o sso" onclick="callUi('${m}')">${ic('phone', 16)} ${esc(c.name)} · ${esc(c.role)}</button>`
      }).join('')}
      <div class="acts"><button class="btn o" onclick="closeM()">Tutup</button></div>`);
    return
  }
  callUi(cid.slice(2))
}
let CTM = null,
  CSEC = 0;

function callUi(id) {
  const c = D().contacts.find(x => x.id === id);
  CSEC = 0;
  clearInterval(CTM);
  modal(`<div style="text-align:center"><span class="avi cav" style="width:72px;height:72px;font-size:1.6rem">${ini(c.name)}</span>
    <h3 style="margin-top:8px">${esc(c.name)}</h3>
    <p id="cst" class="mut">Memanggil…</p>
    <div class="acts" style="justify-content:center"><button class="btn d" onclick="endCall()">${ic('phone', 16)} Akhiri</button></div>
    </div>
    <label>Nomor telepon ${esc(c.name.split(' ')[0])}</label>
    <div class="row"><input id="cph" inputmode="tel" placeholder="08xxxxxxxxxx" value="${esc(c.phone || '')}"><button class="btn o s" onclick="telCall('${c.id}')">${ic('phone', 14)} Telepon via HP</button></div>
    <small>Panggilan di atas adalah simulasi. Untuk menelepon sungguhan, isi nomor lalu tekan “Telepon via HP”.</small>`);
  setTimeout(() => {
    const e = $('#cst');
    if (e) e.textContent = 'Tersambung · 00:00'
  }, 1800);
  CTM = setInterval(() => {
    CSEC++;
    const e = $('#cst');
    if (e && CSEC > 2) e.textContent = 'Tersambung · ' + String(Math.floor((CSEC - 2) / 60)).padStart(2, '0') + ':' + String((CSEC - 2) % 60).padStart(2, '0')
  }, 1000)
}

function endCall() {
  clearInterval(CTM);
  CTM = null;
  closeM();
  toast('Panggilan berakhir')
}

function telCall(id) {
  const c = D().contacts.find(x => x.id === id),
    p = val('cph').replace(/[^\d+]/g, '');
  if (p.length < 6) {
    toast('Isi nomor telepon yang valid.', 'warn');
    return
  }
  c.phone = p;
  save();
  location.href = 'tel:' + p
}
PAGES.chat = chatList;
PAGES.chatroom = chatRoom;
