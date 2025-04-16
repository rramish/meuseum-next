"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import * as Img from "next/image";
import Loader from "@/components/Loader";

import { ICONS } from "@/assets";
import { useSelectedImagesStore } from "@/store/imagesSessionStore";

interface ImagePiece {
  name: string;
  _id?: string;
  serial: number;
  dataUrl: string;
  username?: string;
  updatedUrl?: string;
}

interface ImageSlicerWithDrawingProps {
  loading: boolean;
  pieces: (ImagePiece | undefined)[];
  selectedPiece: ImagePiece | undefined;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
  setPieces: Dispatch<SetStateAction<(ImagePiece | undefined)[]>>;
  setSelectedPiece: Dispatch<SetStateAction<ImagePiece | undefined>>;
}

const ImageSlicerWithDrawing: React.FC<ImageSlicerWithDrawingProps> = ({
  pieces,
  loading,
  setPieces,
  setLoading,
  selectedPiece,
  setSelectedPiece,
  setShowConfirmModal,
}) => {
  const [, setW] = useState(100);
  const [, setH] = useState(100);
  const [, setFixedWidth] = useState(1200);
  const { setSelectedImages } = useSelectedImagesStore();

  const getImageDimensions = (dataUrl: string) => {
    console.log(setSelectedPiece);
    console.log(setShowConfirmModal);
    let width = 0;
    let height = 0;
    const img = new window.Image();
    img.src = dataUrl;
    img.onload = () => {
      width = img.naturalWidth;
      height = img.naturalHeight;

      setW(img.naturalWidth - 27);
      setH(img.naturalHeight);
    };
    console.log(width, height);
    img.onerror = () => {
      new Error("Failed to load image from dataUrl");
    };
  };

  const getDataFromBackend = async () => {
    setLoading(true);
    const resp = await axios.get("/api/drawing-image");
    setLoading(false);
    setPieces(resp.data.pieces);
    getImageDimensions(resp.data.pieces[0].dataUrl);
    const current = resp.data.pieces.filter((f: ImagePiece) => f.username);
    setSelectedImages(current);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFixedWidth(Math.min(window.innerWidth, 1100));
    }

    getDataFromBackend();
  }, [selectedPiece]);

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full flex flex-col justify-center items-center max-w-full">
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(5, 1fr)`,
          gridTemplateColumns: `repeat(4, 1fr)`,
          gap: "1px",
          margin: "0 auto",
          overflow: "hidden",
          width: "100%",
          height: "80vh",
        }}
      >
        {pieces.map((piece, index) => (
          <div
            key={index}
            className={`text-center flex-1 bg-white rounded-lg group relative`}
          >
            <div
              className={`text-white absolute flex flex-col z-10 flex-1 p-2 min-h-full min-w-full ${
                !piece?.username
                  ? "hover:bg-[#00115A80]"
                  : "hover:bg-[#5F000280] bg-[#00000050] rounded-lg"
              } hover:rounded-lg`}
            >
              {piece?.username && (
                <div className={`flex relative justify-between`}>
                  <Img.default
                    src={ICONS.dell_icon}
                    alt="undo icon"
                    width={30}
                    height={30}
                    style={{ objectFit: "contain" }}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPiece(piece);
                      setShowConfirmModal(true);
                    }}
                  />
                  <p>{piece.username}</p>
                </div>
              )}
            </div>
            <Img.default
              onClick={() => {}}
              className="rounded-lg bg-black duration-300"
              src={
                piece && piece.updatedUrl ? piece.updatedUrl : piece!.dataUrl
              }
              alt={`Piece ${index + 1}`}
              fill
              style={{
                display: "block",
                cursor: "pointer",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlicerWithDrawing;
