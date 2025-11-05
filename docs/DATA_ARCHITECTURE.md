# 📊 Arquitectura de Datos - Comelo.app

Estructura optimizada y escalable para recetas, productos y traducciones.

## 🎯 Objetivos de la Arquitectura

1. **Separación de Datos y Traducciones**: Evitar duplicación y facilitar internacionalización
2. **Archivos Manejables**: JSON pequeños y organizados por categoría
3. **Descarga Bajo Demanda**: Usuario solo descarga el idioma que necesita
4. **Escalabilidad**: Agregar recetas/productos sin crecer exponencialmente
5. **Tipado Fuerte**: TypeScript + Zod para validación

## 📁 Estructura de Carpetas

```
src/data/
├── recipes/                          # 🍳 Recetas (solo datos)
│   ├── bowl-amaranto-frutas.json
│   ├── ensalada-quinoa.json
│   └── ... (una receta por archivo)
│
├── products/                         # 🥦 Productos (solo datos)
│   ├── vegetables.json               # Todas las verduras
│   ├── fruits.json                   # Todas las frutas
│   ├── grains.json                   # Granos y cereales
│   ├── others.json                   # Otros (miel, yogur, etc.)
│   └── ... (por categoría)
│
└── translations/                     # 🌍 Traducciones separadas
    ├── recipes/
    │   ├── bowl-amaranto-frutas.es.json
    │   ├── bowl-amaranto-frutas.en.json
    │   ├── bowl-amaranto-frutas.ca.json
    │   └── ...
    └── products/
        ├── common.es.json            # Nombres comunes, categorías
        ├── common.en.json
        ├── common.ca.json
        └── ...
```

## 🍳 Estructura de Receta

### Archivo de Datos: `recipes/bowl-amaranto-frutas.json`

```json
{
  "id": "bowl-amaranto-frutas",
  "nameKey": "recipe.bowl-amaranto-frutas.name",
  "descriptionKey": "recipe.bowl-amaranto-frutas.description",
  "categoryKey": "category.breakfast",
  "tags": ["tag.high-protein", "tag.high-fiber"],
  "difficulty": "easy",
  "prepTime": 15,
  "cookTime": 25,
  "totalTime": 40,
  "servings": 2,
  "rating": 4.8,
  "featuredImage": "https://...",
  "toolsKeys": [
    "tool.medium-pot",
    "tool.fine-strainer"
  ],
  "stepsKeys": [
    "recipe.bowl-amaranto-frutas.step1",
    "recipe.bowl-amaranto-frutas.step2"
  ],
  "nutrition": {
    "calories": {
      "total": 285,
      "fromCarbs": 180,
      "fromProtein": 48,
      "fromFat": 72,
      "descriptionKey": "nutrition.moderate-calories"
    },
    "protein": {
      "total": 12,
      "dailyPercentage": 24,
      "healthRanking": 9,
      "descriptionKey": "nutrition.excellent-protein"
    }
  },
  "ingredients": [
    {
      "productId": "amaranth_031",
      "quantity": 200,
      "unit": "g"
    },
    {
      "productId": "banana_010",
      "quantity": 120,
      "unit": "g"
    }
  ]
}
```

### Archivo de Traducción: `translations/recipes/bowl-amaranto-frutas.es.json`

```json
{
  "recipe": {
    "bowl-amaranto-frutas": {
      "name": "Bowl de Amaranto con Frutas",
      "description": "Un desayuno nutritivo...",
      "step1": {
        "title": "Enjuagar el amaranto",
        "description": "Medir 1 taza...",
        "time": "3 minutos",
        "tip": "Este paso elimina..."
      },
      "step2": {
        "title": "Hervir agua",
        "description": "En una olla...",
        "time": "5 minutos"
      }
    }
  }
}
```

## 🥦 Estructura de Producto

### Archivo de Datos: `products/vegetables.json`

