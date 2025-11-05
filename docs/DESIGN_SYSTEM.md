# 🎨 Comelo.app Design System

Sistema de diseño atómico para mantener consistencia visual y reutilización de componentes.

## 📐 Arquitectura Atómica

Seguimos la metodología **Atomic Design** de Brad Frost:

```
Átomos (Elements) → Moléculas (Components) → Organismos (Modules) → Páginas (Pages)
```

### 🔹 **1. Elementos** (`src/elements/`)

**Átomos** - Componentes básicos e indivisibles. NO contienen lógica de negocio.

```
src/elements/
├── Button.tsx          # Botones con variantes
├── IconButton.tsx      # Botones con íconos
├── Card.tsx            # Contenedores
├── Badge.tsx           # Etiquetas/badges
├── Text.tsx            # Tipografía
└── Image.tsx           # Imágenes con loading
```

**Reglas:**
- ✅ **Reutilizables** en cualquier contexto
- ✅ **Sin lógica de negocio** (solo UI pura)
- ✅ **Props tipadas** con TypeScript
- ✅ **Variantes predefinidas** (sizes, colors, variants)
- ❌ **No usan hooks** de estado (pueden usar useState para UI internal)
- ❌ **No llaman servicios** (APIs, localStorage, etc.)

### 🔹 **2. Componentes** (`src/components/`)

**Moléculas** - Combinación de elementos que forman componentes específicos.

```
src/components/
├── RecipeCard.tsx      # Tarjeta de receta
├── ListItem.tsx        # Item de lista
└── EmptyState.tsx      # Estado vacío
```

**Reglas:**
- ✅ **Componen** múltiples elementos
- ✅ **Lógica de presentación** (no de negocio)
- ✅ **Props específicas** del componente
- ❌ **No acceden directamente** a servicios
- ❌ **No manejan routing** (reciben callbacks)

### 🔹 **3. Módulos** (`src/modules/`)

**Organismos** - Secciones complejas que combinan componentes y elementos.

```
src/modules/
├── BottomNav.tsx       # Navegación inferior
├── RecipeGrid.tsx      # Grid de recetas
└── ListSection.tsx     # Sección de listas
```

**Reglas:**
- ✅ **Combinan** elementos y componentes
- ✅ **Pueden usar hooks** (useNavigate, useTranslation)
- ✅ **Lógica de interacción** compleja
- ⚠️ **Mínimo acceso** a servicios (preferiblemente via props)

### 🔹 **4. Páginas** (`src/pages/`)

**Templates/Pages** - Vistas completas que orquestan todo.

```
src/pages/
├── HomePage.tsx
├── ListsPage.tsx
├── RecipesPage.tsx
└── ProfilePage.tsx
```

**Reglas:**
- ✅ **Orquestan** módulos, componentes y elementos
- ✅ **Llaman servicios** (ShoppingListService, etc.)
- ✅ **Manejan estado** de la página
- ✅ **Pueden usar HTML puro** (`<p>`, `<div>`) si es necesario
- ⚠️ **Delegan UI** a componentes (no repiten estilos)

---

## 🎨 Elementos Base

### Button

Botón versátil con múltiples variantes.

```typescript
import { Button } from '../elements';

// Variantes
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Tamaños
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Propiedades
<Button
  onClick={() => console.log('clicked')}
  disabled={false}
  fullWidth={false}
  type="button"
>
  Click me
</Button>
```

**Variantes disponibles:**
- `primary` - Rosa, acción principal
- `secondary` - Azul, acción secundaria
- `ghost` - Transparente, acciones terciarias
- `danger` - Rojo, acciones destructivas

**Tamaños:**
- `sm` - Pequeño (px-3 py-1.5)
- `md` - Mediano (px-4 py-2) - default
- `lg` - Grande (px-6 py-3)

---

### IconButton

Botón circular con ícono, ideal para acciones rápidas.

```typescript
import { IconButton } from '../elements';
import { Heart, Star, Plus } from 'lucide-react';

<IconButton
  icon={Heart}
  onClick={() => {}}
  variant="default"  // default | filled | ghost
  size={20}
  active={false}
  ariaLabel="Like"
/>
```

**Variantes:**
- `default` - Fondo blanco
- `filled` - Fondo rosa
- `ghost` - Transparente

---

### Card

Contenedor con sombra y bordes redondeados.

