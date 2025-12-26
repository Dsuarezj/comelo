# 🌍 Arquitectura de Traducciones - Comelo.app

Sistema escalable de traducciones que separa traducciones core de la app y traducciones de datos (productos y recetas).

## 🎯 Objetivos

1. **Separación Clara** - Traducciones core vs traducciones de datos
2. **Carga Dinámica** - Solo cargar traducciones necesarias
3. **Escalabilidad** - Soportar contenido generado por usuarios
4. **Sincronización** - Preparado para Dropbox sync
5. **Múltiples Fuentes** - Core + Local + Dropbox

## 📁 Estructura de Archivos

```
src/
├── i18n/                           # 🔧 Traducciones CORE de la app
│   ├── index.ts                    # Config i18next
│   └── locales/
│       ├── es.json                 # Interfaz en español
│       ├── en.json                 # Interfaz en inglés
│       └── ca.json                 # Interfaz en catalán
│
├── data/translations/              # 📊 Traducciones de DATOS
│   ├── products/
│   │   ├── common.es.json          # Productos core (ES)
│   │   ├── common.en.json          # Productos core (EN)
│   │   └── common.ca.json          # Productos core (CA)
│   │
│   └── recipes/
│       ├── bowl-amaranto-frutas.{es,en,ca}.json
│       ├── pollo-curry.{es,en,ca}.json
│       └── ensalada-quinoa.{es,en,ca}.json
│
└── services/
    └── TranslationService.ts       # 🔄 Servicio unificado
```

## 🔧 Traducciones CORE (i18n/)

### Contenido

Traducciones de la **interfaz de usuario**:
- Navegación
- Botones y acciones
- Mensajes de error
- Textos de la UI
- Placeholder texts

### Ejemplo: `i18n/locales/es.json`

```json
{
  "app": {
    "name": "Comelo",
    "tagline": "Tu asistente de nutrición"
  },
  "common": {
    "loading": "Cargando...",
    "error": "Error",
    "save": "Guardar",
    "cancel": "Cancelar"
  },
  "nav": {
    "home": "Inicio",
    "lists": "Listas",
    "recipes": "Recetas",
    "profile": "Perfil"
  }
}
```

### Uso

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('app.name')}</h1>;
}
```

## 📊 Traducciones de DATOS (data/translations/)

### Contenido

Traducciones de **contenido dinámico**:
- Nombres de productos
- Categorías
- Tags nutricionales
- Recetas completas
- Descripciones nutricionales

### Estructura de Productos: `products/common.{lang}.json`

```json
{
  "product": {
    "broccoli": "Brócoli",
    "banana": "Plátano"
  },
  "category": {
    "vegetables": "Verduras",
    "fruits": "Frutas"
  },
  "tag": {
    "high-protein": "Alta Proteína",
    "vegan": "Vegano"
  },
  "nutrition": {
    "excellent-protein": "Excelente fuente de proteína"
  }
}
```

### Estructura de Recetas: `recipes/{recipe-id}.{lang}.json`

```json
{
  "recipe": {
    "pollo-curry": {
      "name": "Pollo al Curry",
      "description": "Delicioso pollo...",
      "step1": {
        "title": "Cortar el pollo",
        "description": "...",
        "time": "5 minutos",
        "tip": "..."
      }
    }
  }
}
```

## 🔄 Hook useDataTranslation

Hook React para traducciones de datos con reactividad automática al cambio de idioma.

### Características

✅ **Reactivo** - Se actualiza automáticamente al cambiar idioma
✅ **Cache Inteligente** - Usa TranslationService internamente
✅ **API Simple** - Sintaxis similar a `useTranslation`
✅ **Fallbacks** - Siempre retorna algo válido

### Uso en Componentes

```typescript
import { useDataTranslation } from '../hooks/useDataTranslation';

function ProductCard({ productKey }) {
  const t = useDataTranslation();

  const [name, setName] = useState('');

  useEffect(() => {
    t(`product.${productKey}`).then(setName);
  }, [t, productKey]);

  return <div>{name}</div>;
}
```

### Paths Soportados

```typescript
// Productos
await t('product.broccoli')        // → "Brócoli"

// Categorías
await t('category.vegetables')     // → "Verduras"

// Tags nutricionales
await t('tag.high-protein')        // → "Alta Proteína"

// Descripciones nutricionales
await t('nutrition.excellent-protein') // → "Excelente fuente de proteína"

// Herramientas de cocina
await t('tool.knife')              // → "Cuchillo"
```

## 🔧 TranslationService (Interno)

Servicio interno usado por el hook. Solo usar directamente fuera de componentes React.

### API Directa

```typescript
import { translationService } from '../services/TranslationService';

// Precargar traducciones esenciales
await translationService.preloadEssentials('es');

// Obtener nombre de producto
const name = await translationService.getProductName('broccoli', 'es');

// Obtener nombre de receta
const title = await translationService.getRecipeName(recipe, 'es');

// Limpiar caché (útil al cambiar idioma)
translationService.clearCache();
```

## 🌐 Selector de Idioma

### Componente LanguageSelector

Permite al usuario cambiar entre ES, EN, CA.

```typescript
import { LanguageSelector } from '../components';

function MyPage() {
  return (
    <Header>
      <LanguageSelector />
    </Header>
  );
}
```

### Comportamiento

1. Usuario click en icono de globo 🌍
2. Se muestra dropdown con 3 idiomas
3. Usuario selecciona idioma
4. `i18n.changeLanguage(lang)` actualiza traducciones core
5. `TranslationService` recarga traducciones de datos
6. Preferencia guardada en `localStorage`

## 📦 Fuentes de Datos (Futuro)

El sistema está preparado para múltiples fuentes:

```
┌─────────────────────────────────────────────┐
│           TRANSLATION SERVICE               │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌─────┐   ┌──────────┐  ┌─────────┐
    │CORE │   │  LOCAL   │  │ DROPBOX │
    │DATA │   │ STORAGE  │  │  SYNC   │
    └─────┘   └──────────┘  └─────────┘
        │           │           │
        │           │           │
    Built-in   IndexedDB    Dropbox API
    recipes     User's      Shared
    products    recipes     recipes
