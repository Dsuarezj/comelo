# 📊 Resumen Visual - Arquitectura de Datos

Comparación y ventajas de la nueva estructura.

## 📁 Organización de Archivos

```
src/data/
├── 📗 recipes/                      [Recetas - Solo Datos]
│   ├── bowl-amaranto-frutas.json   3.6 KB
│   ├── ensalada-quinoa.json        (futuro)
│   └── pollo-curry.json            (futuro)
│
├── 🥦 products/                     [Productos por Categoría]
│   ├── vegetables.json             4.5 KB  (brócoli, espinaca, etc.)
│   ├── fruits.json                 5.4 KB  (plátano, fresas, etc.)
│   ├── grains.json                 2.2 KB  (amaranto, quinoa, etc.)
│   └── others.json                 8.6 KB  (miel, yogur, nueces, etc.)
│
└── 🌍 translations/                 [Traducciones Separadas]
    ├── recipes/
    │   ├── bowl-amaranto-frutas.es.json  3.8 KB
    │   ├── bowl-amaranto-frutas.en.json  3.4 KB
    │   └── bowl-amaranto-frutas.ca.json  (futuro)
    └── products/
        ├── common.es.json          2.8 KB
        ├── common.en.json          2.6 KB
        └── common.ca.json          (futuro)
```

## 🎯 Comparación: Antes vs Después

### ❌ Estructura Antigua (Monolítica)

```json
{
  "id": "bowl-amaranto-frutas",
  "translations": {
    "es": {
      "title": "...",
      "description": "...",
      "steps": [ ... 10 pasos ... ],
      "history": [ ... ]
    },
    "en": {
      "title": "...",
      "description": "...",
      "steps": [ ... 10 pasos ... ],
      "history": [ ... ]
    },
    "ca": {
      "title": "...",
      "description": "...",
      "steps": [ ... 10 pasos ... ],
      "history": [ ... ]
    }
  },
  "ingredients": [
    {
      "name": {
        "es": "amaranto",
        "en": "amaranth",
        "ca": "amarant"
      },
      "quantity": 200
    }
  ]
}
```

**Problemas:**
- ❌ Archivo de 50 KB por receta
- ❌ Usuario descarga 3 idiomas aunque solo use 1
- ❌ 100 recetas = 5 MB de carga inicial
- ❌ No escalable

### ✅ Estructura Nueva (Separada)

**Receta (datos):**
```json
{
  "id": "bowl-amaranto-frutas",
  "nameKey": "recipe.bowl-amaranto-frutas.name",
  "descriptionKey": "recipe.bowl-amaranto-frutas.description",
  "stepsKeys": [
    "recipe.bowl-amaranto-frutas.step1",
    "recipe.bowl-amaranto-frutas.step2"
  ],
  "ingredients": [
    {
      "productId": "amaranth_031",
      "quantity": 200,
      "unit": "g"
    }
  ]
}
```

**Traducción ES:**
```json
{
  "recipe": {
    "bowl-amaranto-frutas": {
      "name": "Bowl de Amaranto con Frutas",
      "description": "Un desayuno nutritivo...",
      "step1": { "title": "...", "description": "..." },
      "step2": { "title": "...", "description": "..." }
    }
  }
}
```

**Ventajas:**
- ✅ Receta: 3.6 KB (solo datos)
- ✅ Traducción ES: 3.8 KB (solo español)
- ✅ Usuario descarga 1 solo idioma
- ✅ Carga inicial: 45 KB (productos comunes)
- ✅ Lazy loading: 7.4 KB por receta
- ✅ 100 recetas = 45 KB inicial + carga bajo demanda

## 📊 Tamaño de Archivos

| Tipo | Archivo | Tamaño | Contenido |
|------|---------|---------|-----------|
| Receta (datos) | `bowl-amaranto-frutas.json` | **3.6 KB** | Estructura, ingredientes, nutrición |
| Traducción ES | `bowl-amaranto-frutas.es.json` | **3.8 KB** | Textos en español |
| Traducción EN | `bowl-amaranto-frutas.en.json` | **3.4 KB** | Textos en inglés |
| Productos | `vegetables.json` | **4.5 KB** | 2 verduras con nutrición |
| Productos | `fruits.json` | **5.4 KB** | 3 frutas con nutrición |
| Productos | `grains.json` | **2.2 KB** | 1 grano con nutrición |
| Productos | `others.json` | **8.6 KB** | 5 productos varios |
| Traducciones Comunes ES | `common.es.json` | **2.8 KB** | Nombres, categorías, nutrición |
| Traducciones Comunes EN | `common.en.json` | **2.6 KB** | Nombres, categorías, nutrición |

**Total Carga Inicial (ES):**
```
vegetables.json      4.5 KB
fruits.json          5.4 KB
grains.json          2.2 KB
others.json          8.6 KB
common.es.json       2.8 KB
─────────────────────────
TOTAL               23.5 KB ✨
```

