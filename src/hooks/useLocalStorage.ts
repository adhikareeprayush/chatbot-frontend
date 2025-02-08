import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialValueRef = useRef(initialValue);
  
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValueRef.current;
    } catch {
      console.warn(`Error reading localStorage key "${key}"`);
      return initialValueRef.current;
    }
  });

  // Return a wrapped version of useState's setter function
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Only update if value has changed
      if (JSON.stringify(valueToStore) !== JSON.stringify(storedValue)) {
        // Save state
        setStoredValue(valueToStore);
        
        // Save to localStorage
        if (JSON.stringify(valueToStore) === JSON.stringify(initialValueRef.current)) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Subscribe to changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValueRef.current;
          if (JSON.stringify(newValue) !== JSON.stringify(storedValue)) {
            setStoredValue(newValue);
          }
        } catch {
          console.warn(`Error parsing localStorage value for key "${key}"`);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}