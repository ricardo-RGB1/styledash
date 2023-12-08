
import { useEffect, useState } from "react";

/**
 * Custom hook that returns the origin of the current window location.
 * If the window object is not available (e.g., server-side rendering), it returns an empty string.
 * @returns The origin of the current window location or an empty string.
 */
export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return ''
  }

  return origin;
};


 


 