**Por Receta (bajo demanda):**
```
bowl-amaranto.json      3.6 KB
bowl-amaranto.es.json   3.8 KB
─────────────────────────────
TOTAL                   7.4 KB ✨
```

## 🚀 Flujo de Carga

```
Usuario abre app (idioma: ES)
         │
         ▼
   [Detectar idioma] ──► ES
         │
         ▼
   [Cargar productos base]
         │
         ├──► vegetables.json  (4.5 KB)
         ├──► fruits.json      (5.4 KB)
         ├──► grains.json      (2.2 KB)
         ├──► others.json      (8.6 KB)
         └──► common.es.json   (2.8 KB)
         │
         ▼
   [Total: 23.5 KB] ✅
         │
         ▼
   ┌───────────────────────────┐
   │  App lista para usar      │
   │  - Ver productos          │
   │  - Crear listas           │
   │  - Buscar recetas         │
   └───────────────────────────┘
         │
         ▼
   Usuario abre receta específica
         │
         ▼
   [Lazy load receta]
         │
         ├──► bowl-amaranto.json    (3.6 KB)
         └──► bowl-amaranto.es.json (3.8 KB)
         │
         ▼
   [Total: 7.4 KB] ✅
         │
         ▼
   [Guardar en IndexedDB cache]
         │
         ▼
   ┌───────────────────────────┐
   │  Receta disponible        │
   │  - Ver pasos              │
   │  - Ver ingredientes       │
   │  - Ver nutrición          │
   └───────────────────────────┘
```

## 🔑 Sistema de Claves

### Productos

```typescript
// En JSON de producto
{
  "nameKey": "product.broccoli",
  "categoryKey": "category.vegetables",
  "nutrition": {
    "protein": {
      "descriptionKey": "nutrition.excellent-protein"
    }
  }
}

// En archivo de traducción
{
  "product": {
    "broccoli": "Brócoli"  // ← Traducción
  },
  "category": {
    "vegetables": "Verduras"  // ← Traducción
  },
  "nutrition": {
    "excellent-protein": "Excelente fuente de proteína"  // ← Traducción
  }
}
```

### Recetas

```typescript
// En JSON de receta
{
  "nameKey": "recipe.bowl-amaranto-frutas.name",
  "stepsKeys": [
    "recipe.bowl-amaranto-frutas.step1",
    "recipe.bowl-amaranto-frutas.step2"
  ]
}

// En archivo de traducción
{
  "recipe": {
    "bowl-amaranto-frutas": {
      "name": "Bowl de Amaranto con Frutas",  // ← Traducción
      "step1": {
        "title": "Enjuagar el amaranto",      // ← Traducción
        "description": "Medir 1 taza..."      // ← Traducción
      }
    }
  }
}
```

## 📈 Escalabilidad

### Agregando 100 Recetas

**Estructura Antigua:**
```
100 recetas × 50 KB = 5 MB carga inicial ❌
```

**Estructura Nueva:**
```
Carga inicial:    23.5 KB (productos comunes) ✅
Por receta:        7.4 KB (solo cuando la abren) ✅

Usuario abre 10 recetas:
23.5 KB + (10 × 7.4 KB) = 97.5 KB total ✅

5 MB vs 97.5 KB = 98% menos datos ✨
```

### Agregando Nuevo Idioma (Catalán)

**Estructura Antigua:**
```
Modificar TODAS las 100 recetas
Agregar sección "ca" a cada una
Aumentar cada archivo en 33%
```

**Estructura Nueva:**
```
1. Crear common.ca.json (2.8 KB)
2. Crear bowl-amaranto.ca.json (3.8 KB)
3. ... (uno por receta)

Sin modificar archivos de datos ✅
```

## 🎯 Ventajas Clave

| Característica | Antes | Después |
|----------------|-------|---------|
| Carga inicial | 5 MB | 23.5 KB |
| Reducción | - | **99.5%** ✨ |
| Por receta | 50 KB | 7.4 KB |
| Reducción | - | **85%** ✨ |
| Idiomas descargados | 3 | 1 |
| Manejabilidad | ❌ Difícil | ✅ Fácil |
| Escalabilidad | ❌ Mala | ✅ Excelente |
| Agregar idioma | ❌ Modificar todo | ✅ Solo traducciones |

## 🛠️ Para Desarrolladores

### Crear Nueva Receta

```bash
# 1. Copiar template
cp src/data/recipes/_template.json src/data/recipes/mi-receta.json

# 2. Editar datos (sin traducciones)
vim src/data/recipes/mi-receta.json

# 3. Crear traducciones
cp src/data/translations/recipes/_template.es.json \
   src/data/translations/recipes/mi-receta.es.json

vim src/data/translations/recipes/mi-receta.es.json
```

### Agregar Producto

```bash
# 1. Elegir categoría (vegetables, fruits, grains, others)

# 2. Editar archivo de categoría
vim src/data/products/vegetables.json

# 3. Agregar traducción
vim src/data/translations/products/common.es.json
vim src/data/translations/products/common.en.json
```

---

**🎯 Nueva arquitectura: Ligera, escalable y mantenible!**
