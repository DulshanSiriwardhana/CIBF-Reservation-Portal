export interface StorageKeys {
  USER: 'user';
  ROLE: 'role';
}

export type StorageType = 'local' | 'session';
export type StorageKey = keyof StorageKeys;