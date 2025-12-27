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
  
  const manifest = {
    ...baseManifest,
    description: description || baseManifest.description,
    lang: detectedLang || baseManifest.lang
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