```json
[
  {
    "id": "broccoli_001",
    "nameKey": "product.broccoli",
    "categoryKey": "category.vegetables",
    "image": "https://...",
    "rating": 9.2,
    "seasonalityMonths": [1, 2, 3, 10, 11, 12],
    "shelfLife": {
      "days": 7,
      "storage": "storage.refrigerated"
    },
    "nutrition": {
      "servingSize": 100,
      "servingUnit": "g",
      "protein": {
        "total": 2.8,
        "caloriesFrom": 11.2,
        "dailyPercentage": 6,
        "healthRanking": 8,
        "descriptionKey": "nutrition.excellent-protein"
      },
      "calories": {
        "total": 34,
        "fromCarbs": 26.4,
        "fromProtein": 11.2,
        "fromFat": 3.6,
        "descriptionKey": "nutrition.very-low-calories"
      },
      "vitamins": {
        "vitamin_c": {
          "amount": 89.2,
          "unit": "mg",
          "dailyPercentage": 149
        }
      },
      "minerals": {
        "calcium": {
          "amount": 47,
          "unit": "mg",
          "dailyPercentage": 5
        }
      }
    }
  }
]
```

### Archivo de Traducción: `translations/products/common.es.json`

```json
{
  "product": {
    "broccoli": "Brócoli",
    "spinach": "Espinaca",
    "banana": "Plátano"
  },
  "category": {
    "vegetables": "Verduras",
    "fruits": "Frutas",
    "grains": "Granos y Cereales"
  },
  "storage": {
    "refrigerated": "Refrigerado",
    "room-temperature": "Temperatura ambiente"
  },
  "nutrition": {
    "excellent-protein": "Excelente fuente de proteína",
    "very-low-calories": "Muy bajo en calorías"
  }
}
```

## 🔑 Sistema de Claves (Keys)

### Convenciones de Nomenclatura

```typescript
// Productos
"product.{product-name}"          // product.broccoli
"category.{category-name}"        // category.vegetables
"storage.{storage-type}"          // storage.refrigerated

// Recetas
"recipe.{recipe-id}.name"         // recipe.bowl-amaranto-frutas.name
"recipe.{recipe-id}.description"  // recipe.bowl-amaranto-frutas.description
"recipe.{recipe-id}.step{N}"      // recipe.bowl-amaranto-frutas.step1

// Nutrición (compartido)
"nutrition.{description}"         // nutrition.excellent-protein

// Herramientas
"tool.{tool-name}"               // tool.medium-pot

// Tags
"tag.{tag-name}"                 // tag.high-protein

// SEO
"seo.{keyword}"                  // seo.amaranth-bowl
```

## 📥 Estrategia de Carga de Datos

### 1. Carga Inicial (Obligatoria)

```typescript
// Al iniciar la app, cargar:
const userLanguage = detectLanguage(); // 'es', 'en', 'ca'

// 1. Traducciones de productos comunes (pequeño, ~10KB)
const productTranslations = await import(
  `./data/translations/products/common.${userLanguage}.json`
);

// 2. Todos los productos (organizados por categoría)
const vegetables = await import('./data/products/vegetables.json');
const fruits = await import('./data/products/fruits.json');
```

### 2. Carga Bajo Demanda (Lazy Loading)

```typescript
// Cuando el usuario abre una receta específica:
async function loadRecipe(recipeId: string, language: string) {
  // 1. Cargar datos de receta (sin traducciones)
  const recipeData = await import(`./data/recipes/${recipeId}.json`);

  // 2. Cargar traducciones solo de esa receta
  const recipeTranslations = await import(
    `./data/translations/recipes/${recipeId}.${language}.json`
  );

  return { ...recipeData, translations: recipeTranslations };
}
```

### 3. Caché en IndexedDB

```typescript
// Guardar en IndexedDB para acceso offline
await sessionService.setCache(
  `recipe_${recipeId}_${language}`,
  mergedRecipeData,
  TTL_1_WEEK
);
```

## 🌍 Agregar Nuevo Idioma

```bash
# 1. Crear traducciones de productos
touch src/data/translations/products/common.fr.json

# 2. Crear traducciones de recetas
touch src/data/translations/recipes/bowl-amaranto-frutas.fr.json

# 3. Actualizar i18n config
# src/i18n/index.ts - agregar 'fr' a supportedLanguages
```

## 📊 Ventajas de Esta Arquitectura

### ✅ Antes (Monolítico)

```
bowl-amaranto-frutas.json: 50 KB
├── datos: 5 KB
└── traducciones (es + en + ca): 45 KB

100 recetas × 50 KB = 5 MB inicial
```

### ✅ Después (Separado)

