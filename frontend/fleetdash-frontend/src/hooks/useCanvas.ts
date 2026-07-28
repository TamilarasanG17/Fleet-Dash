import { useRef } from "react";

function useCanvas() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    return {

        canvasRef

    };

}

export default useCanvas;