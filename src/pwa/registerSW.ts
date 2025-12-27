const SW_URL = '/sw.js';

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(SW_URL, { scope: '/' }).catch(() => {});
  });
}

registerServiceWorker();

