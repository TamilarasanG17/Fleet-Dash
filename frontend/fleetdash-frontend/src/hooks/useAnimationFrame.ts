import { useEffect, useRef } from "react";

function useAnimationFrame(callback: () => void) {
  const requestRef = useRef<number | null>(null);

  const animate = () => {
    callback();
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback]);
}

export default useAnimationFrame;