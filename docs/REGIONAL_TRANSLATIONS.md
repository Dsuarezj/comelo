# Sistema de Traducciones Regionales

Este documento describe cómo funciona el sistema de traducciones regionales en Comelo, que permite adaptar el vocabulario según la región del usuario (España, Ecuador, México, Argentina, etc.).

## Problema que resuelve

Diferentes regiones de habla hispana usan términos distintos para los mismos productos y alérgenos:
- **Lupin**: "altramuces" (España), "chocho" (Ecuador), "lupino" (América Latina)
- **Peanuts**: "cacahuetes" (España), "maní" (Ecuador, Argentina), "cacahuates" (México)
- **Potato**: "patata" (España), "papa" (América Latina)
- **Corn**: "maíz" (general), "choclo" (Ecuador, Argentina), "elote" (México)

## Arquitectura

### 1. Detección automática de región

El sistema detecta la región del usuario desde `navigator.language`:
- `es-ES` → España
- `es-EC` → Ecuador
- `es-MX` → México
- `es-AR` → Argentina
- `es` → Español genérico (fallback)

### 2. Sistema de fallback en cascada

Cuando se busca una traducción, el sistema intenta en orden:
1. **Archivo regional específico**: `allergens.es-EC.json`
2. **Archivo base del idioma**: `allergens.es.json`
3. **Clave original**: si no encuentra nada, devuelve la clave

Ejemplo con región `es-EC`:
```typescript
// Usuario de Ecuador busca "lupin"
translationService.translate('allergens.lupin')
// 1. Busca en allergens.es-EC.json → "Chocho" ✓
// 2. Si no existe, busca en allergens.es.json → "Altramuces"
// 3. Si no existe, devuelve "allergens.lupin"
```

### 3. Búsqueda inversa con aliases

El `SearchService` permite buscar el ID de un recurso usando términos regionales:

```typescript
// Usuario escribe "chocho"
await searchService.searchAllergen('chocho') // → "lupin"

// Usuario escribe "altramuces"
await searchService.searchAllergen('altramuces') // → "lupin"

// Usuario escribe "lupino"
await searchService.searchAllergen('lupino') // → "lupin"
```

## Estructura de archivos

```
src/data/translations/
├── allergens/
│   ├── allergens.es.json      # Base español (todos los alérgenos)
│   ├── allergens.es-ES.json   # Sobrescribe solo términos de España
│   ├── allergens.es-EC.json   # Sobrescribe solo términos de Ecuador
│   ├── allergens.es-MX.json   # Sobrescribe solo términos de México
│   ├── allergens.en.json      # Base inglés
│   ├── allergens.ca.json      # Base catalán
│   └── aliases.json           # Mapeo de búsqueda inversa
│
├── products/
│   ├── common.es.json         # Base español (todos los productos)
│   ├── common.es-ES.json      # Sobrescribe solo términos de España
│   ├── common.es-EC.json      # Sobrescribe solo términos de Ecuador
│   ├── common.es-MX.json      # Sobrescribe solo términos de México
│   └── aliases.json           # Mapeo de búsqueda inversa
│
└── recipes/
    ├── pollo-curry.es.json    # Base español
    ├── pollo-curry.es-ES.json # Términos específicos de España
    └── pollo-curry.es-EC.json # Términos específicos de Ecuador
```

## Formato de archivos

### Archivos de traducción regional

Solo incluyen las traducciones que difieren del archivo base:

**allergens.es.json** (base):
```json
{
  "gluten": "Gluten",
  "dairy": "Lácteos",
  "peanuts": "Cacahuetes",
  "lupin": "Altramuces"
}
```

**allergens.es-EC.json** (solo sobrescrituras):
```json
{
  "peanuts": "Maní",
  "lupin": "Chocho"
}
```

**allergens.es-MX.json** (solo sobrescrituras):
```json
{
  "peanuts": "Cacahuates"
}
```

### Archivo de aliases

Mapea términos de búsqueda regionales a IDs canónicos:

**allergens/aliases.json**:
```json
{
  "es": {
    "lácteos": "dairy",
    "huevos": "eggs"
  },
  "es-ES": {
    "cacahuetes": "peanuts",
    "altramuces": "lupin"
  },
  "es-EC": {
    "maní": "peanuts",
    "chocho": "lupin",
    "lupino": "lupin"
  },
  "en": {
    "milk": "dairy",
    "eggs": "eggs"
  }
}
```

## Uso en código

### TranslationService (mostrar traducciones)

```typescript
import { translationService } from '@/services/TranslationService';

const allergenName = await translationService.translate('allergens.lupin');
// España: "Altramuces"
// Ecuador: "Chocho"
// México: "Altramuces" (usa base)
```

### SearchService (búsqueda inversa)

