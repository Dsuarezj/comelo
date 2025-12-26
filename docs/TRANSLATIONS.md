# Sistema de Traducciones - Comelo

Sistema completo de traducciones que separa traducciones de UI y datos, con soporte para variaciones regionales.

## Contenido

1. [Visión General](#visión-general)
2. [Traducciones de UI](#traducciones-de-ui)
3. [Traducciones de Datos](#traducciones-de-datos)
4. [Traducciones Regionales](#traducciones-regionales)
5. [Selector de Idioma](#selector-de-idioma)
6. [API y Uso](#api-y-uso)
7. [Añadir Nuevas Regiones](#añadir-nuevas-regiones)

## Visión General

El sistema gestiona dos tipos de traducciones:

1. **Traducciones de UI** (`src/i18n/locales/`): Interfaz, botones, mensajes
2. **Traducciones de Datos** (`src/data/translations/`): Productos, recetas, alérgenos

Ambos soportan **variaciones regionales** para adaptar el vocabulario a España, Ecuador, México, Argentina, etc.

### Sistema de Fallback en Cascada

Todas las traducciones usan un sistema de tres niveles:

```
es-EC → es → defaultFallback
```

**Ejemplo**: Usuario de Ecuador busca una traducción
1. Busca en archivo regional: `es-EC.json`
2. Si no existe, busca en base: `es.json`
3. Si no existe, devuelve la clave original

## Traducciones de UI

### Estructura de Archivos

```
src/i18n/locales/
├── es.json          # Base español (completo)
├── es-ES.json       # Solo diferencias para España
├── es-EC.json       # Solo diferencias para Ecuador
├── es-MX.json       # Placeholder (usa es.json)
├── es-AR.json       # Placeholder (usa es.json)
├── en.json          # Inglés completo
└── ca.json          # Catalán completo
```

### Formato de Archivos

**es.json** (archivo base - contiene TODO):
```json
{
  "app": {
    "name": "Comelo",
    "tagline": "Tu asistente de nutricion"
  },
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "back": "Volver"
  },
  "home": {
    "greeting": "Hola!",
    "subtitle": "Tu camino para comer mejor..."
  }
}
```

**es-ES.json** (solo sobrescrituras - uso de vosotros):
```json
{
  "home": {
    "subtitle": "Vuestro camino para comer mejor..."
  },
  "onboarding": {
    "allergens": {
      "title": "¿Teneis alergias?"
    }
  }
}
```

**es-EC.json** (solo sobrescrituras - vocabulario ecuatoriano):
```json
{
  "home": {
    "searchRecipes": {
      "description": "Ideas cheveres y ricas para comer mejor..."
    }
  },
  "common": {
    "back": "Regresar"
  }
}
```

### Idiomas y Regiones Soportados

| Código | Idioma/Región | Bandeira | Características |
|--------|---------------|----------|-----------------|
| `es-ES` | Español (España) | 🇪🇸 | Vosotros, vocabulario peninsular |
| `es-EC` | Español (Ecuador) | 🇪🇨 | Vocabulario ecuatoriano |
| `es-MX` | Español (México) | 🇲🇽 | Placeholder (usa base) |
| `es-AR` | Español (Argentina) | 🇦🇷 | Placeholder (usa base) |
| `en` | English | 🇬🇧 | - |
| `ca` | Català | 🇪🇸 | - |

### Uso en Componentes

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('app.name')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

## Traducciones de Datos

### Estructura de Archivos

```
src/data/translations/
├── products/
│   ├── common.es.json        # Base español (completo)
│   ├── common.es-ES.json     # Solo diferencias
│   ├── common.es-EC.json     # Solo diferencias
│   ├── common.en.json
│   └── common.ca.json
│
├── allergens/
│   ├── allergens.es.json     # Base español (completo)
│   ├── allergens.es-ES.json  # Solo diferencias
│   ├── allergens.es-EC.json  # Solo diferencias
│   ├── allergens.en.json
│   └── allergens.ca.json
│
└── recipes/
    ├── pollo-curry.es.json   # Base español
    ├── pollo-curry.es-ES.json
    ├── pollo-curry.es-EC.json
    └── pollo-curry.en.json
```

### Convención de Archivos

Todos los archivos siguen esta convención:
```
src/data/translations/{type}/{id}.{lang}.json
```

- **{type}**: Tipo de dato (products, recipes, allergens)
- **{id}**: Identificador (common, pollo-curry, allergens)
- **{lang}**: Código de idioma (es, es-ES, es-EC, en, ca)

### Formato de Productos

**common.es.json** (completo):
```json
{
  "product": {
    "broccoli": "Brócoli",
    "banana": "Plátano",
    "potato": "Patata",
    "peanuts": "Cacahuetes"
  },
  "category": {
    "vegetables": "Verduras",
    "fruits": "Frutas"
  }
}
```

**common.es-EC.json** (solo diferencias):
```json
{
  "product": {
    "potato": "Papa",
    "peanuts": "Maní"
  }
}
```

### Uso con useDataTranslation

```tsx
import { useDataTranslation } from '../hooks/useDataTranslation';
import { useState, useEffect } from 'react';

function ProductCard({ productKey }) {
  const t = useDataTranslation();
  const [name, setName] = useState('');

  useEffect(() => {
    t(`product.${productKey}`).then(setName);
  }, [t, productKey]);

  return <div>{name}</div>;
}
```

## Traducciones Regionales

### Ejemplos de Variaciones por Región

| Producto/Alérgeno | España (es-ES) | Ecuador (es-EC) | México (es-MX) |
|-------------------|----------------|-----------------|----------------|
| Peanuts | Cacahuetes | Maní | Cacahuates |
| Potato | Patata | Papa | Papa |
| Lupin | Altramuces | Chocho | Lupino |
| Corn | Maíz | Choclo | Elote |
| Popcorn | Palomitas | Canguil | Palomitas |

### Detección Automática de Región

El sistema detecta la región automáticamente desde `navigator.language`:

```typescript
// Ejemplos de detección
navigator.language = 'es-ES' → España
navigator.language = 'es-EC' → Ecuador
navigator.language = 'es' → Español genérico
```

### Sistema de Fallback Completo

```
Usuario de Ecuador busca "lupin":
1. allergens.es-EC.json → "Chocho" ✓
2. allergens.es.json → "Altramuces" (si no existe en es-EC)
3. "allergens.lupin" (si no existe en es)
```

## Selector de Idioma

El usuario puede cambiar manualmente su idioma/región después del onboarding.

### Componente LanguageModal

```tsx
import { LanguageModal } from '../components/LanguageModal';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Cambiar idioma
      </button>
      <LanguageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

### Flujo al Cambiar Idioma

Cuando el usuario cambia de idioma/región:

1. `i18n.changeLanguage(langCode)` actualiza traducciones de UI
2. `translationService.clearCache()` limpia caché de datos
3. `translationService.preloadEssentials(langCode)` precarga datos esenciales
4. Componentes se re-renderizan automáticamente

## API y Uso

### TranslationService (Datos)

El servicio usa un sistema de configuración basado en scopes que hace fácil añadir nuevos tipos de datos sin modificar lógica:

```typescript
const SCOPE_CONFIG = {
  'recipe': { type: 'recipes', idFromPath: true },
  'allergens': { type: 'allergens', id: 'allergens' },
  'product': { type: 'products', id: 'common' },
  'category': { type: 'products', id: 'common' },
  'tag': { type: 'products', id: 'common' },
  'nutrition': { type: 'products', id: 'common' },
};
```

**Configuración:**
- `type`: Carpeta en `data/translations/`
- `id`: Archivo a cargar (fijo)
- `idFromPath`: Extraer el ID del path (para recetas)

**Uso básico:**

```typescript
import { translationService } from '../services/TranslationService';

const name = await translationService.translate('product.broccoli');
const category = await translationService.translate('category.vegetables');
const allergen = await translationService.translate('allergens.lupin');
const recipe = await translationService.translate('recipe.pollo-curry.name');

translationService.clearCache();
await translationService.preloadEssentials('es-EC');
```

**Añadir nuevo scope:**

```typescript
const SCOPE_CONFIG = {
  // ... existing scopes
  'tool': { type: 'tools', id: 'kitchen-tools' },
};
```

Luego crear: `data/translations/tools/kitchen-tools.{lang}.json`

### Hook useDataTranslation (Componentes React)

```typescript
import { useDataTranslation } from '../hooks/useDataTranslation';

function MyComponent() {
  const t = useDataTranslation();
  const [name, setName] = useState('');

  useEffect(() => {
    t('product.banana').then(setName);
  }, [t]);

  return <span>{name}</span>;
}
```

### Hook useTranslation (UI)

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return <h1>{t('app.name')}</h1>;
}
```

## Añadir Nuevas Regiones

### 1. Actualizar languages.ts (si es necesario)

```typescript
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es-CL', name: 'Español (Chile)', flag: '🇨🇱' },
  // ...
];
```

### 2. Crear Archivos de UI Regional

Solo incluir traducciones que difieren:

**src/i18n/locales/es-CL.json**:
```json
{
  "common": {
    "beans": "Porotos"
  },
  "home": {
    "subtitle": "Tu camino..."
  }
}
```

### 3. Actualizar i18n/index.ts

```typescript
import esCL from './locales/es-CL.json';

i18n.init({
  resources: {
    'es-CL': { translation: { ...es, ...esCL } },
  }
});
```

### 4. Crear Archivos de Datos Regionales

Solo incluir términos que difieren:

**src/data/translations/products/common.es-CL.json**:
```json
{
  "product": {
    "potato": "Papa",
    "beans": "Porotos"
  }
}
```

**src/data/translations/allergens/allergens.es-CL.json**:
```json
{
  "peanuts": "Maní",
  "beans": "Porotos"
}
```

### 5. ¡Listo!

El sistema detectará automáticamente la región y usará los archivos correspondientes.

## Mejores Prácticas

### 1. Archivos Base Completos

```json
// ✓ CORRECTO: es.json contiene TODO
{
  "app": { "name": "Comelo", ... },
  "common": { "save": "Guardar", ... },
  "home": { ... }
}

// ✗ INCORRECTO: no dejar keys faltantes
{
  "app": { "name": "Comelo" }
}
```

### 2. Archivos Regionales Minimalistas

```json
// ✓ CORRECTO: es-ES.json solo diferencias
{
  "home": {
    "subtitle": "Vuestro camino..."
  }
}

// ✗ INCORRECTO: no duplicar todo
{
  "app": { "name": "Comelo" },
  "common": { "save": "Guardar" },
  "home": { "subtitle": "Vuestro camino..." }
}
```

### 3. Consistencia en Naming

```typescript
// ✓ CORRECTO: usar misma estructura
t('common.save')
t('common.cancel')
t('common.delete')

// ✗ INCORRECTO: estructura inconsistente
t('save')
t('common.cancel')
t('deleteButton')
```

### 4. Limpiar Caché al Cambiar Idioma

```typescript
// ✓ CORRECTO: limpiar ambos cachés
await i18n.changeLanguage('es-EC');
translationService.clearCache();
await translationService.preloadEssentials('es-EC');

// ✗ INCORRECTO: solo cambiar i18n
await i18n.changeLanguage('es-EC');
```

## Debugging

```typescript
console.log(i18n.language);

console.log(translationService.cache);

translationService.clearCache();
await translationService.preloadEssentials('es-ES');
```

## Ventajas del Sistema

| Aspecto | Beneficio |
|---------|-----------|
| **Escalabilidad** | Añadir regiones sin cambiar código |
| **Eficiencia** | Solo se cargan traducciones necesarias |
| **Mantenibilidad** | Archivos regionales pequeños con diferencias |
| **Automático** | Detección de región desde navegador |
| **Robusto** | Sistema de fallback en cascada |
| **Flexible** | Cambio manual después del onboarding |

---

**Sistema de traducciones completo con soporte regional para UI y datos, listo para escalar con nuevas regiones!**
