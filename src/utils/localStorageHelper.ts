export function saveToLocalStorage(key: string, data: any) {
  try {
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // Current time + 1 hour
    const serializedData = JSON.stringify({ data, expirationTime });
    window.localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Could not save to local storage', error);
  }
}

export function loadFromLocalStorage(key: string) {
  try {
    const serializedData = window.localStorage.getItem(key);
    if (serializedData === null) return null;
    const { data, expirationTime } = JSON.parse(serializedData);

    if (new Date().getTime() > expirationTime) {
      // Data has expired
      window.localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Could not load from local storage', error);
    return null;
  }
}
