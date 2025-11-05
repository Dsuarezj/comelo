# Plan de Integración con Dropbox

Este documento detalla cómo implementar la sincronización con Dropbox OAuth 2.0 para backup personal y compartir datos entre dispositivos.

## 🎯 Objetivos

1. Autenticación opcional con Dropbox (OAuth 2.0)
2. Sincronización automática en background
3. Backup de listas de compras y perfil de usuario
4. Compartir listas entre usuarios (URLs públicas)
5. Resolución de conflictos (race conditions)
6. Funcionamiento offline con cola persistente

## 📋 Requisitos Previos

### Crear App en Dropbox

1. Ir a https://www.dropbox.com/developers/apps
2. Crear nueva app con:
   - API: Scoped access
   - Access type: App folder
   - Name: Comelo App
3. Configurar en Settings:
   - OAuth 2 Redirect URIs: `https://tu-dominio.com/auth/callback`
   - Permissions: `files.content.write`, `files.content.read`
4. Obtener:
   - App key
   - App secret

### Variables de Entorno

```env
# .env
VITE_DROPBOX_APP_KEY=your_app_key_here
VITE_DROPBOX_REDIRECT_URI=https://tu-dominio.com/auth/callback
```

## 🏗️ Arquitectura de Sincronización

```
┌─────────────────┐
│   React App     │
│  (UI Actions)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ShoppingList    │
│    Service      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐         ┌──────────────────┐
│  LocalStorage   │◄────────┤  SessionService  │
│   (Immediate)   │         │   (IndexedDB)    │
└────────┬────────┘         └──────────────────┘
         │
         ▼
┌─────────────────┐
│  QueueClient    │
│ (postMessage)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Service Worker  │
│  (Queue System) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Dropbox Content │
│      API        │
└─────────────────┘
```

## 📦 Implementación Paso a Paso

### 1. Instalar Dropbox SDK (Opcional)

```bash
# Si quieres usar el SDK oficial
npm install dropbox

# O implementar llamadas fetch directamente (recomendado para PWA)
# No se necesita instalación adicional
```

### 2. Crear DropboxAuthService

```typescript
// src/services/DropboxAuthService.ts

interface DropboxTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class DropboxAuthService {
  private readonly CLIENT_ID = import.meta.env.VITE_DROPBOX_APP_KEY;
  private readonly REDIRECT_URI = import.meta.env.VITE_DROPBOX_REDIRECT_URI;
  private readonly STORAGE_KEY = 'comelo_dropbox_auth';

  async initiateAuth(): Promise<void> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    sessionStorage.setItem('dropbox_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      response_type: 'code',
      redirect_uri: this.REDIRECT_URI,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      token_access_type: 'offline',
    });

    const authUrl = `https://www.dropbox.com/oauth2/authorize?${params}`;
    window.location.href = authUrl;
  }

  async handleCallback(code: string): Promise<DropboxTokens> {
    const codeVerifier = sessionStorage.getItem('dropbox_code_verifier');
    if (!codeVerifier) throw new Error('No code verifier found');

    const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: this.CLIENT_ID,
        code_verifier: codeVerifier,
        redirect_uri: this.REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error('Token exchange failed');
    }

    const data = await response.json();

    const tokens: DropboxTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    this.saveTokens(tokens);
    sessionStorage.removeItem('dropbox_code_verifier');

    return tokens;
  }

  async refreshAccessToken(): Promise<string> {
    const tokens = this.getTokens();
    if (!tokens?.refreshToken) throw new Error('No refresh token');

    const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokens.refreshToken,
        client_id: this.CLIENT_ID,
      }),
    });

    if (!response.ok) throw new Error('Token refresh failed');

    const data = await response.json();

    const newTokens: DropboxTokens = {
      accessToken: data.access_token,
      refreshToken: tokens.refreshToken,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    this.saveTokens(newTokens);
    return data.access_token;
  }

  getAccessToken(): string | null {
    const tokens = this.getTokens();
    if (!tokens) return null;

    if (Date.now() >= tokens.expiresAt - 60000) {
      this.refreshAccessToken().catch(console.error);
    }

    return tokens.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.getTokens();
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private saveTokens(tokens: DropboxTokens): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));
  }

  private getTokens(): DropboxTokens | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(hash));
  }

  private base64UrlEncode(array: Uint8Array): string {
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}

export const dropboxAuthService = new DropboxAuthService();
```

### 3. Crear QueueClient para Comunicación con SW

```typescript
// src/services/QueueClient.ts

type QueueEvent = {
  type: string;
  resourceKey?: string;
  data?: any;
};

class QueueClient {
  private static instance: QueueClient;
  private subscribers: Set<(event: QueueEvent) => void> = new Set();
  private sw: ServiceWorker | null = null;

  private constructor() {
    this.init();
  }

