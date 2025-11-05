# Comelo.app - PWA de Nutrición y Gestión de Compras

Progressive Web Application para gestión de listas de compras y descubrimiento de recetas saludables, completamente funcional sin base de datos, utilizando almacenamiento local y sincronización opcional con Dropbox.

## 🌟 Características Implementadas

### ✅ Funcionalidades Core
- **PWA Completa**: Instalable, funciona offline, con Service Worker avanzado
- **Sistema de Listas de Compras**: CRUD completo con almacenamiento local
- **Recetas Saludables**: Catálogo de recetas con información nutricional
- **Multiidioma (i18n)**: Español, Inglés y Catalán
- **Navegación Bottom**: 4 secciones principales (Home, Listas, Recetas, Perfil)
- **Sistema de Favoritos**: Para productos y recetas
- **Offline-First**: Toda la app funciona sin conexión a internet

### 🔧 Arquitectura Técnica
- **Service Worker con Queue System**: Sistema de cola persistente en IndexedDB para sincronización diferida
- **LocalStorage Service**: Gestión de datos locales con tipado fuerte
- **SessionService**: IndexedDB para almacenamiento de archivos y caché
- **ShoppingListService**: CRUD completo de listas con arquitectura modular
- **Validación con Zod**: Todos los datos validados con schemas TypeScript

## 📁 Estructura del Proyecto

```
comelo-app/
├── docs/                        # 📚 Documentación detallada
│   ├── INDEXEDDB_EXPLAINED.md   # Guía completa de IndexedDB
│   ├── QUICK_START.md           # Inicio rápido
│   ├── SETUP_GUIDE.md           # Guía de configuración
│   └── DROPBOX_INTEGRATION.md   # Integración con Dropbox
├── public/
│   ├── sw.js                    # Service Worker con Queue System
│   ├── manifest.json            # PWA Manifest
│   └── icons/                   # Iconos de la aplicación
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx        # Navegación inferior
│   │   └── RecipeCard.tsx       # Tarjeta de receta
│   ├── contexts/                # Contextos React (futuro)
│   ├── data/
│   │   └── recipes.json         # Recetas del sistema
│   ├── hooks/                   # Custom hooks (futuro)
│   ├── i18n/
│   │   ├── index.ts             # Configuración i18next
│   │   └── locales/
│   │       ├── es.json          # Traducciones español
│   │       ├── en.json          # Traducciones inglés
│   │       └── ca.json          # Traducciones catalán
│   ├── pages/
│   │   ├── HomePage.tsx         # Página principal
│   │   ├── ListsPage.tsx        # Gestión de listas
│   │   ├── RecipesPage.tsx      # Explorar recetas
│   │   └── ProfilePage.tsx      # Perfil de usuario
│   ├── services/
│   │   ├── SessionService.ts    # Gestión IndexedDB
│   │   └── ShoppingListService.ts # CRUD de listas
│   ├── types/
│   │   └── index.ts             # Tipos y Schemas Zod
│   ├── utils/
│   │   └── storage.ts           # Utilidades de almacenamiento
│   ├── App.tsx                  # Componente raíz
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globales
├── package.json
├── vite.config.ts               # Configuración Vite + PWA
├── tsconfig.json
├── .env                         # Variables de entorno (Dropbox keys)
└── README.md                    # Este archivo
```

## 📚 Documentación Adicional

Toda la documentación detallada está en la carpeta `docs/`:

- **[📘 INDEXEDDB_EXPLAINED.md](./docs/INDEXEDDB_EXPLAINED.md)** - Guía completa sobre qué es IndexedDB, dónde se guardan los datos y cómo funciona
- **[🚀 QUICK_START.md](./docs/QUICK_START.md)** - Inicio rápido para desarrolladores (2 minutos)
- **[⚙️ SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)** - Guía detallada de configuración y arquitectura
- **[☁️ DROPBOX_INTEGRATION.md](./docs/DROPBOX_INTEGRATION.md)** - Plan completo de integración OAuth con Dropbox

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio (si aplica)
git clone <repo-url>
cd comelo-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

La aplicación estará disponible en `http://localhost:5173`

## 🛠️ Stack Tecnológico

### Core
- **React 18** con TypeScript
- **Vite** como build tool
- **Tailwind CSS** para estilos
- **React Router v7** para navegación

### PWA y Offline
- **vite-plugin-pwa** con Workbox
- **IndexedDB** (vía idb) para cola persistente - Base de datos en el navegador, guardada localmente en tu disco duro
- **LocalStorage** para datos ligeros (configuración, favoritos)
- **Service Worker custom** con sistema de sincronización
- **Sin base de datos externa** - Todo funciona 100% offline

> 💡 **¿Qué es IndexedDB?** Es una base de datos que vive en tu navegador, guardada en tu computadora/móvil. Lee la [guía completa aquí](./docs/INDEXEDDB_EXPLAINED.md)

### Internacionalización
- **react-i18next** + i18next
- **i18next-browser-languagedetector**

### Gestión de Estado y Datos
- **Zod** para validación de schemas
- **Servicios locales** sin base de datos externa
- **JSON files** para datos del sistema

### UI/UX
- **Lucide React** para iconos
- **@dnd-kit** (preparado para drag & drop futuro)

## 📝 Uso de la Aplicación

### Crear una Lista de Compras

1. En la página principal, haz clic en "Crea una lista para tus compras!"
2. Ingresa el nombre de la lista
3. La lista se guarda automáticamente en localStorage

### Ver Recetas Recomendadas

- Las recetas se muestran en la página principal
- Haz clic en el corazón para marcar como favorita
- Los favoritos se guardan localmente

### Cambiar Idioma

El idioma se detecta automáticamente del navegador, pero se puede cambiar manualmente en el perfil (próximamente).

