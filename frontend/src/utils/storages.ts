import type { StorageKey, StorageType } from "../types/storage";

class StorageManager {
  private storage: globalThis.Storage;

  constructor(type: StorageType) {
    this.storage =
      type === 'local' ? window.localStorage : window.sessionStorage;
  }

  set<T>(key: StorageKey, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      this.storage.setItem(key, serialized);
    } catch (error) {
      console.error(`[Storage] Failed to set ${key}:`, error);
    }
  }

  get<T>(key: StorageKey): T | null {
    try {
      const item = this.storage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[Storage] Failed to get ${key}:`, error);
      return null;
    }
  }

  remove(key: StorageKey): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`[Storage] Failed to remove ${key}:`, error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('[Storage] Failed to clear storage:', error);
    }
  }

  has(key: StorageKey): boolean {
    return this.storage.getItem(key) !== null;
  }
}

export const localDB = new StorageManager('local');
export const sessionDB = new StorageManager('session');