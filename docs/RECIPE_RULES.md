# 📝 Reglas para Agregar Nuevas Recetas

Guía completa para mantener consistencia al agregar recetas al proyecto.

## 🎯 Proceso Completo

### 1. **Verificar Productos Necesarios**

Antes de crear la receta, asegúrate de que todos los productos existen:

```bash
# Buscar en archivos de productos
grep -r "chicken_breast" src/data/products/
```

Si **NO existe el producto**:
1. Agregarlo al archivo de categoría correspondiente (vegetables.json, fruits.json, proteins.json, etc.)
2. Agregar traducciones en `common.{lang}.json`

### 2. **Crear Archivo de Receta (Solo Datos)**

**Ubicación:** `src/data/recipes/{recipe-id}.json`

```json
{
  "id": "unique-recipe-id",
  "nameKey": "recipe.unique-recipe-id.name",
  "descriptionKey": "recipe.unique-recipe-id.description",
  "categoryKey": "category.main-dish",
  "tags": ["tag.high-protein", "tag.gluten-free"],
  "difficulty": "easy",
  "prepTime": 10,
  "cookTime": 15,
  "totalTime": 25,
  "servings": 4,
  "publishedAt": "2025-01-20",
  "rating": 4.8,
  "featuredImage": "https://...",
  "toolsKeys": [
    "tool.large-pan",
    "tool.knife"
  ],
  "stepsKeys": [
    "recipe.unique-recipe-id.step1",
    "recipe.unique-recipe-id.step2"
  ],
  "historyKeys": [
    "recipe.unique-recipe-id.history1"
  ],
  "references": [
    "https://www.healthline.com/..."
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
    },
    "carbs": {
      "total": 45,
      "dailyPercentage": 15,
      "healthRanking": 8,
      "descriptionKey": "nutrition.moderate-carbs"
    },
    "fats": {
      "total": 8,
      "dailyPercentage": 12,
      "healthRanking": 9,
      "descriptionKey": "nutrition.low-fats"
    },
    "fiber": {
      "total": 9,
      "dailyPercentage": 36,
      "healthRanking": 10,
      "descriptionKey": "nutrition.very-high-fiber"
    }
  },
  "seo": {
    "titleKey": "recipe.unique-recipe-id.seo-title",
    "descriptionKey": "recipe.unique-recipe-id.seo-description",
    "keywordsKeys": [
      "seo.keyword1",
      "seo.keyword2"
    ]
  },
  "ingredients": [
    {
      "productId": "product_id_001",
      "quantity": 200,
      "unit": "g",
      "notes": "optional notes",
      "optional": false
    }
  ]
}
```

### 3. **Crear Archivos de Traducción**

**Ubicación:** `src/data/translations/recipes/{recipe-id}.{lang}.json`

Crear UN archivo por idioma (es, en, ca):

```json
{
  "recipe": {
    "unique-recipe-id": {
      "name": "Nombre de la Receta",
      "description": "Descripción completa...",
      "step1": {
        "title": "Título del paso",
        "description": "Descripción detallada del paso...",
        "time": "5 minutos",
        "tip": "Consejo opcional"
      },
      "step2": {
        "title": "Siguiente paso",
        "description": "Descripción...",
        "time": "10 minutos"
      },
      "history1": "Contexto histórico de la receta...",
      "seo-title": "Título SEO optimizado",
      "seo-description": "Descripción SEO de 150-160 caracteres"
    }
  }
}
```

### 4. **Agregar Traducciones Comunes (Si es Necesario)**

Si usas **nuevas herramientas**, **tags** o **keywords SEO**, agrégalos a:

`src/data/translations/products/common.{lang}.json`

```json
{
  "tool": {
    "nueva-herramienta": "Nueva Herramienta"
  },
  "tag": {
    "nuevo-tag": "Nuevo Tag"
  },
  "seo": {
    "nueva-keyword": "nueva keyword"
  }
}
```

### 5. **Verificar y Validar**

```bash
# Verificar JSON válido
cat src/data/recipes/nueva-receta.json | python -m json.tool

# Verificar que todos los productIds existen
grep "productId" src/data/recipes/nueva-receta.json

# Verificar traducciones
ls src/data/translations/recipes/nueva-receta.*.json
```

## 📋 Checklist

### Antes de Crear Receta

- [ ] Decidir ID único de receta (formato: kebab-case)
- [ ] Verificar que todos los productos necesarios existen
- [ ] Recopilar información nutricional
- [ ] Seleccionar imagen de alta calidad
- [ ] Calcular tiempos de preparación y cocción

### Al Crear Receta

- [ ] Crear `recipes/{recipe-id}.json` con datos estructurales
- [ ] Crear `translations/recipes/{recipe-id}.es.json`
- [ ] Crear `translations/recipes/{recipe-id}.en.json`
- [ ] Crear `translations/recipes/{recipe-id}.ca.json`
- [ ] Actualizar `common.{lang}.json` con nuevas traducciones comunes

### Después de Crear Receta

- [ ] Validar JSON con herramientas
- [ ] Verificar que todos los productIds existen
- [ ] Verificar que todas las claves de traducción existen
- [ ] Probar carga de receta en la aplicación
- [ ] Hacer commit con mensaje descriptivo

