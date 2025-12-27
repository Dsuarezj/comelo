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
    
    splash.markReady();  // Indica que la operación terminó
  };
  
  return <button onClick={handleAction}>Cargar</button>;
}
```

**Métodos:**
- `show(minDuration, options?)`: Muestra el splash
- `markReady()`: Indica que la inicialización terminó

## Fases del Splash

```
idle → waiting → ready → closing → idle
  │       │        │        │
  │       │        │        └── Fade-out (400ms)
  │       │        └── Esperando tiempo mínimo
  │       └── Visible, esperando markReady()
  └── Sin splash
```

## Múltiples llamadas

Si varios componentes llaman a `show()` mientras el splash está visible:
- El splash NO se reinicia
- El tiempo se extiende al mayor de los tiempos solicitados

```tsx
// Componente A
useSplashInit(2000, initA);  // Splash aparece, 2s mínimo

// Componente B (se monta después)
useSplashInit(3000, initB);  // Extiende a 3s mínimo
```

## Transición suave

El splash hace fade-out de 400ms, revelando el contenido debajo. Si usas `onFadeStart`, el siguiente contenido se renderiza durante el fade, creando una transición suave sin pantalla blanca.

