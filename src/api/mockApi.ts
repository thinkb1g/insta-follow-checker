// This file simulates a backend API.
// In a real application, these functions would make network requests (e.g., using fetch) to a real server.
// For this MVP, we use localStorage as our "database" to persist data across sessions.

const STORAGE_KEY = 'targetList';
const NETWORK_DELAY = 500; // 500ms delay to simulate network latency

/**
 * Simulates fetching the target list from the server.
 * @returns A promise that resolves with the list of target Instagram IDs.
 */
export const getTargetList = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        const list = item ? JSON.parse(item) : [];
        resolve(list);
      } catch (error) {
        console.error("Mock API: Failed to parse targetList from localStorage", error);
        reject(new Error("Could not retrieve data from the server."));
      }
    }, NETWORK_DELAY);
  });
};

/**
 * Simulates updating the target list on the server.
 * @param list The new list of target Instagram IDs to save.
 * @returns A promise that resolves when the update is complete.
 */
export const updateTargetList = (list: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        resolve();
      } catch (error) {
        console.error("Mock API: Failed to save targetList to localStorage", error);
        reject(new Error("Could not save data to the server."));
      }
    }, NETWORK_DELAY);
  });
};