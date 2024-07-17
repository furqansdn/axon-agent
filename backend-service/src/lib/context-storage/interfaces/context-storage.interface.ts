export const ContextStorageServiceKey = Symbol();

export default interface AbstractContextStorageService {
  setContextId(contextId: string): void;
  getContextId(): string;
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
}
