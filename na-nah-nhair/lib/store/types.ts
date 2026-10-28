export interface KeyValueStore {
  getJSON<T>(key: string): Promise<T | null>;
  setJSON(key: string, value: unknown): Promise<void>;
  getBinary(key: string): Promise<{ data: ArrayBuffer; contentType: string } | null>;
  setBinary(key: string, data: ArrayBuffer, contentType: string): Promise<void>;
  delete(key: string): Promise<void>;
  // Lecture-modification-écriture atomique : deux écritures simultanées ne s'écrasent jamais
  update<T>(key: string, fn: (current: T | null) => T): Promise<T>;
  // Clés commençant par `prefix`
  list(prefix: string): Promise<string[]>;
}
