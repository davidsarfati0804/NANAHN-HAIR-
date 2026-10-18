export interface KeyValueStore {
  getJSON<T>(key: string): Promise<T | null>;
  setJSON(key: string, value: unknown): Promise<void>;
  getBinary(key: string): Promise<{ data: ArrayBuffer; contentType: string } | null>;
  setBinary(key: string, data: ArrayBuffer, contentType: string): Promise<void>;
  delete(key: string): Promise<void>;
}
