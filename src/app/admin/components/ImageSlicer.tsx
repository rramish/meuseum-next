"use client";

import axios from "axios";
import * as Img from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ICONS } from "@/assets";
import Loader from "@/components/Loader";
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
  setPieces,
  selectedPiece,
  setSelectedPiece,
  setShowConfirmModal,
}) => {
  const { setSelectedImages } = useSelectedImagesStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDataFromBackend();
  }, [selectedPiece]);

  const getDataFromBackend = async () => {
    setLoading(true);
    const resp = await axios.get("/api/drawing-image");
    setLoading(false);
    setPieces(resp.data.pieces);
    const current = resp.data.pieces.filter((f: ImagePiece) => f.username);
    setSelectedImages(current);
  };

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
              className={`text-white absolute flex flex-col z-10 flex-1 p-2 min-h-full min-w-full max-w-full ${
                !piece?.username
                  ? "hover:bg-[#00115A80]"
                  : "hover:bg-[#5F000280] bg-[#00000050] rounded-lg"
              } hover:rounded-lg`}
            >
              {piece?.username && (
                <div className="flex relative justify-between max-w-full">
                  <Img.default
                    src={ICONS.reset}
                    alt="undo icon"
                    width={25}
                    height={25}
                    style={{ objectFit: "contain" }}
                    className="cursor-pointer hover:scale-105"
                    onClick={() => {
                      setSelectedPiece(piece);
                      setShowConfirmModal(true);
                    }}
                  />
                  <p className="max-w-full truncate ml-2">{piece.username}</p>
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
