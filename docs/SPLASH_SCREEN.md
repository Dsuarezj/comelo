# Splash Screen

Sistema centralizado para mostrar un splash screen durante la inicialización de la app o componentes.

## API

### `useSplashInit(minDuration, init, onFadeStart?)`

Hook principal para mostrar el splash durante una inicialización.

```tsx
import { useSplashInit } from './contexts';

function MyComponent() {
  useSplashInit(
    2000,                          // Duración mínima en ms
    () => myService.init(),        // Función async de inicialización
    () => navigateToNext()         // (Opcional) Callback al iniciar fade-out
  );
  
  return <div>Mi contenido</div>;
}
```

**Parámetros:**
- `minDuration`: Tiempo mínimo que el splash estará visible (en ms)
- `init`: Función async que ejecuta la inicialización
- `onFadeStart`: (Opcional) Callback que se ejecuta cuando el splash empieza a desvanecerse

**Comportamiento:**
1. El splash aparece inmediatamente
2. La función `init` se ejecuta en background
3. Cuando `init` termina Y el tiempo mínimo ha pasado, el splash se desvanece
4. Si se proporciona `onFadeStart`, se llama al inicio del fade-out

## Uso con múltiples componentes

El splash soporta **múltiples componentes** llamando a `show()` simultáneamente de forma **completamente desacoplada**.

### Contador de pendientes

Internamente, el splash mantiene un contador:
- Cada `show()` → incrementa el contador
- Cada `markReady()` → decrementa el contador
- El splash solo se cierra cuando el contador llega a **0**

### Ejemplo: App + Onboarding

```tsx
// App.tsx - se monta primero
function AppContent() {
  useSplashInit(1500, initializeApp);  // pendingCount = 1
  // ...
}

// OnboardingSplashStep.tsx - se monta después
function OnboardingSplashStep({ onNext }) {
  useSplashInit(2500, () => sessionService.init(), onNext);  // pendingCount = 2
  return null;
}
```

**Flujo:**
1. App: `show(1500)` → pendingCount = 1, splash visible
2. OnboardingSplash: `show(2500, {onFadeStart: onNext})` → pendingCount = 2
3. App termina init: `markReady()` → pendingCount = 1
4. OnboardingSplash termina init: `markReady()` → pendingCount = 0 → fase 'ready'
5. Timer termina → llama `onFadeStart` (`onNext`) → siguiente paso

**Beneficios:**
- Cada componente es independiente
- No necesitan saber si otros usan el splash
- El último `onFadeStart` registrado es el que se ejecuta

## Casos de Uso

### Inicialización de la app

```tsx
const SPLASH_DURATION = 1_500;

async function initializeApp() {
  await sessionService.init();
  await translationService.warmVersions();
}

function AppContent() {
  useSplashInit(SPLASH_DURATION, initializeApp);
  
  return <Routes>...</Routes>;
}
```

### Onboarding con transición

```tsx
const MIN_DURATION = 2_500;

function OnboardingSplashStep({ onNext }) {
  useSplashInit(
    MIN_DURATION,
    () => sessionService.init(),
    onNext  // Navega al siguiente paso cuando empieza el fade
  );
  
  return null;
}
```

### Carga de datos

```tsx
function ProductPage({ productId }) {
  useSplashInit(
    1000,
    async () => {
      await productService.loadProduct(productId);
      await recommendationsService.load();
    }
  );
  
  return <ProductDetails />;
}
```

## API Avanzada

### `useSplash()`

Para control manual del splash (casos especiales).

```tsx
import { useSplash } from './contexts';

function MyComponent() {
  const splash = useSplash();
  
  const handleAction = async () => {
    splash.show(2000, { 
      onFadeStart: () => console.log('Fade started') 
    });
    
    await heavyOperation();
    
    splash.markReady();
  };
  
  return <button onClick={handleAction}>Cargar</button>;
}
```

**Métodos:**
- `show(minDuration, options?)`: Muestra el splash e incrementa pendingCount
- `markReady()`: Decrementa pendingCount, cierra si llega a 0

## Fases del Splash

```
idle → waiting → ready → closing → idle
  │       │        │        │
  │       │        │        └── Fade-out (400ms)
  │       │        └── pendingCount=0, esperando tiempo mínimo
  │       └── Visible, pendingCount > 0
  └── Sin splash
```

## Comportamiento del callback `onFadeStart`

Cuando múltiples componentes llaman a `show()` con diferentes callbacks:
- El **último** `onFadeStart` registrado es el que se ejecuta
- Los callbacks anteriores son reemplazados (no combinados)

```tsx
// Componente A
splash.show(2000);  // Sin callback

// Componente B (después)
splash.show(3000, { onFadeStart: myCallback });  // myCallback será ejecutado
```

## Transición suave

El splash hace fade-out de 400ms, revelando el contenido debajo. Si usas `onFadeStart`, el siguiente contenido se renderiza durante el fade, creando una transición suave sin pantalla blanca.
