import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RefObject } from "react";

interface CanvasState {
  canvasRef: RefObject<fabric.Canvas | null>;
  setCanvasRef: (canvasRef: RefObject<fabric.Canvas | null>) => void;
  clearCanvasRef: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set) => ({
      canvasRef: null as unknown as RefObject<fabric.Canvas | null>,
      setCanvasRef: (canvasRef) => set({ canvasRef }),
      clearCanvasRef: () => set({ canvasRef: null as unknown as RefObject<fabric.Canvas | null> }),
    }),
    {
      name: "canvas-store",
    }
  )
);
