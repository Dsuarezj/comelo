const SW_URL = '/sw.js';

if ('serviceWorker' in navigator) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerSW);
  } else {
    registerSW();
  }
}

function registerSW() {
  navigator.serviceWorker
    .register(SW_URL, { scope: '/' })
    .then((registration) => {
      if (registration.installing) {
        console.log('Service Worker instalando...');
      } else if (registration.waiting) {
        console.log('Service Worker esperando...');
      } else if (registration.active) {
        console.log('Service Worker activo:', registration.scope);
      }
    })
    .catch((error) => {
      console.error('Error registrando Service Worker:', error);
    });
}

