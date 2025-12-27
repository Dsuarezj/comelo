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

  const baseManifestResponse = await fetch('/manifest.json');
  const baseManifest = await baseManifestResponse.json();
  
  const baseUrl = window.location.origin;

  const normalizeUrl = (url) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('./')) {
      return new URL(url.substring(2), baseUrl).href;
    }
    if (url.startsWith('/')) {
      return new URL(url, baseUrl).href;
    }
    return new URL(url, baseUrl).href;
  };

  const manifest = {
    ...baseManifest,
    description: description || baseManifest.description,
    lang: detectedLang || baseManifest.lang,
    start_url: normalizeUrl(baseManifest.start_url),
    scope: normalizeUrl(baseManifest.scope),
    icons: baseManifest.icons?.map(icon => ({
      ...icon,
      src: normalizeUrl(icon.src)
    })) || [],
    shortcuts: baseManifest.shortcuts?.map(shortcut => ({
      ...shortcut,
      url: normalizeUrl(shortcut.url),
      icons: shortcut.icons?.map(icon => ({
        ...icon,
        src: normalizeUrl(icon.src)
      })) || []
    })) || []
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

