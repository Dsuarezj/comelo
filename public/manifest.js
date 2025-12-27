(async function() {
  function detectLanguage() {
    const saved = localStorage.getItem('comelo_language');
    if (saved) {
      return saved.split('-')[0];
    }
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.split('-')[0];
  }

  async function loadDescription(lang) {
    try {
      const response = await fetch(`/src/i18n/locales/${lang}.json`);
      if (response.ok) {
        const translations = await response.json();
        if (translations.manifest?.description) {
          return translations.manifest.description;
        }
      }
    } catch (error) {
    }
    return null;
  }

  const detectedLang = detectLanguage();
  let description = await loadDescription(detectedLang);
  
  if (!description && detectedLang !== 'en') {
    description = await loadDescription('en');
  }
  
  if (!description) {
    const fallbackResponse = await fetch('/src/i18n/locales/es.json');
    if (fallbackResponse.ok) {
      const fallbackTranslations = await fallbackResponse.json();
      description = fallbackTranslations.manifest?.description || '';
    }
  }

  const lang = detectedLang;

  const manifest = {
    id: "com.comelo.app",
    name: "Comelo - Tu Asistente de Nutrición",
    short_name: "Comelo",
    description: description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#01EF41",
    theme_color: "#01EF41",
    orientation: "portrait-primary",
    categories: ["health", "food", "lifestyle"],
    lang: lang,
    dir: "ltr",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icons-app/android/android-launchericon-48-48.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icons-app/android/android-launchericon-72-72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icons-app/android/android-launchericon-96-96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icons-app/android/android-launchericon-144-144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icons-app/android/android-launchericon-192-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icons/icons-app/android/android-launchericon-512-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    shortcuts: [
      {
        name: "Nueva Lista",
        short_name: "Lista",
        description: "Crear una nueva lista de compras",
        url: "/lists/new",
        icons: [
          {
            src: "/icon.png",
            sizes: "96x96",
            type: "image/png"
          }
        ]
      },
      {
        name: "Recetas",
        short_name: "Recetas",
        description: "Explorar recetas saludables",
        url: "/recipes",
        icons: [
          {
            src: "/icon.png",
            sizes: "96x96",
            type: "image/png"
          }
        ]
      }
    ]
  };

  let link = document.querySelector('link[rel="manifest"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'manifest';
    document.head.appendChild(link);
  }
  
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  link.href = url;
})();

