import { useState, useEffect, RefObject } from 'react';

interface WindowPosition {
  x: number;
  y: number;
}

const useWindowPosition = (ref?: RefObject<HTMLElement>): WindowPosition => {
  const [windowPosition, setWindowPosition] = useState<WindowPosition>({ x: 0, y: 0 });

  const handleScroll = () => {
    if (ref && ref.current) {
      setWindowPosition({ x: ref.current.scrollLeft, y: ref.current.scrollTop });
    } else {
      setWindowPosition({ x: window.pageXOffset, y: window.pageYOffset });
    }
  };

  useEffect(() => {
    // Set initial position
    handleScroll();

    // Add event listener for window scroll or ref scroll
    if (ref && ref.current) {
      ref.current.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (ref && ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ref.current.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return windowPosition;
};

export default useWindowPosition;
