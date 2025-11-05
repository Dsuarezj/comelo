# 🚀 Quick Start - Comelo.app

Guía rápida para desarrolladores que quieren empezar a trabajar en el proyecto inmediatamente.

## ⚡ Inicio Rápido (2 minutos)

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar desarrollo
npm run dev

# 3. Abrir navegador
# http://localhost:5173
```

¡Listo! La aplicación está funcionando con:
- ✅ PWA configurada
- ✅ Service Worker activo
- ✅ Almacenamiento local
- ✅ Multiidioma (es/en/ca)
- ✅ Listas de compras funcionales

## 📱 Probar como PWA

```bash
# Build para producción
npm run build

# Preview del build
npm run preview

# Abrir http://localhost:4173
# Instalar desde el navegador (icono en barra de direcciones)
```

## 🎯 Funcionalidades Actuales

### ✅ Implementado
- **Home Page**: Lista de compras + recetas recomendadas
- **Bottom Navigation**: 4 secciones principales
- **Shopping Lists**: CRUD completo en localStorage
- **Recipes**: Catálogo con imágenes de Pexels
- **i18n**: Español, Inglés, Catalán
- **Service Worker**: Con Queue System en IndexedDB
- **Offline**: Funciona sin internet

### 🚧 Próximo a Implementar
- Vista detallada de listas
- CRUD de items
- Drag & drop para reordenar
- Sincronización con Dropbox
- Filtros de recetas
- Sistema de alérgenos

## 📂 Estructura Rápida

```
src/
├── components/       # UI reutilizable
├── pages/           # Páginas principales
├── services/        # Lógica de negocio
├── i18n/            # Traducciones
├── data/            # JSON estáticos
├── types/           # TypeScript + Zod
└── utils/           # Helpers
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev           # Puerto 5173

# Build
npm run build         # Producción optimizada
npm run preview       # Preview del build

# Calidad
npm run lint          # ESLint
npm run typecheck     # TypeScript check

# Limpieza
rm -rf node_modules dist
npm install
```

## 🔧 Configuración Rápida

### Cambiar Puerto
```typescript
// vite.config.ts
server: {
  port: 3000, // Cambiar aquí
}
```

### Agregar Nuevo Idioma
```typescript
// 1. Crear src/i18n/locales/fr.json
// 2. Importar en src/i18n/index.ts
import fr from './locales/fr.json';

// 3. Agregar a resources
resources: {
  es: { translation: es },
  en: { translation: en },
  ca: { translation: ca },
  fr: { translation: fr }, // Nuevo
}
```

### Personalizar Colores
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#tu-color',
      secondary: '#tu-color',
    }
  }
}
```

## 📦 Agregar Nueva Lista de Compras

```typescript
import { shoppingListService } from './services/ShoppingListService';

// Crear lista
const list = await shoppingListService.createList('Mi Lista');

// Agregar item
await shoppingListService.addItem(list.id, {
  name: 'Leche',
  quantity: 2,
  unit: 'litros',
  completed: false,
});

// Obtener todas las listas
const lists = await shoppingListService.getAllLists();
```

## 🎨 Crear Nuevo Componente

```typescript
// src/components/MiComponente.tsx
interface Props {
  title: string;
}

export default function MiComponente({ title }: Props) {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h2>{title}</h2>
      <p>{t('common.loading')}</p>
    </div>
  );
}
```

## 🔍 Debugging

### Service Worker
```javascript
// DevTools Console
navigator.serviceWorker.ready.then(reg => {
  console.log('SW:', reg.active);
});

// Ver mensajes del SW
navigator.serviceWorker.addEventListener('message', console.log);
```

### LocalStorage
```javascript
// Ver todas las listas
JSON.parse(localStorage.getItem('comelo_shopping_lists'));

// Limpiar todo
localStorage.clear();
```

### IndexedDB
```javascript
// DevTools → Application → IndexedDB
// comelo_session: archivos y caché
// comelo_queue: cola de sincronización (cuando esté implementado)
```

## 🐛 Problemas Comunes

### No aparece nada en pantalla
```bash
# Verificar consola del navegador
# Probablemente error de compilación TypeScript
npm run typecheck
```

### Service Worker no se registra
```bash
# Solo funciona en localhost o HTTPS
# Verificar en DevTools → Application → Service Workers
```

### Traducciones no aparecen
```javascript
// Verificar idioma actual
import i18n from './i18n';
console.log(i18n.language);

// Cambiar manualmente
i18n.changeLanguage('en');
```

### Build falla
```bash
# Limpiar y reinstalar
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

## 📚 Recursos Útiles

- **Documentación completa**: Ver `README.md`
- **Integración Dropbox**: Ver `DROPBOX_INTEGRATION.md`
- **Guía de configuración**: Ver `SETUP_GUIDE.md`
- **Vite PWA**: https://vite-pwa-org.netlify.app/
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/

## 🎓 Next Steps

1. **Familiarízate** con la estructura del proyecto
2. **Lee** el README.md completo para entender la arquitectura
3. **Explora** los servicios en `src/services/`
4. **Prueba** crear una lista de compras
5. **Implementa** la siguiente funcionalidad del roadmap

## 🤝 Workflow de Desarrollo

```bash
# 1. Crear rama para nueva feature
git checkout -b feature/mi-feature

# 2. Desarrollar con hot reload
npm run dev

# 3. Verificar tipos y lint
npm run typecheck
npm run lint

# 4. Build de prueba
npm run build

# 5. Commit y push
git add .
git commit -m "feat: mi feature"
git push origin feature/mi-feature
```

## ✨ Tips de Productividad

### VS Code Extensions Recomendadas
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **i18n Ally** (para traducciones)
- **Error Lens** (ver errores inline)
- **Pretty TypeScript Errors**

### Snippets Útiles

```typescript
// Nuevo servicio
class MiServicio {
  private static instance: MiServicio;

  static getInstance() {
    if (!this.instance) {
      this.instance = new MiServicio();
    }
    return this.instance;
  }
}

export const miServicio = MiServicio.getInstance();
```

```typescript
// Nueva página
import { useTranslation } from 'react-i18next';

export default function MiPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 pb-24 px-6 pt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {t('miPage.title')}
      </h1>
    </div>
  );
}
```

## 🎉 ¡Estás listo!

Ya tienes todo lo necesario para empezar a desarrollar. Si tienes dudas, revisa la documentación completa en los archivos `.md` del proyecto.

**Happy Coding! 🚀**
