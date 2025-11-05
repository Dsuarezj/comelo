# Guía de Configuración - Comelo.app PWA

## ✅ Lo que se ha Implementado

### 1. Arquitectura Base PWA
- **Service Worker**: Configurado con Vite PWA Plugin usando estrategia `generateSW`
- **Service Worker Custom**: Archivo `public/sw.js` con Queue System completo en IndexedDB
- **Manifest**: Configurado en `vite.config.ts` con todos los metadatos necesarios
- **Offline-First**: La app funciona completamente sin conexión

### 2. Sistema de Almacenamiento Local
- **LocalStorageService**: Wrapper tipado para localStorage con prefijo `comelo_`
- **SessionService**: Gestión de IndexedDB para archivos y caché
- **ShoppingListService**: CRUD completo de listas de compras sin base de datos

### 3. Sistema de Internacionalización
- **react-i18next**: Configurado con 3 idiomas (es, en, ca)
- **Detección automática**: Del idioma del navegador
- **Archivos de traducción**: JSON organizados por namespace
- **Cambio en runtime**: Sin necesidad de recargar la página

### 4. Componentes y Páginas
- **HomePage**: Página principal con listas y recetas recomendadas (según mockup)
- **ListsPage**: Placeholder para vista completa de listas
- **RecipesPage**: Placeholder para explorar recetas
- **ProfilePage**: Placeholder para perfil de usuario
- **BottomNav**: Navegación inferior con 4 secciones
- **RecipeCard**: Card reutilizable para mostrar recetas

### 5. Validación y Tipos
- **TypeScript**: Configurado con tipos estrictos
- **Zod Schemas**: Validación de todos los modelos de datos
- **Tipos exportados**: ShoppingList, ShoppingItem, Recipe, UserProfile, etc.

### 6. Sistema de Datos
- **Recetas**: Almacenadas en `src/data/recipes.json`
- **Formato multiidioma**: Todos los textos traducidos
- **Imágenes**: Usando URLs de Pexels (stock photos)

## 📋 Próximos Pasos Recomendados

### Fase Inmediata (MVP)
1. **Generar Iconos de PWA**
   - Crear iconos en todas las resoluciones (72x72 hasta 512x512)
   - Usar herramienta como https://realfavicongenerator.net/
   - Colocar en carpeta `public/icons/`

2. **Implementar Vista Completa de Listas**
   - CRUD de items en cada lista
   - Drag & drop para reordenar (ya tienes @dnd-kit instalado)
   - Agrupación por categorías
   - Marcar items como completados

3. **Completar Vista de Recetas**
   - Grid de todas las recetas
   - Filtros por categoría y dificultad
   - Vista detallada de receta
   - Exportar ingredientes a lista

### Fase de Sincronización
4. **Integración con Dropbox**
   - Implementar OAuth 2.0 flow
   - Crear DropboxAuthService
   - Conectar con Queue System del Service Worker
   - Implementar upload/download automático

5. **Cliente de Cola (QueueClient)**
   - Singleton para comunicación con Service Worker
   - Hook `useQueueResource` para React
   - Indicadores visuales de sincronización

### Fase de Características Avanzadas
6. **Sistema de Alérgenos**
   - Modal de configuración
   - Filtrado automático de productos/recetas
   - Alertas de seguridad

7. **Plan Semanal de Comidas**
   - Calendario semanal
   - Asignar recetas a días
   - Generar lista de compras del plan

8. **Modo Cocina**
   - Vista fullscreen de recetas
   - Navegación paso a paso
   - Temporizador integrado
   - Wake Lock API para pantalla siempre encendida

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Type checking
npm run typecheck
```

## 📦 Dependencias Instaladas

### Core
- react, react-dom: 18.3.1
- react-router-dom: 7.9.5
- typescript: 5.5.3
- vite: 5.4.2

### PWA
- vite-plugin-pwa: 1.1.0
- workbox-*: 7.3.0
- idb: 8.0.3

### i18n
- i18next: 25.6.0
- react-i18next: 16.2.4
- i18next-browser-languagedetector: 8.2.0

### UI
- tailwindcss: 3.4.1
- lucide-react: 0.344.0
- @dnd-kit/*: (para drag & drop futuro)

### Validación
- zod: 4.1.12

## 🏗️ Arquitectura de Archivos

```
src/
├── components/          # Componentes reutilizables
│   ├── BottomNav.tsx
│   └── RecipeCard.tsx
├── data/               # Datos estáticos (JSON)
│   └── recipes.json
├── i18n/               # Internacionalización
│   ├── index.ts
│   └── locales/
│       ├── es.json
│       ├── en.json
│       └── ca.json
├── pages/              # Páginas principales
│   ├── HomePage.tsx
│   ├── ListsPage.tsx
│   ├── RecipesPage.tsx
│   └── ProfilePage.tsx
├── services/           # Lógica de negocio
│   ├── SessionService.ts
│   └── ShoppingListService.ts
├── types/              # TypeScript types y Zod schemas
│   └── index.ts
└── utils/              # Utilidades
    └── storage.ts
