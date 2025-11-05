# 📚 Documentación de Comelo.app

Esta carpeta contiene toda la documentación técnica del proyecto.

## 📖 Índice de Documentos

### 🎯 Para Empezar

1. **[🚀 QUICK_START.md](./QUICK_START.md)**
   - Inicio rápido en 2 minutos
   - Comandos esenciales
   - Troubleshooting básico
   - **Léelo primero** si eres nuevo

### 🏗️ Arquitectura y Configuración

2. **[⚙️ SETUP_GUIDE.md](./SETUP_GUIDE.md)**
   - Arquitectura completa del proyecto
   - Guía detallada de configuración
   - Próximos pasos del roadmap
   - Testing y deployment
   - **Léelo** para entender la estructura

3. **[📘 INDEXEDDB_EXPLAINED.md](./INDEXEDDB_EXPLAINED.md)**
   - ¿Qué es IndexedDB?
   - ¿Dónde se guardan los datos?
   - LocalStorage vs IndexedDB vs Supabase
   - Ejemplos prácticos
   - Troubleshooting de almacenamiento
   - **Léelo** si no entiendes dónde están tus datos

### 🎨 Design System

4. **[🎨 DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**
   - Arquitectura atómica (Atomic Design)
   - Elementos, Componentes y Módulos
   - Guía completa de uso
   - Paleta de colores y tipografía
   - Ejemplos de código
   - **Léelo** antes de crear nuevos componentes

### ☁️ Integración con Servicios

5. **[☁️ DROPBOX_INTEGRATION.md](./DROPBOX_INTEGRATION.md)**
   - Guía completa OAuth 2.0
   - Código de ejemplo listo para copiar
   - Sincronización con Service Worker
   - Testing del flujo completo
   - **Léelo** cuando quieras implementar Dropbox

## 🎓 Orden de Lectura Recomendado

### Si eres desarrollador nuevo:
```
1. QUICK_START.md (2 min)
   ↓
2. README.md principal (10 min)
   ↓
3. INDEXEDDB_EXPLAINED.md (15 min)
   ↓
4. SETUP_GUIDE.md (20 min)
   ↓
5. Empezar a programar 🚀
```

### Si vas a implementar Dropbox:
```
1. DROPBOX_INTEGRATION.md (30 min)
   ↓
2. Crear app en Dropbox
   ↓
3. Copiar/pegar código de ejemplo
   ↓
4. Testing completo
```

### Si tienes problemas:
```
1. QUICK_START.md → Sección "Problemas Comunes"
   ↓
2. INDEXEDDB_EXPLAINED.md → Sección "Problemas Comunes"
   ↓
3. DevTools Console (F12)
```

## 🔍 Buscar Información Específica

| Quiero saber... | Lee... |
|----------------|--------|
| ¿Cómo empezar? | QUICK_START.md |
| ¿Dónde se guardan mis datos? | INDEXEDDB_EXPLAINED.md |
| ¿Cómo funciona la arquitectura? | SETUP_GUIDE.md |
| ¿Cómo sincronizar con Dropbox? | DROPBOX_INTEGRATION.md |
| ¿Qué es IndexedDB? | INDEXEDDB_EXPLAINED.md → "¿Qué es IndexedDB?" |
| ¿Cómo ver mis datos? | INDEXEDDB_EXPLAINED.md → "Cómo Ver tus Datos" |
| ¿Cómo hacer testing? | SETUP_GUIDE.md → "Testing" |
| ¿Comandos útiles? | QUICK_START.md → "Comandos Útiles" |
| ¿Crear nuevo componente? | QUICK_START.md → "Crear Nuevo Componente" |
| ¿Problemas con build? | QUICK_START.md → "Problemas Comunes" |

## 📝 Convenciones

### Emojis en Documentación
- 📚 Documentación/Guías
- 🚀 Inicio rápido/Deploy
- ⚙️ Configuración
- 📘 Conceptos técnicos
- ☁️ Servicios cloud
- ✅ Implementado
- 🚧 Próximamente
- ❌ No hacer
- 💡 Tip/Sugerencia
- ⚠️ Advertencia
- 🐛 Bug/Problema
- 🔍 Buscar/Encontrar

### Bloques de Código

```typescript
// Código TypeScript con sintaxis highlighting
const example = "código listo para copiar";
```

```bash
# Comandos de terminal
npm run dev
```

### Callouts

**Importante:**
> Información crítica que debes leer

**Nota:**
> Información adicional útil

## 🆘 ¿No Encuentras lo que Buscas?

1. Usa la búsqueda de tu editor (Ctrl+Shift+F en VS Code)
2. Busca palabras clave en todos los `.md`
3. Revisa el README.md principal
4. Revisa los comentarios en el código fuente

## 🤝 Contribuir a la Documentación

Si encuentras algo confuso o faltante:

1. Mejora el documento directamente
2. Agrega ejemplos prácticos
3. Incluye capturas de pantalla si ayuda
4. Mantén el formato consistente
5. Actualiza este índice si agregas nuevo documento

---

**Happy Reading! 📖**

### 📊 Arquitectura de Datos

**[📊 DATA_ARCHITECTURE.md](./DATA_ARCHITECTURE.md)**
   - Estructura optimizada de recetas y productos
   - Separación de datos y traducciones
   - Sistema de claves para internacionalización
   - Carga bajo demanda (lazy loading)
   - **Léelo** antes de crear recetas o productos


### 🌍 Sistema de Traducciones

**[🌍 TRANSLATION_ARCHITECTURE.md](./TRANSLATION_ARCHITECTURE.md)**
   - Arquitectura completa de traducciones
   - Separación traducciones core vs datos
   - TranslationService unificado
   - Selector de idioma (ES, EN, CA)
   - Preparado para contenido de usuarios y Dropbox
   - **Léelo** para entender cómo funcionan las traducciones


### 📝 Reglas y Guías

**[📝 RECIPE_RULES.md](./RECIPE_RULES.md)**
   - Reglas completas para agregar nuevas recetas
   - Proceso paso a paso
   - Convenciones de nomenclatura
   - Checklist de validación
   - Ejemplos y errores comunes
   - **Léelo** ANTES de agregar cualquier receta nueva

