import { useEffect, useState } from "react";

export function useIsPageBottomReached(offsetPx = 2) {
  const [isPageBottomReached, setIsPageBottomReached] = useState(false);

  useEffect(() => {
    const updateBottomState = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;

      setIsPageBottomReached(scrollBottom >= pageBottom - offsetPx);
    };

    updateBottomState();
    window.addEventListener("scroll", updateBottomState, { passive: true });
    window.addEventListener("resize", updateBottomState);

    return () => {
      window.removeEventListener("scroll", updateBottomState);
      window.removeEventListener("resize", updateBottomState);
    };
  }, [offsetPx]);

  return isPageBottomReached;
}
