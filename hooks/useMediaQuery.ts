import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure window is defined for SSR safety
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      // Set the initial state
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      // Listener for changes
      const listener = () => {
        setMatches(media.matches);
      };
      media.addEventListener('change', listener);
      return () => {
        media.removeEventListener('change', listener);
      };
    }
  }, [matches, query]);

  return matches;
}

export default useMediaQuery;
