import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after the value
 * has stopped changing for `delay` ms. Useful for search inputs.
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel if value changes before delay
  }, [value, delay]);

  return debounced;
}