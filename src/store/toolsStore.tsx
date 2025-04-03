import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ToolState {
  eraser: boolean;
  setEraser: (eraser:boolean) => void;
}

export const useToolsStore = create<ToolState>()(
  persist(
    (set) => ({
      eraser: false,
      setEraser: (eraser) => set({ eraser })
    }),
    {
      name: "tools-store",
    }
  )
);
