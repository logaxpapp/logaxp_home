// src/hooks/useWindowWidth.ts
import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWidth(window.innerWidth), 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
}

export default useWindowWidth;
