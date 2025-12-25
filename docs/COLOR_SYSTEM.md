# Sistema de Colores

Este documento describe el sistema de colores implementado en la aplicación, que utiliza variables CSS para facilitar la personalización y mantenimiento.

## Estructura

El sistema de colores está organizado en tres capas:

### 1. Variables CSS (index.css)

Todas las variables de color se definen en `:root` usando el formato RGB sin el prefijo `rgb()`:

```css
:root {
  --color-primary-50: 252 231 243;
  --color-primary-100: 251 207 232;
  /* ... más tonos */
}
```

Este formato permite usar la sintaxis `rgb(var(--color) / <alpha>)` para transparencias.

### 2. Configuración de Tailwind (tailwind.config.js)

Las variables CSS se mapean a clases de Tailwind:

```javascript
colors: {
  primary: {
    50: 'rgb(var(--color-primary-50) / <alpha-value>)',
    100: 'rgb(var(--color-primary-100) / <alpha-value>)',
    // ...
  }
}
```

### 3. Componentes

Los componentes usan las clases de Tailwind:

```tsx
<div className="bg-primary-600 text-white">
<div className="text-neutral-700 hover:bg-neutral-100">
```

## Paletas de Colores

### Primary (Rosa/Pink)
Color principal de la marca, usado para acciones primarias y elementos destacados.
- Tonos: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Secondary (Azul/Blue)
Color secundario, usado para acciones secundarias y elementos informativos.
- Tonos: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Neutral (Gris/Gray)
Colores neutros para texto, bordes y fondos.
- Tonos: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Danger (Rojo/Red)
Para errores, alertas y acciones destructivas.
- Tonos: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Success (Verde/Green)
Para confirmaciones y estados exitosos.
- Tonos: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Colores Especiales
- `background`: Color de fondo principal
- `surface`: Color de superficies (cards, modales)
- `text-primary`: Texto principal
- `text-secondary`: Texto secundario
- `text-muted`: Texto atenuado

## Uso en Componentes

### Botones
```tsx
// Primario
<Button variant="primary">Acción Principal</Button>  // bg-primary-600

// Secundario
<Button variant="secondary">Acción Secundaria</Button>  // bg-secondary-600

// Peligro
<Button variant="danger">Eliminar</Button>  // bg-danger-600
```

### Texto
```tsx
<Text color="primary">Texto principal</Text>      // text-neutral-900
<Text color="secondary">Texto secundario</Text>   // text-neutral-700
<Text color="muted">Texto atenuado</Text>         // text-neutral-600
<Text color="danger">Error</Text>                 // text-danger-600
```

### Badges
```tsx
<Badge variant="default">Normal</Badge>    // bg-neutral-100 text-neutral-700
<Badge variant="info">Info</Badge>         // bg-secondary-100 text-secondary-700
<Badge variant="success">Éxito</Badge>     // bg-success-100 text-success-700
<Badge variant="danger">Error</Badge>      // bg-danger-100 text-danger-700
```

### Navegación
```tsx
// Barra inferior
<nav className="bg-primary-100 border-primary-200">

// Elemento activo
<button className="text-neutral-900">

// Elemento inactivo
<button className="text-neutral-600 hover:text-neutral-900">
```

## Personalización

Para cambiar el esquema de colores de toda la aplicación:

### Opción 1: Cambiar Variables CSS

Edita `src/index.css` y modifica los valores RGB:

```css
:root {
  /* Cambia primary de rosa a otro color */
  --color-primary-600: 37 99 235;  /* Azul */
}
```

### Opción 2: Temas Dinámicos

Puedes crear temas adicionales agregando clases:

```css
.theme-dark {
  --color-background: 17 24 39;
  --color-text-primary: 243 244 246;
  /* ... */
}
```

Y aplicarlo:

```tsx
<div className={isDarkMode ? 'theme-dark' : ''}>
  {/* app content */}
</div>
```

## Migrando Colores Hardcodeados

Si encuentras colores hardcodeados, reemplázalos según esta tabla:

| Antes | Después |
|-------|---------|
| `bg-pink-*` | `bg-primary-*` |
| `text-pink-*` | `text-primary-*` |
| `bg-blue-*` | `bg-secondary-*` |
| `text-blue-*` | `text-secondary-*` |
| `bg-gray-*` | `bg-neutral-*` |
| `text-gray-*` | `text-neutral-*` |
| `bg-red-*` | `bg-danger-*` |
| `text-red-*` | `text-danger-*` |
| `bg-green-*` | `bg-success-*` |
| `text-green-*` | `text-success-*` |

## Mejores Prácticas

1. **Usa nombres semánticos**: Prefiere `primary`, `secondary`, `danger` sobre nombres de colores específicos
2. **Mantén consistencia**: Usa los mismos tonos para casos similares (ej: siempre `600` para botones)
3. **Aprovecha las variantes**: Los componentes tienen variantes predefinidas que ya usan el sistema
4. **Evita colores inline**: No uses estilos inline con colores, usa clases de Tailwind
5. **Documenta cambios**: Si cambias el esquema de colores, actualiza esta documentación

## Accesibilidad

Los tonos están elegidos para cumplir con WCAG 2.1:

- **Texto normal**: Mínimo contraste 4.5:1
  - `text-neutral-900` sobre `bg-white` ✓
  - `text-neutral-700` sobre `bg-white` ✓

- **Texto grande**: Mínimo contraste 3:1
  - `text-neutral-600` sobre `bg-white` ✓

- **Elementos interactivos**: Mínimo contraste 3:1
  - `bg-primary-600` (botones) ✓
  - `border-neutral-300` (inputs) ✓

Verifica el contraste al cambiar colores usando herramientas como [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).