```
Carga inicial:
├── common.es.json: 10 KB (productos)
├── vegetables.json: 15 KB
├── fruits.json: 12 KB
└── grains.json: 8 KB
Total inicial: 45 KB ✨

Por receta (bajo demanda):
├── bowl-amaranto-frutas.json: 5 KB
└── bowl-amaranto-frutas.es.json: 15 KB
Total por receta: 20 KB ✨
```

**Ahorro:**
- Carga inicial: **99% menos** (45 KB vs 5 MB)
- Por receta: **60% menos** (20 KB vs 50 KB)

## 🔍 Búsqueda y Filtrado

### Búsqueda por Ingredientes

```typescript
// Buscar recetas que contengan "broccoli"
const recipesWithBroccoli = recipes.filter(recipe =>
  recipe.ingredients.some(ing => ing.productId.startsWith('broccoli'))
);
```

### Filtrado por Nutrición

```typescript
// Recetas altas en proteína (>15g por porción)
const highProtein = recipes.filter(recipe =>
  recipe.nutrition.protein.total > 15
);
```

### Búsqueda por Tags

```typescript
// Recetas vegetarianas altas en fibra
const filtered = recipes.filter(recipe =>
  recipe.tags.includes('tag.vegetarian') &&
  recipe.tags.includes('tag.high-fiber')
);
```

## 📝 Agregar Nueva Receta

```bash
# 1. Crear archivo de datos
touch src/data/recipes/nueva-receta.json

# 2. Crear traducciones
touch src/data/translations/recipes/nueva-receta.es.json
touch src/data/translations/recipes/nueva-receta.en.json

# 3. Agregar productos necesarios (si no existen)
# Editar src/data/products/{category}.json

# 4. Agregar traducciones de productos nuevos
# Editar src/data/translations/products/common.{lang}.json
```

## 📝 Agregar Nuevo Producto

```bash
# 1. Decidir categoría (vegetables, fruits, grains, others)
# 2. Editar archivo correspondiente
vim src/data/products/vegetables.json

# 3. Agregar traducción
vim src/data/translations/products/common.es.json
vim src/data/translations/products/common.en.json
```

## 🔄 Migración desde Estructura Antigua

```typescript
// Script de migración
async function migrateRecipe(oldRecipe: OldRecipe) {
  // 1. Separar datos de traducciones
  const recipeData = {
    id: oldRecipe.id,
    nameKey: `recipe.${oldRecipe.id}.name`,
    // ... rest of data without translations
  };

  // 2. Crear archivos de traducción por idioma
  const translations = {
    es: extractSpanishTranslations(oldRecipe),
    en: extractEnglishTranslations(oldRecipe),
  };

  // 3. Guardar archivos
  await saveJSON(`recipes/${oldRecipe.id}.json`, recipeData);
  await saveJSON(`translations/recipes/${oldRecipe.id}.es.json`, translations.es);
  await saveJSON(`translations/recipes/${oldRecipe.id}.en.json`, translations.en);
}
```

## 🎨 TypeScript Types

```typescript
// src/types/data.ts
export interface Recipe {
  id: string;
  nameKey: string;
  descriptionKey: string;
  categoryKey: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  rating: number;
  featuredImage: string;
  toolsKeys: string[];
  stepsKeys: string[];
  historyKeys?: string[];
  references?: string[];
  nutrition: NutritionData;
  seo: RecipeSEO;
  ingredients: RecipeIngredient[];
}

export interface Product {
  id: string;
  nameKey: string;
  categoryKey: string;
  image: string;
  rating: number;
  seasonalityMonths: number[];
  shelfLife: ShelfLife;
  nutrition: ProductNutrition;
}

export interface RecipeIngredient {
  productId: string;
  quantity: number;
  unit: string;
  notes?: string;
  optional?: boolean;
}

export interface NutritionMacro {
  total: number;
  caloriesFrom: number;
  dailyPercentage: number;
  healthRanking: number; // 1-10
  descriptionKey: string;
}
```

## 📚 Recursos Adicionales

- [INDEXEDDB_EXPLAINED.md](./INDEXEDDB_EXPLAINED.md) - Cómo cachear datos
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Componentes para mostrar datos
- [i18next Documentation](https://www.i18next.com/) - Sistema de traducción

---

**🎯 Arquitectura optimizada para escalabilidad y rendimiento!**