```typescript
import { Card } from '../elements';

<Card padding="md" shadow="sm">
  <p>Contenido de la tarjeta</p>
</Card>

// Card clickeable
<Card onClick={() => navigate('/somewhere')} padding="lg">
  <p>Click me!</p>
</Card>
```

**Padding:**
- `none` - Sin padding
- `sm` - p-3
- `md` - p-4 (default)
- `lg` - p-6

**Shadow:**
- `none` - Sin sombra
- `sm` - Sombra pequeña (default)
- `md` - Sombra mediana
- `lg` - Sombra grande

---

### Badge

Etiqueta pequeña para categorías o estados.

```typescript
import { Badge } from '../elements';

<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
```

**Variantes:**
- `default` - Gris
- `success` - Verde
- `warning` - Amarillo
- `danger` - Rojo
- `info` - Azul

---

### Text

Componente de tipografía consistente.

```typescript
import { Text } from '../elements';

// Variantes
<Text variant="h1">Título principal</Text>
<Text variant="h2">Título secundario</Text>
<Text variant="h3">Subtítulo</Text>
<Text variant="body">Texto normal</Text>
<Text variant="small">Texto pequeño</Text>
<Text variant="caption">Texto muy pequeño</Text>

// Colores
<Text color="primary">Texto principal (gray-900)</Text>
<Text color="secondary">Texto secundario (gray-700)</Text>
<Text color="muted">Texto apagado (gray-600)</Text>
<Text color="danger">Texto de error (red-600)</Text>

// Custom HTML tag
<Text variant="h1" as="h2">H1 style but H2 semantic</Text>
```

---

### Image

Imagen con loading state y aspect ratio.

```typescript
import { Image } from '../elements';

<Image
  src="https://example.com/image.jpg"
  alt="Description"
  aspectRatio="16:9"  // 1:1 | 16:9 | 4:3 | auto
  objectFit="cover"   // cover | contain | fill
  rounded="md"        // none | sm | md | lg | full
/>
```

**Características:**
- ✅ Loading state con skeleton
- ✅ Error handling
- ✅ Lazy loading
- ✅ Aspect ratio controlado

---

## 🧩 Componentes (Moléculas)

### RecipeCard

Tarjeta de receta con imagen, favorito y rating.

```typescript
import { RecipeCard } from '../components';

<RecipeCard
  recipe={recipe}
  isFavorite={false}
  onFavoriteToggle={(id) => console.log('Toggle', id)}
/>
```

**Composición:**
- `Card` (elemento base)
- `Image` (foto de la receta)
- `IconButton` (botón de favorito)
- `Text` (nombre, tiempo, rating)

---

### ListItem

Item de lista con ícono, título, subtítulo y flecha.

```typescript
import { ListItem } from '../components';
import { List } from 'lucide-react';

<ListItem
  title="Mi lista de compras"
  subtitle="5 productos"
  icon={List}
  iconBgColor="bg-blue-100 text-blue-600"
  badge="3 nuevos"
  onClick={() => navigate('/list/123')}
  showArrow={true}
/>
```

---

### EmptyState

Estado vacío con ícono, texto y acción.

```typescript
import { EmptyState } from '../components';
import { ShoppingBag } from 'lucide-react';

<EmptyState
  icon={ShoppingBag}
  title="No tienes listas todavía"
  description="Crea tu primera lista de compras"
  actionLabel="Crear lista"
  onAction={() => createList()}
/>
```

---

## 🏛️ Módulos (Organismos)

### BottomNav

Navegación inferior con 4 secciones.

```typescript
import { BottomNav } from '../modules';

// Se usa en App.tsx
<BottomNav />
```

**Características:**
- Usa `useNavigate` y `useLocation`
- Usa `useTranslation` para i18n
- Detecta ruta activa automáticamente
- Ícono con fill cuando está activo

---

### RecipeGrid

Grid horizontal de recetas.

```typescript
import { RecipeGrid } from '../modules';

<RecipeGrid
  recipes={recipes}
  favorites={['recipe-1', 'recipe-3']}
  onFavoriteToggle={(id) => toggleFavorite(id)}
/>
```

---

### ListSection

Sección de listas de compras.

```typescript
import { ListSection } from '../modules';

<ListSection
  lists={lists}
  onListClick={(id) => navigate(`/lists/${id}`)}
/>
```

---

## 🎨 Paleta de Colores

### Principales
```css
Primary (Rosa):   #FF6B6B (pink-600)
Secondary (Azul): #4ECDC4 (custom)
```

