import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedImagesState {
  selectedImages: number[];
  setSelectedImages: (selectedImages: number[]) => void;
  clearSelectedImages: () => void;
}

export const useSelectedImagesStore = create<SelectedImagesState>()(
  persist(
    (set) => ({
      selectedImages: [],
      setSelectedImages: (selectedImages) => set({ selectedImages }),
      clearSelectedImages: () => set({ selectedImages: [] }),
    }),
    {
      name: "selected-images-store",
    }
  )
);