```

## 🔐 Seguridad y Privacidad

### Datos Locales
- Todo se almacena en el dispositivo del usuario
- Sin tracking ni analytics
- Sin cookies de terceros

### Sincronización Opcional
- Dropbox es completamente opcional
- El usuario controla qué sincronizar
- Tokens almacenados de forma segura

### Sin Base de Datos Externa
- No hay servidor backend
- No se envían datos a terceros (excepto Dropbox si el usuario lo configura)
- Cumple con GDPR por diseño

## 🧪 Testing (Futuro)

### Configurar Vitest
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Estructura de Tests
```
src/
├── services/
│   ├── ShoppingListService.ts
│   └── ShoppingListService.test.ts
├── components/
│   ├── RecipeCard.tsx
│   └── RecipeCard.test.tsx
```

## 📱 Instalación Como PWA

### Desarrollo Local
1. Ejecutar `npm run build`
2. Ejecutar `npm run preview`
3. Abrir en navegador
4. Buscar icono de instalación en la barra de direcciones

### Producción
1. Desplegar en hosting (Vercel, Netlify, etc.)
2. Acceder desde móvil/desktop
3. Instalar desde el navegador

## 🔧 Configuración de Dropbox (Futuro)

### Pasos para Desarrolladores
1. Crear app en https://www.dropbox.com/developers
2. Configurar OAuth redirect URL
3. Obtener App Key y App Secret
4. Agregar a variables de entorno:
```env
VITE_DROPBOX_APP_KEY=your_app_key
VITE_DROPBOX_REDIRECT_URI=https://your-domain.com/auth/callback
```

### Flujo de Autenticación
```typescript
// Ejemplo de implementación futura
const dropboxAuth = new DropboxAuth({
  clientId: import.meta.env.VITE_DROPBOX_APP_KEY,
});

// Obtener URL de autorización
const authUrl = await dropboxAuth.getAuthenticationUrl(redirectUri);

// Usuario autoriza en Dropbox
// Recibir código en callback

// Intercambiar código por token
const { accessToken, refreshToken } = await dropboxAuth.getAccessTokenFromCode(code);

// Almacenar tokens de forma segura
// Iniciar sincronización
```

## 📊 Métricas y Monitoreo (Futuro)

### Analytics Respetuosos con Privacidad
- Vercel Analytics (sin cookies)
- Plausible Analytics
- Self-hosted Matomo

### Métricas a Monitorear
- Instalaciones de PWA
- Uso de funcionalidades offline
- Errores de Service Worker
- Tiempo de sincronización con Dropbox
- Rendimiento de carga

## 🐛 Troubleshooting

### Service Worker no se registra
```bash
# Verificar que el build incluye sw.js
npm run build
ls -la dist/sw.js

# Verificar manifest
cat dist/manifest.webmanifest
```

### Datos no persisten
```javascript
// Verificar localStorage
console.log(localStorage.getItem('comelo_shopping_lists'));

// Verificar IndexedDB
// Abrir DevTools → Application → IndexedDB → comelo_session
```

### i18n no funciona
```javascript
// Verificar idioma detectado
import i18n from './i18n';
console.log(i18n.language);

// Cambiar manualmente
i18n.changeLanguage('en');
```

## 📚 Recursos Adicionales

- [Vite PWA Docs](https://vite-pwa-org.netlify.app/)
- [Workbox Docs](https://developers.google.com/web/tools/workbox)
- [React i18next Docs](https://react.i18next.com/)
- [Dropbox API Docs](https://www.dropbox.com/developers/documentation)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)

---

**¡La base de tu PWA está lista! 🎉**

Ahora puedes empezar a implementar las funcionalidades avanzadas según el roadmap definido.
