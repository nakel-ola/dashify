import { useEffect } from 'react';

const useEffectOnce = (effect: () => void | (() => void)) => {
  useEffect(() => {
    const cleanup = effect();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);
};

export { useEffectOnce };
