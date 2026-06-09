export const loadStorage = (key: string): string => localStorage.getItem(key) ?? '';

export const saveStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const clearStorage = (keys: readonly string[]): void => {
  keys.forEach((key) => localStorage.removeItem(key));
};
