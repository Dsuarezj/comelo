import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SessionDB extends DBSchema {
  files: {
    key: string;
    value: {
      path: string;
      content: any;
      timestamp: number;
      metadata?: Record<string, any>;
    };
  };
  cache: {
    key: string;
    value: {
      data: any;
      timestamp: number;
      expiresAt?: number;
    };
  };
  translations: {
    key: string;
    value: {
      data: any;
      version: string;
      timestamp: number;
    };
  };
}

class SessionService {
  private db: IDBPDatabase<SessionDB> | null = null;
  private readonly DB_NAME = 'comelo_session';
  private readonly DB_VERSION = 2;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<SessionDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'path' });
        }
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache');
        }
        if (!db.objectStoreNames.contains('translations')) {
          db.createObjectStore('translations');
        }
      },
    });
  }

  async saveFile(path: string, content: any, metadata?: Record<string, any>): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.put('files', {
      path,
      content,
      timestamp: Date.now(),
      metadata,
    });
  }

  async readFile(path: string): Promise<any | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const file = await this.db.get('files', path);
    return file?.content || null;
  }

  async deleteFile(path: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.delete('files', path);
  }

  async listFiles(prefix?: string): Promise<string[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const files = await this.db.getAll('files');
    return files
      .filter(f => !prefix || f.path.startsWith(prefix))
      .map(f => f.path);
  }

  async setCache(key: string, data: any, ttl?: number): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.put('cache', {
      data,
      timestamp: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : undefined,
    }, key);
  }

  async getCache(key: string): Promise<any | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const cached = await this.db.get('cache', key);
    if (!cached) return null;

    if (cached.expiresAt && Date.now() > cached.expiresAt) {
      await this.db.delete('cache', key);
      return null;
    }

    return cached.data;
  }

  async clearCache(): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.clear('cache');
  }

  async clearAll(): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.clear('files');
    await this.db.clear('cache');
    await this.db.clear('translations');
  }

  async getTranslation(key: string): Promise<{ data: any; version: string } | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const translation = await this.db.get('translations', key);
    if (!translation) return null;

    return { data: translation.data, version: translation.version };
  }

  async setTranslation(key: string, data: any, version: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.put('translations', {
      data,
      version,
      timestamp: Date.now(),
    }, key);
  }

  async deleteTranslation(key: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.delete('translations', key);
  }

  async listTranslations(prefix?: string): Promise<string[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const keys = await this.db.getAllKeys('translations');
    if (!prefix) return keys as string[];

    return (keys as string[]).filter(k => k.startsWith(prefix));
  }

  async clearTranslations(): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.clear('translations');
  }
}

export const sessionService = new SessionService();
