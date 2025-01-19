import { useState, useEffect } from 'react';

// Custom Hook: useProgress
export const useProgress = (): number => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simula un progreso dinámico
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0; // Reinicia el progreso si llega a 100%
        }
        return prevProgress + 5; // Incrementa el progreso en 5%
      });
    }, 1000); // Cada segundo

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  return progress;
};