```typescript
import { searchService } from '@/services/SearchService';

const allergenId = await searchService.searchAllergen('chocho');
// → "lupin"

const productId = await searchService.searchProduct('papa');
// → "potato"

const name = await translationService.translate(`allergens.${allergenId}`);
// Ecuador: "Chocho"
// España: "Altramuces"
```

### Uso en componentes

```tsx
import { searchService } from '@/services/SearchService';
import { translationService } from '@/services/TranslationService';

function AllergenSearch() {
  const handleSearch = async (searchTerm: string) => {
    const allergenId = await searchService.searchAllergen(searchTerm);

    if (allergenId) {
      const displayName = await translationService.translate(`allergens.${allergenId}`);
      console.log(`Found: ${displayName}`);
    }
  };

  return (
    <input
      type="text"
      placeholder="Buscar alérgeno..."
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

## Añadir nueva región

Para añadir soporte para una nueva región (ej: Chile `es-CL`):

### 1. Crear archivos de traducción regional

Solo incluir términos que difieren:

**allergens.es-CL.json**:
```json
{
  "peanuts": "Maní",
  "beans": "Porotos"
}
```

**products/common.es-CL.json**:
```json
{
  "vegetables": {
    "potato": "Papa",
    "beans": "Porotos"
  }
}
```

### 2. Añadir aliases de búsqueda

**allergens/aliases.json**:
```json
{
  "es-CL": {
    "maní": "peanuts",
    "porotos": "beans"
  }
}
```

**products/aliases.json**:
```json
{
  "es-CL": {
    "papa": "potato",
    "porotos": "beans"
  }
}
```

### 3. ¡Listo!

No se requieren cambios en el código. El sistema detectará automáticamente la región y usará los archivos correspondientes.

## Regiones soportadas actualmente

| Región | Código | Ejemplos de términos |
|--------|--------|---------------------|
| España | `es-ES` | cacahuetes, patata, altramuces, judías |
| Ecuador | `es-EC` | maní, papa, chocho, fréjol, choclo, canguil |
| México | `es-MX` | cacahuates, jitomate, elote, frijol |
| Argentina | `es-AR` | maní, papa, poroto, choclo |
| Inglés | `en` | peanuts, potato, lupin, beans |
| Catalán | `ca` | cacauets, patata, tramús |

## Ventajas del sistema

1. **Escalable**: añadir nuevas regiones no requiere cambios de código
2. **Eficiente**: solo se cargan las traducciones necesarias
3. **Mantenible**: archivos regionales pequeños con solo diferencias
4. **Automático**: detección de región desde el navegador
5. **Robusto**: sistema de fallback en cascada
6. **Flexible**: búsqueda inversa con múltiples alias por término

## Mejores prácticas

### 1. Archivo base completo

El archivo base debe contener TODOS los términos:
```json
// ✓ CORRECTO: allergens.es.json contiene todos los alérgenos
{
  "gluten": "Gluten",
  "dairy": "Lácteos",
  "peanuts": "Cacahuetes",
  "lupin": "Altramuces",
  ...
}
```

### 2. Archivos regionales minimalistas

Los archivos regionales solo sobrescriben lo necesario:
```json
// ✓ CORRECTO: allergens.es-EC.json solo términos diferentes
{
  "peanuts": "Maní",
  "lupin": "Chocho"
}

// ✗ INCORRECTO: no duplicar todo
{
  "gluten": "Gluten",
  "dairy": "Lácteos",
  "peanuts": "Maní",
  ...
}
```

### 3. Normalización en aliases

Incluir variantes comunes en aliases:
```json
{
  "es-EC": {
    "maní": "peanuts",
    "mani": "peanuts",    // sin tilde
    "chocho": "lupin",
    "lupino": "lupin",     // variante
    "tarwi": "lupin"       // nombre alternativo
  }
}
```

### 4. Aliases bidireccionales

Añadir términos en ambas direcciones cuando sea útil:
```json
{
  "es": {
    "lácteos": "dairy",
    "lacteos": "dairy",    // sin tilde
    "leche": "dairy"       // término relacionado
  }
}
```

## Testing

El sistema se puede probar cambiando el idioma manualmente:

```typescript
import i18n from '@/i18n';

i18n.changeLanguage('es-EC');
const name = await translationService.translate('allergens.lupin');
// → "Chocho"

i18n.changeLanguage('es-ES');
const name = await translationService.translate('allergens.lupin');
// → "Altramuces"
```

## Caché y rendimiento

- Ambos servicios mantienen caché en memoria
- Las traducciones se cargan bajo demanda
- El método `preloadEssentials()` precarga datos críticos
- Para limpiar caché: `translationService.clearCache()` y `searchService.clearCache()`