## 🔑 Convenciones de Nomenclatura

### IDs de Receta

- **Formato:** `kebab-case`
- **Ejemplos:** `pollo-curry`, `ensalada-quinoa`, `bowl-amaranto-frutas`
- **NO usar:** `Pollo Curry`, `pollo_curry`, `polloCurry`

### Claves de Traducción

```
recipe.{recipe-id}.name
recipe.{recipe-id}.description
recipe.{recipe-id}.step{N}
recipe.{recipe-id}.history{N}
recipe.{recipe-id}.seo-title
recipe.{recipe-id}.seo-description
```

### Categorías Disponibles

```
category.breakfast      → Desayunos
category.main-dish      → Plato Principal
category.salads         → Ensaladas
category.desserts       → Postres
category.snacks         → Snacks
category.soups          → Sopas
```

### Tags Disponibles

```
tag.high-protein
tag.high-fiber
tag.high-iron
tag.vegetarian
tag.vegan
tag.gluten-free
tag.dairy-free
tag.low-carb
tag.low-calorie
```

### Niveles de Dificultad

```
"easy"      → Fácil
"medium"    → Intermedio
"hard"      → Difícil
```

### Health Rankings (Nutrición)

Escala del 1-10:
- `10` = Excepcional (ej: <1g carbos, >30g proteína)
- `9` = Excelente
- `8` = Muy bueno
- `7` = Bueno
- `6` = Moderado
- `5` = Aceptable
- `4` = Bajo
- `3` = Muy bajo
- `2` = Casi nulo
- `1` = Cero o irrelevante

## 📐 Estructura de Nutrición

Todos los valores son **por porción** (servingSize / servings):

```json
{
  "nutrition": {
    "calories": {
      "total": 285,
      "fromCarbs": 180,
      "fromProtein": 48,
      "fromFat": 72,
      "descriptionKey": "nutrition.moderate-calories"
    },
    "protein": {
      "total": 12,              // gramos
      "dailyPercentage": 24,    // % de valor diario
      "healthRanking": 9,       // 1-10
      "descriptionKey": "nutrition.excellent-protein"
    },
    "carbs": {
      "total": 45,
      "dailyPercentage": 15,
      "healthRanking": 8,
      "descriptionKey": "nutrition.moderate-carbs"
    },
    "fats": {
      "total": 8,
      "dailyPercentage": 12,
      "healthRanking": 9,
      "descriptionKey": "nutrition.low-fats"
    },
    "fiber": {
      "total": 9,
      "dailyPercentage": 36,
      "healthRanking": 10,
      "descriptionKey": "nutrition.very-high-fiber"
    }
  }
}
```

## 🖼️ Imágenes

### Fuentes Recomendadas

- **Pexels**: https://www.pexels.com/ (gratis, sin atribución)
- **Unsplash**: https://unsplash.com/ (gratis, sin atribución)

### Formato de URL

```
https://images.pexels.com/photos/{ID}/pexels-photo-{ID}.jpeg?auto=compress&cs=tinysrgb&w=400
```

### Dimensiones

- Ancho mínimo: 400px
- Proporción: 4:3 o 16:9
- Formato: JPEG o PNG

## ❌ Errores Comunes

### 1. JSON Inválido

```json
// ❌ MAL - Coma extra
{
  "id": "receta",
  "name": "Nombre",
}

// ✅ BIEN
{
  "id": "receta",
  "name": "Nombre"
}
```

### 2. ProductId No Existe

```json
// ❌ MAL - Producto no existe
{
  "productId": "invented_product_999"
}

// ✅ BIEN - Verificar primero
grep -r "chicken_breast_020" src/data/products/
{
  "productId": "chicken_breast_020"
}
```

### 3. Clave de Traducción Sin Definir

```json
// ❌ MAL - Clave no existe en traducciones
{
  "nameKey": "recipe.fake-recipe.name"
}

// ✅ BIEN - Crear primero en traducciones
```

### 4. Calorías No Cuadran

```javascript
// Calorías deben ser suma de macros
const caloriesCheck = (carbs * 4) + (protein * 4) + (fats * 9);
// Debe ser aproximadamente igual a total calories
```

## 📊 Ejemplo Completo

Ver recetas existentes como referencia:
- `src/data/recipes/bowl-amaranto-frutas.json`
- `src/data/recipes/pollo-curry.json`
- `src/data/recipes/ensalada-quinoa.json`

## 🔍 Validación con TypeScript

```typescript
import { z } from 'zod';

const RecipeSchema = z.object({
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
  categoryKey: z.string(),
  tags: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  prepTime: z.number(),
  cookTime: z.number(),
  totalTime: z.number(),
  servings: z.number(),
  rating: z.number().min(0).max(5),
  // ... rest of schema
});
```

## 🤝 Contribuciones

Al agregar una receta:

1. Seguir TODAS las reglas de este documento
2. Validar JSON antes de commit
3. Verificar que la receta se carga correctamente
4. Commit con mensaje: `feat: add {recipe-name} recipe`

---

**🎯 Mantén la consistencia, valida siempre, documenta bien!**
