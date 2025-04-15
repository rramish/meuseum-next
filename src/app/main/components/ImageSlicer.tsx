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
  pieces: (ImagePiece | undefined)[];
  setPieces: Dispatch<SetStateAction<(ImagePiece | undefined)[]>>;
  selectedPiece: ImagePiece | undefined;
  setSelectedPiece: Dispatch<SetStateAction<ImagePiece | undefined>>;
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
}


const ImageSlicerWithDrawing : React.FC<ImageSlicerWithDrawingProps> = ({ pieces, setPieces, selectedPiece, setSelectedPiece, setShowConfirmModal }) => {

  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [loading, setLoading] = useState(false);
  const [fixedWidth, setFixedWidth] = useState(1200);
    const { setSelectedImages } = useSelectedImagesStore();


  // const FIXED_WIDTH = 1000;
  // const FIXED_WIDTH = window && window.innerWidth - 100 || 1200;
  const FIXED_HEIGHT = 800;

  const getDataFromBackend = async () => {
    setLoading(true);
    const resp = await axios.get("/api/drawing-image");
    console.log("resp is : ", resp.data);
    setPieces(resp.data.pieces);
    const current = resp.data.pieces.filter((f:ImagePiece) => f.username) 
    setSelectedImages(current);
    
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFixedWidth(window.innerWidth - 100);
    }
    const rows = 5;
    const cols = 4;
    const pieceWidth = fixedWidth / cols;
    const pieceHeight = FIXED_HEIGHT / rows;
    setW(`${pieceWidth}px`);
    setH(`${pieceHeight}px`);
    getDataFromBackend();
  }, [selectedPiece]);

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full flex flex-col justify-center items-center">
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(5, ${FIXED_HEIGHT / 5}px)`,
          gridTemplateColumns: `repeat(4, ${fixedWidth / 4}px)`,
          gap: "1px",
          height: `${FIXED_HEIGHT + 100}px`,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {pieces.map((piece, index) => (
          <div
            key={index}
            className={`text-center flex-1 bg-white rounded-lg group`}
          >
            <div
              className={`text-white absolute flex flex-col z-10 flex-1 p-2 ${
                !piece?.username
                  ? "hover:bg-[#00115A80]"
                  : "hover:bg-[#5F000280] rounded-lg bg-black/50"
              } hover:rounded-lg`}
              style={{ width: w, height: h }}
            >
              {piece?.updatedUrl && (
                <p
                  onClick={() => {
                    setSelectedPiece(piece);
                    setShowConfirmModal(true);
                  }}
                  className="cursor-pointer hover:scale-105 duration-300"
                >
                  Reset progress
                </p>
              )}
              <div
                className={`m-auto justify-center items-center hidden group-hover:flex`}
              >
                <Img.default
                  src={!piece?.username ? ICONS.ab_icon : ICONS.na1_icon}
                  alt=""
                  width={50}
                  height={50}
                  className=""
                />
              </div>
            </div>
            <Img.default
              onClick={() => {}}
              className="rounded-lg bg-black duration-300"
              src={
                piece && piece.updatedUrl ? piece.updatedUrl : piece!.dataUrl
              }
              alt={`Piece ${index + 1}`}
              width={100}
              height={100}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                cursor: "pointer",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlicerWithDrawing;