  static getInstance(): QueueClient {
    if (!QueueClient.instance) {
      QueueClient.instance = new QueueClient();
    }
    return QueueClient.instance;
  }

  private async init() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleMessage(event.data);
      });

      const registration = await navigator.serviceWorker.ready;
      this.sw = registration.active;
    }
  }

  private handleMessage(data: QueueEvent) {
    this.subscribers.forEach(callback => callback(data));
  }

  async enqueue(queueName: string, resourceKey: string, payload: any): Promise<void> {
    return this.sendMessage('ENQUEUE', { queueName, resourceKey, payload });
  }

  async status(resourceKey: string): Promise<any> {
    return this.sendMessage('STATUS', { resourceKey });
  }

  async setToken(token: string): Promise<void> {
    return this.sendMessage('SET_TOKEN', { token });
  }

  async start(): Promise<void> {
    return this.sendMessage('START', {});
  }

  async stop(): Promise<void> {
    return this.sendMessage('STOP', {});
  }

  async purgeResource(resourceKey: string): Promise<void> {
    return this.sendMessage('PURGE_RESOURCE', { resourceKey });
  }

  async clearAll(): Promise<void> {
    return this.sendMessage('CLEAR_ALL', {});
  }

  subscribe(callback: (event: QueueEvent) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private async sendMessage(type: string, data: any): Promise<any> {
    if (!this.sw) {
      throw new Error('Service Worker not available');
    }

    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();

      channel.port1.onmessage = (event) => {
        if (event.data.success !== undefined && !event.data.success) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data);
        }
      };

      this.sw.postMessage({ type, data }, [channel.port2]);
    });
  }
}

export const queueClient = QueueClient.getInstance();
```

### 4. Crear Hook useQueueResource

```typescript
// src/hooks/useQueueResource.ts

import { useEffect, useState } from 'react';
import { queueClient } from '../services/QueueClient';

type QueueState = 'IDLE' | 'PENDING' | 'PROCESSING' | 'ERROR';

export function useQueueResource(queueName: string, resourceKey: string) {
  const [state, setState] = useState<QueueState>('IDLE');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await queueClient.status(resourceKey);
        if (status.exists) {
          setState(status.status === 'processing' ? 'PROCESSING' : 'PENDING');
        } else {
          setState('IDLE');
        }
      } catch (error) {
        console.error('Error checking queue status:', error);
      }
    };

    checkStatus();

    const unsubscribe = queueClient.subscribe((event) => {
      if (event.resourceKey === resourceKey) {
        switch (event.type) {
          case 'queue:processing':
            setState('PROCESSING');
            break;
          case 'queue:processed':
            setState('IDLE');
            break;
          case 'queue:error':
            setState('ERROR');
            break;
          case 'queue:enqueued':
            setState('PENDING');
            break;
        }
      }
    });

    return () => unsubscribe();
  }, [queueName, resourceKey]);

  return { state };
}
```

### 5. Actualizar ShoppingListService con Sincronización

```typescript
// Agregar al ShoppingListService existente

import { queueClient } from './QueueClient';
import { dropboxAuthService } from './DropboxAuthService';

class ShoppingListService {
  // ... código existente ...

  private async syncToDropbox(list: ShoppingList): Promise<void> {
    if (!dropboxAuthService.isAuthenticated()) {
      return;
    }

    const token = dropboxAuthService.getAccessToken();
    if (!token) return;

    await queueClient.setToken(token);

    await queueClient.enqueue('shopping-lists', list.id, list);
  }

  async createList(name: string): Promise<ShoppingList> {
    await this.init();

    const newList: ShoppingList = {
      id: generateId(),
      name,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: this.lists.length,
    };

    this.lists.push(newList);
    this.save();

    await this.syncToDropbox(newList);

    return newList;
  }

  async updateList(id: string, updates: Partial<ShoppingList>): Promise<ShoppingList | null> {
    await this.init();

    const index = this.lists.findIndex(list => list.id === id);
    if (index === -1) return null;

    this.lists[index] = {
      ...this.lists[index],
      ...updates,
      id,
      updatedAt: Date.now(),
    };

    this.save();

    await this.syncToDropbox(this.lists[index]);

    return this.lists[index];
  }

  // ... resto del código ...
}
```

### 6. Crear Página de Callback OAuth

```typescript
// src/pages/DropboxCallbackPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { dropboxAuthService } from '../services/DropboxAuthService';
import { queueClient } from '../services/QueueClient';

