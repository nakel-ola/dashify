import { useEffect, useState } from "react";

export function useScrollPosition(ref: HTMLElement | null) {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    if (ref) {
      const handleScroll = () => {
        // Get the scroll position of the div
        const scrollPosition = ref.scrollTop;

        setPos(scrollPosition);
      };

      // Add a scroll event listener to the div
      ref.addEventListener("scroll", handleScroll);

      // Cleanup: Remove the event listener when the component is unmounted
      return () => {
        ref.removeEventListener("scroll", handleScroll);
      };
    }
  }, [ref]); // Empty dependency array ensures that the effect runs only once on mount

  return pos;
}
