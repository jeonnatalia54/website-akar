/* ===== js/main.js ===== */
/* ----- PEMANDU HALAMAN ----- */
function render() {
  applyTheme();
  const page = document.body.dataset.page,
    pub = ['landing', 'auth'],
    app = $('#app');
  if (!db.session && !pub.includes(page)) {
    location.replace('index.html');
    return
  }
  if (db.session && !me()) {
    db.session = null;
    save();
    location.replace('index.html');
    return
  }
  if (db.session && pub.includes(page)) {
    location.replace(me().area ? 'dashboard.html' : 'setup.html');
    return
  }
  if (db.session && page === 'setup' && me().area) {
    location.replace('dashboard.html');
    return
  }
  if (db.session && page !== 'setup' && !me().area) {
    location.replace('setup.html');
    return
  }
  const fn = PAGES[page];
  if (!fn) {
    app.innerHTML = '<p style="padding:20px">Halaman tidak ditemukan.</p>';
    return
  }
  closeM();
  if (pub.includes(page) || page === 'setup') {
    document.body.classList.remove('big');
    app.innerHTML = fn();
    return
  }
  sync();
  const [h, act, after] = fn();
  app.innerHTML = shell(h, act);
  if (after) after()
}
render();