export default function DropboxCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Autorización cancelada');
        setTimeout(() => navigate('/profile'), 3000);
        return;
      }

      if (!code) {
        setError('Código de autorización no recibido');
        setTimeout(() => navigate('/profile'), 3000);
        return;
      }

      try {
        const tokens = await dropboxAuthService.handleCallback(code);
        await queueClient.setToken(tokens.accessToken);
        await queueClient.start();

        navigate('/profile', { state: { dropboxConnected: true } });
      } catch (err) {
        console.error('Error handling Dropbox callback:', err);
        setError('Error al conectar con Dropbox');
        setTimeout(() => navigate('/profile'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-red-600 text-lg mb-2">❌ {error}</p>
            <p className="text-gray-600">Redirigiendo...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 text-lg">Conectando con Dropbox...</p>
          </>
        )}
      </div>
    </div>
  );
}
```

### 7. Actualizar App.tsx con Ruta de Callback

```typescript
import DropboxCallbackPage from './pages/DropboxCallbackPage';

function App() {
  // ... código existente ...

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth/callback" element={<DropboxCallbackPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
```

### 8. Actualizar ProfilePage con Botón de Conexión

```typescript
// src/pages/ProfilePage.tsx

import { dropboxAuthService } from '../services/DropboxAuthService';
import { queueClient } from '../services/QueueClient';

export default function ProfilePage() {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(dropboxAuthService.isAuthenticated());
  }, []);

  const handleConnect = () => {
    dropboxAuthService.initiateAuth();
  };

  const handleDisconnect = async () => {
    await queueClient.clearAll();
    dropboxAuthService.logout();
    setIsConnected(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 px-6 pt-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t('profile.title')}
      </h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('profile.sync')}
        </h2>

        {isConnected ? (
          <div>
            <p className="text-green-600 mb-4">✅ Conectado con Dropbox</p>
            <button
              onClick={handleDisconnect}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Desconectar
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              Sincroniza tus listas entre dispositivos con Dropbox
            </p>
            <button
              onClick={handleConnect}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Conectar con Dropbox
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 🧪 Testing de la Integración

### 1. Flujo de Autenticación

```typescript
// Test manual en DevTools Console

// 1. Iniciar autenticación
dropboxAuthService.initiateAuth();

// 2. Autorizar en Dropbox (se redirige)

// 3. Verificar tokens en callback
const tokens = dropboxAuthService.getTokens();
console.log('Tokens:', tokens);

// 4. Verificar que el Service Worker recibe el token
await queueClient.setToken(tokens.accessToken);
```

### 2. Test de Sincronización

```typescript
// Crear lista de prueba
const list = await shoppingListService.createList('Test de Sync');

// Verificar estado de cola
const status = await queueClient.status(list.id);
console.log('Queue status:', status);

// El Service Worker debería procesar y subir a Dropbox
```

### 3. Verificar en Dropbox

1. Ir a Dropbox web
2. Navegar a Apps/Comelo App
3. Verificar que existe `/shopping-lists/[list-id].json`
4. Abrir archivo y verificar estructura JSON

## 🐛 Resolución de Problemas

### Token Expirado
```typescript
// El servicio maneja automáticamente la renovación
// Pero puedes forzarla manualmente:
await dropboxAuthService.refreshAccessToken();
```

### Race Conditions
El Service Worker detecta automáticamente conflictos comparando timestamps:
```typescript
// En sw.js - ya implementado
if (remoteTimestamp > localTimestamp) {
  console.warn('Race condition detected, discarding local changes');
  return;
}
```

### Cola No Procesa
```typescript
// Verificar estado del Service Worker
const health = await queueClient.sendMessage('HEALTH_CHECK', {});
console.log('SW Health:', health);

// Reiniciar procesamiento
await queueClient.start();
```

## 📊 Monitoreo y Debugging

### DevTools Application Tab
- **Service Workers**: Ver estado y logs
- **IndexedDB**: comelo_queue → events
- **Local Storage**: comelo_dropbox_auth

### Logs Útiles
```typescript
// Habilitar logs detallados en Service Worker
// Editar public/sw.js
const DEBUG = true;

if (DEBUG) {
  console.log('[SW] Processing item:', item);
}
```

## 🔒 Consideraciones de Seguridad

1. **Tokens en LocalStorage**: Considera usar IndexedDB para mayor seguridad
2. **PKCE Flow**: Ya implementado con code_verifier y code_challenge
3. **HTTPS**: Obligatorio para Service Workers en producción
4. **Scope mínimo**: Solo `files.content.read/write` en App folder

## 📋 Checklist de Implementación

- [ ] Crear app en Dropbox Developers
- [ ] Configurar variables de entorno
- [ ] Implementar DropboxAuthService
- [ ] Implementar QueueClient
- [ ] Crear hook useQueueResource
- [ ] Actualizar ShoppingListService con sync
- [ ] Crear página de callback OAuth
- [ ] Agregar ruta en App.tsx
- [ ] Actualizar ProfilePage con botón de conexión
- [ ] Testing completo del flujo
- [ ] Verificar sincronización en Dropbox
- [ ] Implementar manejo de errores
- [ ] Agregar indicadores visuales de sync en UI

---

Con esta implementación tendrás sincronización completa y transparente con Dropbox, manteniendo el funcionamiento offline-first de la aplicación. 🚀
