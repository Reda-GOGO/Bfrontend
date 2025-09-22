import { useEffect, useState } from "react";

/**
 * Custom hook for checking if a media query matches the current window size.
 * @param {string} query - The media query string (e.g., '(min-width: 768px)').
 * @returns {boolean} - True if the query matches, false otherwise.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);

    const updateMatch = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQueryList.addEventListener("change", updateMatch);

    // Set initial value
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener("change", updateMatch);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
