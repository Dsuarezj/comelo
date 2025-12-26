# Sistema de Traducciones

Sistema completo de traducciones que separa UI y datos, con soporte para variaciones regionales.

## Contenido

1. [Arquitectura](#arquitectura)
2. [Traducciones de UI (i18n)](#traducciones-de-ui-i18n)
3. [Traducciones de Datos (TranslationService)](#traducciones-de-datos-translationservice)
4. [Variaciones Regionales](#variaciones-regionales)
5. [Uso en Componentes](#uso-en-componentes)
6. [Añadir Nuevas Traducciones](#añadir-nuevas-traducciones)

## Arquitectura

### Dos Sistemas Complementarios

| Sistema | Ubicación | Uso | Herramienta |
|---------|-----------|-----|-------------|
| **i18n** | `src/i18n/locales/` | Traducciones de UI: botones, mensajes, interfaz | `useTranslation()` |
| **TranslationService** | `src/data/translations/` | Traducciones de datos: productos, recetas, alérgenos | `useDataTranslation()` |

### Sistema de Fallback en Cascada

Ambos sistemas usan fallback de tres niveles:

```
es-EC → es → clave original
```

**Ejemplo**: Usuario de Ecuador busca una traducción
1. Busca en archivo regional: `es-EC.json`
2. Si no existe, busca en base: `es.json`
3. Si no existe, devuelve la clave original

## Traducciones de UI (i18n)

### Estructura de Archivos

```
src/i18n/locales/
├── es.json          # Base español (completo)
├── es-ES.json       # Solo diferencias para España
├── es-EC.json       # Solo diferencias para Ecuador
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
  }
}
```

**es-ES.json** (solo sobrescrituras):
```json
{
  "home": {
    "subtitle": "Vuestro camino para comer mejor..."
  }
}
```

**es-EC.json** (solo sobrescrituras):
```json
{
  "common": {
    "back": "Regresar"
  }
}
```

### Cómo Funciona i18n

El sistema i18n carga automáticamente archivos base y regionales, combinándolos:

```typescript
resources: {
  'es-EC': { translation: { ...es, ...esEC } }
}
```

Esto permite que:
- `t('common.save')` → use `es.json` (base)
- `t('common.back')` → use `es-EC.json` (regional override)

## Traducciones de Datos (TranslationService)

### Estructura de Archivos

```
src/data/translations/
├── products/
│   ├── common.es.json
│   ├── common.es-ES.json
│   └── common.en.json
│
├── allergens/
│   ├── common.es.json
│   ├── common.es-ES.json
│   └── common.en.json
│
└── recipes/
    ├── pollo-curry.es.json
    ├── pollo-curry.es-ES.json
    └── pollo-curry.en.json
```

### Convención de Nombres

**Regla general**: `{scope}s/common.{lang}.json`

| Scope | Archivo | Ejemplo |
|-------|---------|---------|
| `product` | `products/common.{lang}.json` | products/common.es.json |
| `allergen` | `allergens/common.{lang}.json` | allergens/common.es.json |
| `category` | `products/common.{lang}.json` | products/common.es.json |
| `tag` | `products/common.{lang}.json` | products/common.es.json |
| `nutrition` | `products/common.{lang}.json` | products/common.es.json |

**Excepción**: `recipe` usa ID dinámico del path
- `recipe.pollo-curry.name` → `recipes/pollo-curry.{lang}.json`

### Formato de Archivos de Datos

**products/common.es.json** (completo):
```json
{
  "product": {
    "broccoli": "Brócoli",
    "banana": "Plátano",
    "potato": "Patata"
  },
  "category": {
    "vegetables": "Verduras",
    "fruits": "Frutas"
  }
}
```

**products/common.es-EC.json** (solo diferencias):
```json
{
  "product": {
    "potato": "Papa"
  }
}
```

**allergens/common.es.json**:
```json
{
  "allergen": {
    "gluten": "Gluten",
    "nuts": "Frutos secos",
    "peanuts": "Cacahuetes"
  }
}
```

**allergens/common.es-EC.json**:
```json
{
  "allergen": {
    "peanuts": "Maní"
  }
}
```

### Cómo Funciona TranslationService

El servicio usa convención sobre configuración:

```typescript
const SCOPES_WITH_DYNAMIC_ID = ['recipe'];

private resolveTranslationFile(scope: string, rest: string[]): { type: string; id: string } {
  const type = `${scope}s`;

  if (SCOPES_WITH_DYNAMIC_ID.includes(scope)) {
    return { type, id: rest[0] };
  }

  return { type, id: 'common' };
}
```

**Flujo de traducción**:

1. `translate('product.broccoli')`
2. Split: `['product', 'broccoli']`
3. Resolve: `{ type: 'products', id: 'common' }`
4. Load: `products/common.{lang}.json` con fallback
5. Navigate: `translations.product.broccoli`
6. Return: `"Brócoli"`

## Variaciones Regionales

### Idiomas y Regiones Soportados

| Código | Idioma/Región | Bandera |
|--------|---------------|---------|
| `es` | Español (genérico) | 🌐 |
| `es-ES` | Español (España) | 🇪🇸 |
| `es-EC` | Español (Ecuador) | 🇪🇨 |
| `en` | English | 🇬🇧 |
| `ca` | Català | 🇪🇸 |

### Ejemplos de Variaciones

| Producto/Alérgeno | es (base) | es-ES | es-EC |
|-------------------|-----------|-------|-------|
| Peanuts | Cacahuetes | Cacahuetes | Maní |
| Potato | Patata | Patata | Papa |
| Popcorn | Palomitas | Palomitas | Canguil |

### Detección Automática

El sistema detecta la región desde:
1. `localStorage.getItem('comelo_language')` (preferencia guardada)
2. `navigator.language` (idioma del navegador)
3. `i18n.language` (idioma actual de i18n)

```typescript
navigator.language = 'es-ES' → España
navigator.language = 'es-EC' → Ecuador
navigator.language = 'es' → Español genérico
```

## Uso en Componentes

### Traducciones de UI

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

### Traducciones de Datos

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

### Cambiar Idioma

```tsx
import { useTranslation } from 'react-i18next';
import { translationService } from '../services/TranslationService';

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    translationService.clearCache();
    await translationService.preloadEssentials(langCode);
  };

  return (
    <select onChange={(e) => changeLanguage(e.target.value)}>
      <option value="es">Español</option>
      <option value="es-ES">Español (España)</option>
      <option value="es-EC">Español (Ecuador)</option>
      <option value="en">English</option>
    </select>
  );
}
```

## Añadir Nuevas Traducciones

### Añadir Nuevo Scope de Datos (común)

La mayoría de scopes usan `common.json` automáticamente:

1. Crear archivos de traducción:
```
src/data/translations/tools/
├── common.es.json
├── common.es-ES.json
└── common.en.json
```

2. ¡Listo! Usar directamente:
```typescript
await t('tool.whisk')
```

### Añadir Scope con ID Dinámico

Si necesitas IDs dinámicos (como recetas):

1. Añadir a la lista de excepciones:
```typescript
const SCOPES_WITH_DYNAMIC_ID = ['recipe', 'tutorial'];
```

2. Crear archivos con IDs específicos:
```
src/data/translations/tutorials/
├── beginner-guide.es.json
└── beginner-guide.en.json
```

3. Usar con ID en el path:
```typescript
await t('tutorial.beginner-guide.title')
```

### Añadir Nueva Región

**1. Actualizar `src/i18n/languages.ts`**:
```typescript
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es-CL', name: 'Español (Chile)', flag: '🇨🇱' },
];
```

**2. Crear archivos de UI regional** (solo diferencias):
```json
// src/i18n/locales/es-CL.json
{
  "common": {
    "beans": "Porotos"
  }
}
```

**3. Actualizar `src/i18n/index.ts`**:
```typescript
import esCL from './locales/es-CL.json';

i18n.init({
  resources: {
    'es-CL': { translation: { ...es, ...esCL } },
  }
});
```

**4. Crear archivos de datos regionales** (solo diferencias):
```json
// src/data/translations/products/common.es-CL.json
{
  "product": {
    "beans": "Porotos"
  }
}
```

**5. ¡Listo!** El sistema detectará automáticamente la región.

## Mejores Prácticas

### 1. Archivos Base Completos

```json
// ✓ CORRECTO: es.json contiene TODO
{
  "app": { "name": "Comelo" },
  "common": { "save": "Guardar", "cancel": "Cancelar" }
}
```

### 2. Archivos Regionales Minimalistas

```json
// ✓ CORRECTO: es-ES.json solo diferencias
{
  "home": { "subtitle": "Vuestro camino..." }
}

// ✗ INCORRECTO: no duplicar todo
{
  "app": { "name": "Comelo" },
  "common": { "save": "Guardar" },
  "home": { "subtitle": "Vuestro camino..." }
}
```

### 3. Limpiar Caché al Cambiar Idioma

```typescript
// ✓ CORRECTO
await i18n.changeLanguage('es-EC');
translationService.clearCache();
await translationService.preloadEssentials('es-EC');

// ✗ INCORRECTO
await i18n.changeLanguage('es-EC');
```

### 4. Usar Convención de Nombres

```typescript
// ✓ CORRECTO: usar convenciones consistentes
t('common.save')
t('common.cancel')
t('product.broccoli')

// ✗ INCORRECTO: nombres inconsistentes
t('save')
t('common.cancel')
t('productBroccoli')
```

## API Reference

### TranslationService

```typescript
import { translationService } from '../services/TranslationService';

await translationService.translate('product.broccoli');

await translationService.translate('recipe.pollo-curry.name');

translationService.clearCache();

await translationService.preloadEssentials('es-EC');
```

### useDataTranslation Hook

```typescript
import { useDataTranslation } from '../hooks/useDataTranslation';

function Component() {
  const t = useDataTranslation();

  useEffect(() => {
    t('product.banana').then(setName);
  }, [t]);
}
```

### useTranslation Hook (i18n)

```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t, i18n } = useTranslation();

  return <h1>{t('app.name')}</h1>;
}
```

## Ventajas del Sistema

| Aspecto | Beneficio |
|---------|-----------|
| **Escalabilidad** | Añadir regiones/scopes sin cambiar código |
| **Eficiencia** | Solo cargas lo necesario |
| **Mantenibilidad** | Archivos regionales pequeños |
| **Automático** | Detección desde navegador |
| **Robusto** | Fallback en cascada |
| **Convención** | Mayoría de casos usan `common.json` automáticamente |

---

**Sistema completo con soporte regional, listo para escalar con nuevas regiones y tipos de datos.**