### Grises
```css
Gray-50:  #F9FAFB (backgrounds)
Gray-100: #F3F4F6 (hover states)
Gray-600: #4B5563 (muted text)
Gray-700: #374151 (secondary text)
Gray-900: #111827 (primary text)
```

### Semánticos
```css
Success:  #10B981 (green-600)
Warning:  #F59E0B (yellow-600)
Danger:   #EF4444 (red-600)
Info:     #3B82F6 (blue-600)
```

---

## 📏 Espaciado

Usamos el sistema de espaciado de Tailwind (escala de 4px):

```
2  → 8px
3  → 12px
4  → 16px
6  → 24px
8  → 32px
12 → 48px
```

**Convención:**
- `gap-3` para espacios pequeños
- `gap-4` para espacios medianos
- `mb-6` o `mb-8` para secciones

---

## 🔤 Tipografía

### Jerarquía

```typescript
H1: text-4xl font-bold    (36px, bold)
H2: text-3xl font-bold    (30px, bold)
H3: text-xl font-semibold (20px, semibold)
Body: text-base           (16px)
Small: text-sm            (14px)
Caption: text-xs          (12px)
```

### Pesos
- `font-normal` (400) - Texto regular
- `font-medium` (500) - Texto destacado
- `font-semibold` (600) - Subtítulos
- `font-bold` (700) - Títulos

---

## 🎯 Guía de Uso

### ¿Cuándo usar qué?

#### Usar **Elementos** cuando:
- Necesitas un botón estándar
- Necesitas texto con estilos consistentes
- Necesitas un contenedor básico

#### Usar **Componentes** cuando:
- Necesitas una tarjeta de receta
- Necesitas un item de lista con estructura específica
- Necesitas un estado vacío

#### Usar **Módulos** cuando:
- Necesitas navegación
- Necesitas una sección completa (grid de recetas)
- Necesitas orquestar varios componentes

#### Usar **HTML puro** cuando:
- Necesitas un `<p>` simple sin estilos
- Necesitas estructura semántica básica
- El componente no se reutiliza

---

## ✅ Ejemplo Completo: Crear Nueva Página

```typescript
// src/pages/NewPage.tsx
import { Text, Button, Card } from '../elements';
import { ListItem, EmptyState } from '../components';
import { ListSection } from '../modules';

export default function NewPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 px-6 pt-8">
      {/* Título - usar Text elemento */}
      <Text variant="h1" className="mb-2">
        Mi Nueva Página
      </Text>

      {/* Subtítulo - usar Text con color muted */}
      <Text variant="body" color="muted" className="mb-8">
        Descripción de la página
      </Text>

      {/* Card clickeable */}
      <Card onClick={() => {}} padding="md" className="mb-4">
        <Text variant="body">Contenido de la tarjeta</Text>
      </Card>

      {/* Lista de items */}
      <div className="space-y-2">
        <ListItem
          title="Item 1"
          subtitle="Subtítulo"
          onClick={() => {}}
        />
      </div>

      {/* Estado vacío */}
      <EmptyState
        title="Sin datos"
        description="Aún no hay nada aquí"
        actionLabel="Crear"
        onAction={() => {}}
      />
    </div>
  );
}
```

---

## 🚫 Anti-Patrones (NO hacer)

### ❌ NO repetir estilos en páginas

```typescript
// ❌ MAL
<h1 className="text-4xl font-bold text-gray-900 mb-2">
  Título
</h1>

// ✅ BIEN
<Text variant="h1" className="mb-2">
  Título
</Text>
```

### ❌ NO crear botones custom

```typescript
// ❌ MAL
<button className="bg-pink-600 text-white px-4 py-2 rounded-xl">
  Click
</button>

// ✅ BIEN
<Button variant="primary">
  Click
</Button>
```

### ❌ NO duplicar componentes

```typescript
// ❌ MAL - crear RecipeCard2.tsx muy similar
// ✅ BIEN - agregar props a RecipeCard existente
```

### ❌ NO mezclar lógica de negocio en elementos

```typescript
// ❌ MAL
// src/elements/Button.tsx
const Button = () => {
  const lists = await shoppingListService.getAllLists(); // ❌
  return <button>...</button>;
};

// ✅ BIEN - elementos solo UI pura
```

---

## 📚 Referencias

- [Atomic Design - Brad Frost](https://atomicdesign.bradfrost.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

---

**🎨 Mantén la consistencia, reutiliza componentes, evita duplicación!**
