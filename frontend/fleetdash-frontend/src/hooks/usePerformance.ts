import { useRef } from "react";

function usePerformance() {
  const fps = useRef(0);
  const lastFrame = useRef(performance.now());

  const updateFPS = () => {
    const now = performance.now();
    fps.current = Math.round(1000 / (now - lastFrame.current));
    lastFrame.current = now;
  };

  return {
    fps,
    updateFPS,
  };
}

export default usePerformance;