# 🏗️ Arquitectura del Proyecto

Visualización completa de la estructura atómica implementada.

## 📁 Estructura de Carpetas

```
src/
├── elements/           🔹 ÁTOMOS - Componentes básicos
│   ├── Button.tsx
│   ├── IconButton.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Text.tsx
│   ├── Image.tsx
│   └── index.ts
│
├── components/         🧩 MOLÉCULAS - Combinación de átomos
│   ├── RecipeCard.tsx
│   ├── ListItem.tsx
│   ├── EmptyState.tsx
│   └── index.ts
│
├── modules/            🏛️ ORGANISMOS - Secciones complejas
│   ├── BottomNav.tsx
│   ├── RecipeGrid.tsx
│   ├── ListSection.tsx
│   └── index.ts
│
├── pages/              📄 PÁGINAS - Vistas completas
│   ├── HomePage.tsx
│   ├── ListsPage.tsx
│   ├── RecipesPage.tsx
│   └── ProfilePage.tsx
│
├── services/           ⚙️ SERVICIOS - Lógica de negocio
│   ├── SessionService.ts
│   └── ShoppingListService.ts
│
├── types/              📝 TIPOS - TypeScript + Zod
│   └── index.ts
│
├── utils/              🛠️ UTILIDADES
│   └── storage.ts
│
├── i18n/               🌍 INTERNACIONALIZACIÓN
│   ├── index.ts
│   └── locales/
│
├── data/               📊 DATOS ESTÁTICOS
│   └── recipes.json
│
├── App.tsx             🚀 RAÍZ
└── main.tsx            🎬 ENTRY POINT
```

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│                      PÁGINAS                            │
│  - Orquestan todo                                       │
│  - Llaman servicios                                     │
│  - Manejan estado                                       │
└────────────┬────────────────────────────────────────────┘
             │
             ├──► Servicios (ShoppingListService)
             │     ↓
             │   LocalStorage / IndexedDB
             │
             ├──► Módulos (BottomNav, RecipeGrid)
             │     ↓
             │   Componentes (RecipeCard, ListItem)
             │     ↓
             │   Elementos (Button, Card, Text, Image)
             │
             └──► i18n (useTranslation)
```

## 🎨 Jerarquía Visual

```
HomePage (Página)
├── Text (Elemento) - Título
├── Text (Elemento) - Subtítulo
├── Card (Elemento) - Crear lista
│   ├── Plus (Ícono)
│   └── Text (Elemento)
├── ListSection (Módulo)
│   └── ListItem (Componente) × N
│       ├── Card (Elemento)
│       ├── Icon (Lucide)
│       ├── Text (Elemento) - Título
│       ├── Text (Elemento) - Subtítulo
│       └── ArrowRight (Ícono)
└── RecipeGrid (Módulo)
    └── RecipeCard (Componente) × N
        ├── Card (Elemento)
        ├── Image (Elemento)
        ├── IconButton (Elemento) - Favorito
        ├── Text (Elemento) - Nombre
        ├── Text (Elemento) - Tiempo
        └── Star (Ícono) + Text (Elemento) - Rating
```

## 🔗 Imports Correctos

### ✅ En Páginas

```typescript
// Importar desde todas las capas
import { Text, Button, Card } from '../elements';
import { RecipeCard, ListItem } from '../components';
import { BottomNav, RecipeGrid } from '../modules';
import { shoppingListService } from '../services/ShoppingListService';
```

### ✅ En Módulos

```typescript
// Importar elementos y componentes
import { Text, Card } from '../elements';
import { RecipeCard, ListItem } from '../components';
// NO importar otros módulos (evitar dependencias circulares)
```

### ✅ En Componentes

```typescript
// Solo importar elementos
import { Card, Text, Image, IconButton } from '../elements';
// NO importar otros componentes ni módulos
```

### ✅ En Elementos

```typescript
// Solo imports de React y utilidades
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
// NO importar otros elementos, componentes o módulos
```

## 🚫 Anti-Patrones

### ❌ Dependencias Circulares

```typescript
// ❌ MAL - Módulo importando módulo
// src/modules/ModuleA.tsx
import { ModuleB } from './ModuleB'; // ❌

// ✅ BIEN - Refactorizar a componente compartido
```

### ❌ Elemento con Lógica de Negocio

```typescript
// ❌ MAL
// src/elements/Button.tsx
const Button = () => {
  const lists = await shoppingListService.getAllLists(); // ❌
  return <button>...</button>;
};

// ✅ BIEN - Lógica en página, UI en elemento
```

### ❌ Componente Duplicado

```typescript
// ❌ MAL - Crear RecipeCard2.tsx
// ✅ BIEN - Extender RecipeCard con props
```

## 📊 Estadísticas Actuales

```
Elementos:    6 (Button, IconButton, Card, Badge, Text, Image)
Componentes:  3 (RecipeCard, ListItem, EmptyState)
Módulos:      3 (BottomNav, RecipeGrid, ListSection)
Páginas:      4 (Home, Lists, Recipes, Profile)
Servicios:    2 (SessionService, ShoppingListService)
```

## 🎯 Guía Rápida de Decisión

```
┌─────────────────────────────────────────┐
│ ¿Qué necesito crear?                   │
└─────────────────┬───────────────────────┘
                  │
       ┌──────────┴──────────┐
       │                     │
   ¿Es reutilizable?     ¿Es específico?
       │                     │
       ▼                     ▼
   ¿Qué tipo?           ¿Qué hace?
       │                     │
   ┌───┴───┐            ┌────┴────┐
   │       │            │         │
Simple  Complejo    Combina   Orquesta
   │       │            │         │
   ▼       ▼            ▼         ▼
Elemento Componente  Módulo    Página
```

### Ejemplos:

**Necesito un botón azul**
→ ¿Reutilizable? Sí → ¿Simple? Sí → **Elemento** (Button)

**Necesito tarjeta de receta**
→ ¿Reutilizable? Sí → ¿Combina varios elementos? Sí → **Componente** (RecipeCard)

**Necesito grid de recetas horizontal**
→ ¿Reutilizable? Sí → ¿Orquesta componentes? Sí → **Módulo** (RecipeGrid)

**Necesito página de inicio con todo**
→ ¿Orquesta todo? Sí → ¿Llama servicios? Sí → **Página** (HomePage)

## 🔄 Proceso de Refactorización

Cuando detectes código duplicado:

```
1. Identificar el patrón repetido
   ↓
2. ¿Qué nivel? (elemento/componente/módulo)
   ↓
3. Crear nuevo archivo en carpeta correcta
   ↓
4. Extraer lógica común
   ↓
5. Parametrizar con props
   ↓
6. Reemplazar usos antiguos
   ↓
7. Eliminar código duplicado
   ↓
8. Exportar desde index.ts
```

## 📚 Más Información

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Guía completa del sistema de diseño
- [QUICK_START.md](./QUICK_START.md) - Cómo crear componentes rápidamente

---

**🏗️ Mantén la arquitectura limpia y organizada!**