Idiomas soportados:
- 🇪🇸 Español (por defecto)
- 🇬🇧 English
- 🇪🇸 Català

## 🔐 Sistema de Almacenamiento

### LocalStorage
Utilizado para:
- Listas de compras
- Favoritos de recetas
- Preferencias de idioma
- Configuración de alérgenos (futuro)

### IndexedDB
Utilizado para:
- Cola de sincronización del Service Worker
- Caché de archivos pesados
- Datos temporales de sesión

### Formato de Datos

Todos los datos se almacenan con el prefijo `comelo_`:

```typescript
// Ejemplo de lista de compras
{
  "id": "1730832000000-abc123",
  "name": "Compras de la semana",
  "items": [
    {
      "id": "1730832001000-xyz456",
      "name": "Leche",
      "quantity": 2,
      "unit": "litros",
      "completed": false,
      "category": "lacteos",
      "createdAt": 1730832001000,
      "updatedAt": 1730832001000
    }
  ],
  "createdAt": 1730832000000,
  "updatedAt": 1730832001000,
  "order": 0
}
```

## 🔄 Service Worker y Sincronización

### Queue System

El Service Worker implementa un sistema de cola persistente en IndexedDB que:

1. **Encola operaciones** cuando se realizan cambios locales
2. **Agrupa operaciones** del mismo recurso (coalescing)
3. **Procesa LIFO** (último en entrar, primero en salir)
4. **Detecta race conditions** comparando timestamps
5. **Reintenta** operaciones fallidas automáticamente

### Uso del Queue System

```typescript
// Desde el cliente (ejemplo futuro)
import { queueClient } from './services/QueueClient';

// Encolar sincronización de lista
await queueClient.enqueue(
  'shopping-lists',
  listId,
  listData
);

// Consultar estado
const status = await queueClient.status(listId);
// { exists: true, status: 'pending', processing: false }
```

## 🔗 Integración con Dropbox (Planificado)

### Flujo de Autenticación OAuth 2.0

```typescript
// Futuro: DropboxAuthService
class DropboxAuthService {
  async authenticate(): Promise<void> {
    // 1. Redirigir a Dropbox OAuth
    // 2. Recibir código de autorización
    // 3. Intercambiar por access token
    // 4. Almacenar tokens de forma segura
    // 5. Iniciar sincronización automática
  }
}
```

### Estructura en Dropbox

```
/comelo/
  ├── shopping-lists/
  │   ├── lista-1.json
  │   ├── lista-2.json
  │   └── ...
  ├── user-profile.json
  └── favorites.json
```

## 🎨 Personalización de Estilos

Los estilos usan Tailwind CSS con tema personalizado en `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',    // Rosa principal
        secondary: '#4ECDC4',  // Turquesa
        // ... más colores
      }
    }
  }
}
```

## 🧪 Testing (Futuro)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📱 Instalación como PWA

### Android
1. Abrir la app en Chrome
2. Menú → "Añadir a pantalla de inicio"
3. Confirmar instalación

### iOS
1. Abrir la app en Safari
2. Botón compartir → "Añadir a pantalla de inicio"
3. Confirmar instalación

### Desktop (Chrome/Edge)
1. Icono de instalación en la barra de direcciones
2. Clic en "Instalar"
3. La app se abrirá en ventana independiente

## 🔒 Privacidad y Seguridad

- **Sin tracking**: No se recopilan datos analíticos por defecto
- **Datos locales**: Todo se almacena en el dispositivo del usuario
- **Sin cookies de terceros**: Solo cookies técnicas esenciales
- **Sincronización opcional**: El usuario decide si quiere Dropbox
- **Sin autenticación obligatoria**: La app funciona completamente offline

## 🚧 Roadmap

### Fase 1 - MVP ✅ (Completado)
- [x] Configuración PWA básica
- [x] Service Worker con Queue System
- [x] Sistema de listas de compras local
- [x] Página Home con recetas
- [x] Navegación bottom
- [x] Sistema i18n multiidioma
- [x] Servicios de almacenamiento local

### Fase 2 - Funcionalidades Core (Próximo)
- [ ] CRUD completo de items en listas
- [ ] Drag & drop para reordenar
- [ ] Búsqueda de productos
- [ ] Filtros por categoría
- [ ] Sistema de alérgenos personalizado
- [ ] Vista detallada de recetas

### Fase 3 - Sincronización
- [ ] Autenticación OAuth Dropbox
- [ ] Upload/download automático
- [ ] Resolución de conflictos
- [ ] Compartir listas entre usuarios
- [ ] Notificaciones de cambios

### Fase 4 - Características Avanzadas
- [ ] Plan semanal de comidas
- [ ] Análisis nutricional
- [ ] Exportar recetas a PDF
- [ ] Modo cocina con temporizador
- [ ] Libros de recetas personalizados
- [ ] Blog educativo de nutrición

## 🤝 Contribución

Este proyecto sigue los siguientes principios:

1. **Offline-First**: Toda funcionalidad debe funcionar sin internet
2. **Sin base de datos**: Solo localStorage e IndexedDB
3. **Tipado estricto**: TypeScript con validación Zod
4. **Componentes reutilizables**: Seguir principios SOLID
5. **Accesibilidad**: WAI-ARIA compliant
6. **Responsive**: Mobile-first design

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 👥 Autores

- Desarrollador Principal: [Tu Nombre]

## 📞 Soporte

Para reportar bugs o solicitar features, crear un issue en GitHub.

## 🙏 Agradecimientos

- React Team
- Vite Team
- Tailwind CSS
- Workbox Team
- Comunidad Open Source

---

**Comelo.app** - Tu asistente personal de nutrición 🥗
