(() => {
  if (!['http:', 'https:'].includes(window.location.protocol)) return;
  const page = document.body.dataset.analyticsPage;
  if (!['portfolio', 'cv'].includes(page)) return;

  const code = String(window.PORTFOLIO_ANALYTICS?.goatcounterCode || '').trim().toLowerCase();
  // Accept only a GoatCounter account name, never an arbitrary script/endpoint.
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(code)) return;

  const dashboard = `https://${code}.goatcounter.com`;
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  const ownerView = new URLSearchParams(window.location.search).get('admin') === '1';
  if (local || ownerView) {
    document.querySelectorAll('[data-analytics-dashboard]').forEach(link => {
      link.href = dashboard;
      link.hidden = false;
    });
    // Previewing and opening the owner shortcut should not inflate the numbers.
    return;
  }

  // Keep /portfolio/ and /portfolio/index.html in one row; omit query strings.
  window.goatcounter = {
    path: window.location.pathname.replace(/\/index\.html$/, '/')
  };
  const script = document.createElement('script');
  script.src = 'https://gc.zgo.at/count.v5.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.integrity = 'sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ';
  script.dataset.goatcounter = `${dashboard}/count`;
  document.head.append(script);
})();
