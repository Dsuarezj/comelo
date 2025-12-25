const BUILD_TIMESTAMP = '1766681819';
const CACHE_VERSION = `v-${BUILD_TIMESTAMP}`;
const APP_SHELL_CACHE = `comelo-app-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `comelo-runtime-${CACHE_VERSION}`;

const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
];

const NAVIGATION_FALLBACK = '/index.html';

const DB_NAME = 'comelo_queue';
const DB_VERSION = 1;
const QUEUE_STORE = 'events';

let db = null;

async function openDatabase() {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(QUEUE_STORE)) {
        const objectStore = database.createObjectStore(QUEUE_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        objectStore.createIndex('queueName', 'queueName', { unique: false });
        objectStore.createIndex('resourceKey', 'resourceKey', { unique: false });
        objectStore.createIndex('status', 'status', { unique: false });
      }
    };
  });
}

class QueueSystem {
  constructor() {
    this.processing = false;
    this.token = null;
    this.processors = new Map();
  }

  async enqueue(queueName, resourceKey, payload) {
    const database = await openDatabase();
    const transaction = database.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);

    const index = store.index('resourceKey');
    const existingRequest = index.get(resourceKey);

    return new Promise((resolve, reject) => {
      existingRequest.onsuccess = () => {
        const existing = existingRequest.result;

        if (existing) {
          const updateRequest = store.put({
            ...existing,
            payload,
            updatedAt: Date.now(),
            coalescingTs: Date.now(),
          });

          updateRequest.onsuccess = () => {
            this.notifyClients({ type: 'queue:updated', resourceKey });
            resolve({ updated: true });
          };
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          const addRequest = store.add({
            queueName,
            resourceKey,
            payload,
            status: 'pending',
            updatedAt: Date.now(),
            coalescingTs: Date.now(),
          });

          addRequest.onsuccess = () => {
            this.notifyClients({ type: 'queue:enqueued', resourceKey });
            resolve({ added: true });
          };
          addRequest.onerror = () => reject(addRequest.error);
        }
      };

      existingRequest.onerror = () => reject(existingRequest.error);
    });
  }

  async start() {
    if (this.processing) return;

    this.processing = true;
    this.notifyClients({ type: 'queue:processing-start' });

    await this.processQueue();
  }

  async processQueue() {
    if (!this.processing) return;

    const database = await openDatabase();
    const transaction = database.transaction([QUEUE_STORE], 'readonly');
    const store = transaction.objectStore(QUEUE_STORE);
    const index = store.index('status');
    const request = index.getAll('pending');

    return new Promise((resolve) => {
      request.onsuccess = async () => {
        const items = request.result;

        if (items.length === 0) {
          this.processing = false;
          this.notifyClients({ type: 'queue:drained' });
          resolve();
          return;
        }

        items.sort((a, b) => b.updatedAt - a.updatedAt);

        const item = items[0];
        const processor = this.processors.get(item.queueName);

        if (!processor) {
          console.warn(`No processor registered for queue: ${item.queueName}`);
          await this.removeItem(item.id);
          resolve();
          return;
        }

        try {
          this.notifyClients({
            type: 'queue:processing',
            resourceKey: item.resourceKey,
          });

          await this.updateItemStatus(item.id, 'processing');

          await processor(item, { token: this.token });

          await this.removeItem(item.id);

          this.notifyClients({
            type: 'queue:processed',
            resourceKey: item.resourceKey,
          });

          setTimeout(() => this.processQueue(), 100);
        } catch (error) {
          console.error('Error processing queue item:', error);

          await this.updateItemStatus(item.id, 'error');

          this.notifyClients({
            type: 'queue:error',
            resourceKey: item.resourceKey,
            error: error.message,
          });

          this.processing = false;
        }

        resolve();
      };

      request.onerror = () => {
        console.error('Error reading queue:', request.error);
        this.processing = false;
        resolve();
      };
    });
  }

  async updateItemStatus(id, status) {
    const database = await openDatabase();
    const transaction = database.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const getRequest = store.get(id);

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (!item) {
          resolve();
          return;
        }

        const updateRequest = store.put({
          ...item,
          status,
          updatedAt: Date.now(),
        });

        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async removeItem(id) {
    const database = await openDatabase();
    const transaction = database.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async status(resourceKey) {
    const database = await openDatabase();
    const transaction = database.transaction([QUEUE_STORE], 'readonly');
    const store = transaction.objectStore(QUEUE_STORE);
    const index = store.index('resourceKey');
    const request = index.get(resourceKey);

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const item = request.result;
        resolve({
          exists: !!item,
          status: item?.status,
          processing: this.processing,
        });
      };

      request.onerror = () => resolve({ exists: false });
    });
  }

  setToken(token) {
    this.token = token;
  }

  stop() {
    this.processing = false;
    this.notifyClients({ type: 'queue:stopped' });
  }

  registerProcessor(queueName, fn) {
    this.processors.set(queueName, fn);
  }

  async purgeResource(resourceKey) {
    const database = await openDatabase();
    const transaction = database.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const index = store.index('resourceKey');
    const request = index.getAllKeys(resourceKey);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const keys = request.result;
        const deletePromises = keys.map(
          key =>
            new Promise((res, rej) => {
              const delRequest = store.delete(key);
              delRequest.onsuccess = () => res();
              delRequest.onerror = () => rej(delRequest.error);
            })
        );

        Promise.all(deletePromises).then(resolve).catch(reject);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async clearAll() {
    const database = await openDatabase();
    const transaction = database.transaction([QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  notifyClients(message) {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage(message);
      });
    });
  }
}

const queue = new QueueSystem();
self.NSQueue = queue;

queue.registerProcessor('shopping-lists', async (item, ctx) => {
  if (!ctx.token) {
    throw new Error('No authentication token available');
  }

  const path = `/comelo/shopping-lists/${item.resourceKey}.json`;
  const content = JSON.stringify(item.payload, null, 2);

  const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ctx.token}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path,
        mode: 'overwrite',
        autorename: false,
        mute: true,
      }),
    },
    body: content,
  });

  if (!response.ok) {
    throw new Error(`Dropbox upload failed: ${response.statusText}`);
  }

  return await response.json();
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(cache => {
      return cache.addAll(APP_SHELL_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('comelo-') && name !== APP_SHELL_CACHE && name !== RUNTIME_CACHE)
          .map(name => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION
          });
        });
      });
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin === location.origin) {
    if (APP_SHELL_URLS.some(shellUrl => url.pathname === shellUrl || url.pathname === '/' + shellUrl)) {
      event.respondWith(
        fetch(request)
          .then(response => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(APP_SHELL_CACHE).then(cache => {
                cache.put(request, responseToCache);
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
    } else if (request.destination === 'script' || request.destination === 'style' || url.pathname.match(/\.(js|css)$/)) {
      event.respondWith(
        fetch(request)
          .then(response => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(RUNTIME_CACHE).then(cache => {
                cache.put(request, responseToCache);
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
    } else if (request.mode === 'navigate') {
      event.respondWith(
        fetch(request)
          .catch(() => {
            return caches.match(NAVIGATION_FALLBACK);
          })
      );
    } else {
      event.respondWith(
        fetch(request).catch(() => {
          return caches.match(request);
        })
      );
    }
  }
});

self.addEventListener('message', event => {
  const { type, data } = event.data;

  switch (type) {
    case 'ENQUEUE':
      queue.enqueue(data.queueName, data.resourceKey, data.payload).then(() => {
        event.ports[0].postMessage({ success: true });
        queue.start();
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;

    case 'STATUS':
      queue.status(data.resourceKey).then(status => {
        event.ports[0].postMessage(status);
      });
      break;

    case 'SET_TOKEN':
      queue.setToken(data.token);
      event.ports[0].postMessage({ success: true });
      break;

    case 'START':
      queue.start();
      event.ports[0].postMessage({ success: true });
      break;

    case 'STOP':
      queue.stop();
      event.ports[0].postMessage({ success: true });
      break;

    case 'PURGE_RESOURCE':
      queue.purgeResource(data.resourceKey).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    case 'CLEAR_ALL':
      queue.clearAll().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    case 'HEALTH_CHECK':
      event.ports[0].postMessage({
        version: CACHE_VERSION,
        buildTimestamp: BUILD_TIMESTAMP,
        active: true,
        processing: queue.processing,
      });
      break;

    case 'SKIP_WAITING':
      self.skipWaiting();
      event.ports[0].postMessage({ success: true });
      break;
  }
});
