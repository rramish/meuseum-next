import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ImageState {
  image: File | null;
  setImage: (image: File) => void;
  clearImage: () => void;
  imagePiece: string | null;
  setImagePiece: (imagePiece: string) => void;
  clearImagePiece: () => void;
}

export const useImageStorage = create<ImageState>()(
  persist(
    (set) => ({
      image: null,
      setImage: (image) => set({ image }),
      clearImage: () => set({ image: null }),

      imagePiece: null,
      setImagePiece: (imagePiece) => set({ imagePiece }),
      clearImagePiece: () => set({ imagePiece: null }),
    }),
    {
      name: "image-store",
    }
  )
);
