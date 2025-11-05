# 📚 IndexedDB - Guía Completa

## ¿Qué es IndexedDB?

**IndexedDB** es una base de datos **que vive dentro de tu navegador**, almacenada completamente en tu dispositivo. Es como tener una pequeña base de datos en tu computadora o celular, pero manejada por el navegador.

## 🔍 Conceptos Clave

### 1. Es LOCAL, no en Internet

```
❌ NO ES ESTO:
Tu App → Internet → Servidor → Base de Datos (Supabase/MySQL)

✅ ES ESTO:
Tu App → Navegador → Disco Duro Local → IndexedDB
```

**Ventajas:**
- ✅ Funciona sin internet
- ✅ Respuesta instantánea (no hay latencia de red)
- ✅ Privado (nadie más puede ver tus datos)
- ✅ Gratis (no pagas por servidores)

**Desventajas:**
- ❌ No se sincroniza entre dispositivos (a menos que uses Dropbox)
- ❌ Si formateas tu PC, pierdes los datos
- ❌ Si borras datos del navegador, se pierden

### 2. ¿Dónde se Guardan los Datos?

Los datos se guardan en **archivos en tu disco duro**, en carpetas específicas del navegador:

#### Windows (Chrome)
```
C:\Users\TuNombre\AppData\Local\Google\Chrome\User Data\Default\IndexedDB\
```

Ejemplo real:
```
C:\Users\Juan\AppData\Local\Google\Chrome\User Data\Default\IndexedDB\
└── https_comelo.app_0.indexeddb.leveldb\
    ├── 000003.log
    ├── CURRENT
    ├── LOCK
    └── MANIFEST-000001
```

#### Mac (Chrome)
```
~/Library/Application Support/Google/Chrome/Default/IndexedDB/
```

#### Linux (Chrome)
```
~/.config/google-chrome/Default/IndexedDB/
```

#### Móvil Android
```
/data/data/com.android.chrome/app_chrome/Default/IndexedDB/
```

#### Móvil iOS (Safari)
```
[App Sandbox]/Library/WebKit/WebsiteData/IndexedDB/
```

### 3. Capacidad de Almacenamiento

| Dispositivo | Capacidad Típica | Límite Real |
|-------------|------------------|-------------|
| Desktop Chrome | ~60% del espacio libre | Varios GB |
| Mobile Chrome | ~20% del espacio libre | Cientos de MB |
| Firefox | Pregunta al usuario | Configurable |
| Safari | ~1 GB | Limitado |

**Ejemplo práctico:**
- PC con 100 GB libres → IndexedDB puede usar hasta ~60 GB
- Móvil con 10 GB libres → IndexedDB puede usar hasta ~2 GB

### 4. Estructura de IndexedDB

```javascript
// Cada app tiene su propia base de datos
Base de Datos: "comelo_session"
│
├── Object Store: "files" (como una tabla SQL)
│   ├── key: "/shopping-lists/list-1"
│   │   value: { path: "...", content: {...}, timestamp: 123 }
│   │
│   ├── key: "/shopping-lists/list-2"
│   │   value: { path: "...", content: {...}, timestamp: 456 }
│   │
│   └── ...
│
└── Object Store: "cache" (como otra tabla)
    ├── key: "recipes_cache"
    │   value: { data: [...], timestamp: 789 }
    │
    └── ...
```

## 🔐 Seguridad y Privacidad

### Separación por Origen (Same-Origin Policy)

Cada sitio web tiene su propia base de datos completamente aislada:

```
https://comelo.app
└── IndexedDB: comelo_session
    ├── Tus listas de compras
    ├── Tus recetas favoritas
    └── Tu configuración

https://otro-sitio.com
└── IndexedDB: otra_db
    ├── No puede ver tus datos de comelo.app
    └── Completamente separado
```

### ¿Pueden Robar mis Datos?

**NO**, si:
- ✅ Usas HTTPS (candado en la URL)
- ✅ No instalas extensiones maliciosas
- ✅ Mantienes tu navegador actualizado

**SÍ**, si:
- ❌ Alguien accede físicamente a tu PC desbloqueada
- ❌ Instalas extensiones sospechosas
- ❌ Tu PC tiene malware

## 📊 En Comelo.app: ¿Qué Guardamos?

### IndexedDB (via SessionService)

```typescript
// Base de datos: "comelo_session"

// Object Store: "files"
{
  path: "/backup/shopping-lists.json",
  content: [{ id: "...", name: "Lista 1", items: [...] }],
  timestamp: 1699999999999,
  metadata: { size: 1024, type: "backup" }
}

// Object Store: "cache"
{
  key: "recent_recipes",
  data: [{ id: "recipe-1", name: "Pollo al curry", ... }],
  timestamp: 1699999999999,
  expiresAt: 1700086399999
}
```

### LocalStorage

```javascript
// localStorage["comelo_shopping_lists"]
[
  {
    "id": "1699999999999-abc123",
    "name": "Compras de la semana",
    "items": [
      { "id": "...", "name": "Leche", "quantity": 2 }
    ],
    "createdAt": 1699999999999,
    "updatedAt": 1699999999999
  }
]

// localStorage["comelo_language"]
"es"

// localStorage["comelo_favorite_recipes"]
["recipe-1", "recipe-3", "recipe-7"]
```

### Service Worker Queue (IndexedDB)

```typescript
// Base de datos: "comelo_queue"

// Object Store: "events"
{
  id: 1,
  queueName: "shopping-lists",
  resourceKey: "list-123",
  payload: { id: "list-123", name: "Mi Lista", items: [...] },
  status: "pending",
  updatedAt: 1699999999999,
  coalescingTs: 1699999999999
}
```

