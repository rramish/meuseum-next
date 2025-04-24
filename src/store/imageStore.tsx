import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ImageState {
  image: File | null;
  setImage: (image: File) => void;
  clearImage: () => void;

  finalimage: string | null;
  setfinalimage: (image: string) => void;

  originalSessionImageURL: string | null;
  setOriginalSessionImageURL: (image: string) => void;

  submissionUrl: string | null;
  setSubmissionUrl: (submissionUrl: string) => void;

  imageBackend: string | null;
  setImageBackend: (imageBackend: string) => void;
  clearImageBackend: () => void;

  imageFolderName: string | null;
  setImageFolderName: (imageBackend: string) => void;
  clearImageFolderName: () => void;


  imagePiece: ImagePiece | null;
  setImagePiece: (imagePiece: ImagePiece) => void;
  clearImagePiece: () => void;
}

interface ImagePiece {
  dataUrl: string;
  name: string;
  sessionId: string;
  updatedUrl: string | null;
  username: string | null;
  _id?:string
}

export const useImageStorage = create<ImageState>()(
  persist(
    (set) => ({
      image: null,
      setImage: (image) => set({ image }),
      clearImage: () => set({ image: null }),

      finalimage: null,
      setfinalimage: (finalimage) => set({ finalimage }),

      originalSessionImageURL: null,
      setOriginalSessionImageURL: (originalSessionImageURL) => set({ originalSessionImageURL }),

      submissionUrl: null,
      setSubmissionUrl: (submissionUrl) => set({ submissionUrl }),

      imageBackend: null,
      setImageBackend: (imageBackend) => set({ imageBackend }),
      clearImageBackend: () => set({ imageBackend: null }),

      imageFolderName: null,
      setImageFolderName: (imageFolderName) => set({ imageFolderName }),
      clearImageFolderName: () => set({ imageFolderName: null }),

      imagePiece: null,
      setImagePiece: (imagePiece) => set({ imagePiece }),
      clearImagePiece: () => set({ imagePiece: null }),
    }),
    {
      name: "image-store",
    }
  )
);
