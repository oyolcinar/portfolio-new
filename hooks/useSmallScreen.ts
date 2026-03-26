import { useState, useEffect } from 'react';

export function useSmallScreen(breakpoint: number = 600) {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsSmall(mq.matches);

    function handler(e: MediaQueryListEvent) {
      setIsSmall(e.matches);
    }

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isSmall;
}