## 🛠️ Cómo Ver tus Datos (DevTools)

### Chrome/Edge

1. **F12** → Pestaña **Application**
2. En el sidebar izquierdo:
   - **Local Storage** → `https://tu-dominio.com`
   - **IndexedDB** → `comelo_session` → `files` o `cache`
   - **IndexedDB** → `comelo_queue` → `events`

### Firefox

1. **F12** → Pestaña **Storage**
2. En el sidebar:
   - **Local Storage** → `https://tu-dominio.com`
   - **Indexed DB** → `comelo_session`

### Safari

1. **Cmd+Opt+I** → Pestaña **Storage**
2. Ver **Local Storage** e **IndexedDB**

## 🧹 Cómo Limpiar los Datos

### Desde DevTools (Recomendado para testing)

```javascript
// Consola del navegador

// Limpiar localStorage
localStorage.clear();

// Limpiar IndexedDB específica
indexedDB.deleteDatabase('comelo_session');
indexedDB.deleteDatabase('comelo_queue');

// Limpiar todo de Comelo.app
// Application → Clear storage → Clear site data
```

### Desde el Navegador

#### Chrome/Edge
1. **Configuración** → **Privacidad y seguridad**
2. **Borrar datos de navegación**
3. Seleccionar **Cookies y otros datos de sitios**
4. Elegir **Desde siempre**
5. **Borrar datos**

#### Firefox
1. **Configuración** → **Privacidad y seguridad**
2. **Cookies y datos del sitio** → **Administrar datos**
3. Buscar tu sitio → **Eliminar seleccionados**

## 💾 Cuándo Usar Cada Almacenamiento

### LocalStorage
**Usar para:**
- ✅ Configuraciones simples (idioma, tema)
- ✅ Datos pequeños (<5 MB total)
- ✅ Datos que se leen frecuentemente
- ✅ Strings simples

**NO usar para:**
- ❌ Archivos grandes (imágenes, videos)
- ❌ Datos complejos con relaciones
- ❌ Miles de registros

**Ejemplo en Comelo:**
```typescript
// ✅ BIEN
localStorage.setItem('comelo_language', 'es');
localStorage.setItem('comelo_shopping_lists', JSON.stringify(lists));

// ❌ MAL (muy grande)
localStorage.setItem('comelo_all_recipes', JSON.stringify(10000Recipes));
```

### IndexedDB
**Usar para:**
- ✅ Datos grandes (>5 MB)
- ✅ Muchos registros (cientos o miles)
- ✅ Datos estructurados complejos
- ✅ Archivos binarios (imágenes, videos)
- ✅ Colas de procesamiento

**NO usar para:**
- ❌ Configuraciones simples de 1-2 valores
- ❌ Datos que necesitas acceder síncronamente

**Ejemplo en Comelo:**
```typescript
// ✅ BIEN
await sessionService.saveFile('/backup/lists.json', allLists);
await sessionService.setCache('recipes_cache', recipesList, TTL_1_HOUR);

// ❌ MAL (muy simple para IndexedDB)
await sessionService.saveFile('/config/language', 'es');
```

## 🔄 Sincronización con Dropbox

IndexedDB se usa como **buffer intermedio** antes de sincronizar:

```
1. Usuario crea lista
   ↓
2. Guardar en localStorage (instantáneo)
   ↓
3. Encolar en IndexedDB (queue)
   ↓
4. Service Worker procesa cola
   ↓
5. Subir a Dropbox (cuando haya internet)
   ↓
6. Borrar de cola
```

**Ventaja:** Si no hay internet, los cambios se guardan en cola y se sincronizan después.

## 📱 Diferencias entre Dispositivos

### Desktop
- Mayor capacidad (~varios GB)
- Más estable
- No se borra automáticamente
- Mejor para desarrollo

### Mobile
- Menor capacidad (~cientos de MB)
- Puede borrarse si el sistema necesita espacio
- Más restrictivo
- Safari iOS es especialmente limitado

### PWA Instalada
- Mayor prioridad de almacenamiento
- Menos probable que se borren datos
- Puede solicitar almacenamiento persistente

```javascript
// Solicitar almacenamiento persistente (PWA)
if (navigator.storage && navigator.storage.persist) {
  const persistent = await navigator.storage.persist();
  console.log(`Persistent storage: ${persistent}`);
}
```

## 🐛 Problemas Comunes

### "QuotaExceededError"
**Causa:** Intentaste guardar más datos de los permitidos.

**Solución:**
```javascript
// Verificar espacio disponible
const estimate = await navigator.storage.estimate();
console.log(`Usado: ${estimate.usage} / ${estimate.quota}`);

// Limpiar datos antiguos
await sessionService.clearCache();
```

### Datos desaparecen al cerrar navegador
**Causa:** Modo privado/incógnito no persiste datos.

**Solución:** Usar ventana normal, no privada.

### No puedo ver mis datos en otro dispositivo
**Causa:** IndexedDB es local al dispositivo.

**Solución:** Implementar sincronización con Dropbox.

## 📚 Recursos Adicionales

- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Can I Use: IndexedDB](https://caniuse.com/indexeddb)
- [IDB Library](https://github.com/jakearchibald/idb) (la que usamos)

---

**Resumen:** IndexedDB es una base de datos que vive en tu navegador, guardada en tu disco duro, completamente privada y offline. Es perfecta para apps que necesitan funcionar sin internet. 🚀