```

### Prioridad de Carga

1. **Core** - Recetas y productos incluidos en la app
2. **Local** - Contenido creado localmente por el usuario
3. **Dropbox** - Contenido sincronizado desde la nube

### Estructura en Dropbox (Futuro)

```
dropbox://comelo/
├── recipes/
│   ├── user_recipe_1/
│   │   ├── index.json                # Datos
│   │   ├── translations.es.json      # Traducción ES
│   │   ├── translations.en.json      # Traducción EN
│   │   └── image.jpg                 # Imagen
│   │
│   └── shared_recipe_abc/            # Receta compartida
│       ├── index.json
│       └── translations.es.json
│
├── products/
│   └── user_product_1/
│       ├── index.json
│       └── translations.es.json
│
└── recipe_books/                     # Libros de recetas
    ├── mis_favoritas/
    │   └── recipes.json              # Lista de IDs
    │
    └── verano_2025/
        └── recipes.json
```

## 🔑 Sistema de Claves

### Convenciones

```typescript
// Productos
"product.{key}"          // product.broccoli
"category.{key}"         // category.vegetables
"tag.{key}"             // tag.high-protein
"nutrition.{key}"       // nutrition.excellent-protein

// Recetas
"recipe.{id}.name"      // recipe.pollo-curry.name
"recipe.{id}.step{N}"   // recipe.pollo-curry.step1
```

### Resolución Automática

```typescript
// El servicio resuelve claves automáticamente
const key = "product.broccoli";
const name = translationService.translateKey(key);
// → "Brócoli" (si idioma es ES)
```

## 🎨 Flujo Completo

### 1. Usuario Abre la App

```typescript
// App inicia
i18n.init();  // Carga traducciones CORE

// Precargar traducciones esenciales de productos
const lang = i18n.language;
await translationService.preloadEssentials(lang);
```

### 2. Usuario Navega a Recetas

```typescript
// Receta se renderiza
const recipe = { id: 'pollo-curry', nameKey: '...' };

// Se carga traducción bajo demanda
const name = await translationService.getRecipeName(recipe, lang);
```

### 3. Usuario Cambia Idioma

```typescript
// Usuario selecciona catalán
await i18n.changeLanguage('ca');

// Limpiar caché de traducciones de datos
translationService.clearCache();

// Recargar traducciones esenciales
await translationService.preloadEssentials('ca');

// Los componentes se re-renderizan automáticamente
```

### 4. Usuario Crea Receta (Futuro)

```typescript
// Crear receta local
const userRecipe = {
  id: 'user_pasta_carbonara',
  source: 'local',  // local | dropbox
  name: { es: 'Pasta Carbonara', en: 'Carbonara Pasta' },
  ...
};

// Guardar en IndexedDB
await sessionService.saveFile('recipes/user_pasta_carbonara.json', userRecipe);

// Si hay Dropbox conectado, sincronizar
if (dropboxAuth.isAuthenticated) {
  await dropboxSync.uploadRecipe(userRecipe);
}
```

## 📊 Ventajas del Sistema

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Carga inicial** | Todo junto | Solo lo necesario |
| **Cambio de idioma** | Reload completo | Dinámico + cache |
| **Contenido usuario** | No soportado | ✅ Preparado |
| **Dropbox sync** | No | ✅ Arquitectura lista |
| **Libros de recetas** | No | ✅ Estructura preparada |

## 🚀 Roadmap

### Fase 1 (Actual) ✅
- [x] Separar traducciones core y datos
- [x] Servicio de traducciones unificado
- [x] Selector de idioma UI
- [x] Carga dinámica de traducciones
- [x] Cache inteligente

### Fase 2 (Próximo)
- [ ] Soporte para contenido local del usuario
- [ ] Guardar recetas custom en IndexedDB
- [ ] Estructura de libros de recetas

### Fase 3 (Futuro)
- [ ] Integración con Dropbox
- [ ] Sincronización automática
- [ ] Compartir recetas vía Dropbox
- [ ] Permisos de escritura/lectura por carpeta

## 📝 Mejores Prácticas

### 1. Traducciones Core

```typescript
// ✅ BIEN - Usar i18n para UI
const { t } = useTranslation();
<Button>{t('common.save')}</Button>

// ❌ MAL - No hardcodear textos
<Button>Guardar</Button>
```

### 2. Traducciones de Datos en Componentes

```typescript
// ✅ BIEN - Usar hook en componentes React
const t = useDataTranslation();
const name = await t('product.broccoli');

// ⚠️ OK - Solo fuera de componentes React
const name = await translationService.getProductName('broccoli', lang);

// ❌ MAL - No acceder directamente
const name = productTranslations.product.broccoli;
```

### 3. Cambio de Idioma

```typescript
// ✅ BIEN - Limpiar caché
await i18n.changeLanguage('en');
translationService.clearCache();
await translationService.preloadEssentials('en');

// ❌ MAL - Solo cambiar i18n
await i18n.changeLanguage('en');
```

## 🔍 Debugging

```typescript
// Ver idioma actual
console.log(i18n.language);  // 'es'

// Ver traducciones cargadas
console.log(translationService.cache);

// Forzar recarga
translationService.clearCache();
await translationService.preloadEssentials('es');
```

---

**🌍 Sistema de traducciones listo para escalar con contenido generado por usuarios y sincronización en la nube!**
