export const setStorageWithExpiry = (key: string, value: object, ttl: number) => {
  const now = new Date();
  const item = {
    value: value,
    // ttl is in minutes
    expiry: now.getTime() + ttl * 1000 * 60
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getStorageWithExpiry = (key: string): object | null => {
  const itemStr = localStorage.getItem(key);

  // Non existing key case
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();

  // Expired case
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};
