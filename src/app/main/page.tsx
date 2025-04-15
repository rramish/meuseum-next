"use client";
import React, { useState } from "react";
import * as Img from "next/image";
import Header from "./components/Header";
import ImageSlicerWithDrawing from "./components/ImageSlicer";

import { ICONS } from "@/assets";
import { Uploadmodal } from "./components/Uploadmodal";
// import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface ImagePiece {
  name: string;
  _id?: string;
  serial: number;
  dataUrl: string;
  username?: string;
  updatedUrl?: string;
}

const Main = () => {

  const [showModal, setShowModal] = useState(false);
  const [pieces, setPieces] = useState<Partial<ImagePiece[]>>([]);
  // const {token} = useAuthStore();

  async function reconstructImage(): Promise<string | void> {
    const filename = "reconstructed_image.png";
    const download = true;
    const imagePieces = pieces;

    const pieceMap: { [key: string]: ImagePiece } = {};
    let maxRow = 0;
    let maxCol = 0;

    imagePieces.forEach((piece) => {
      const match = piece!.name.match(/piece_(\d+)_(\d+)\.png/);
      if (match) {
        const row = parseInt(match[1], 10);
        const col = parseInt(match[2], 10);
        pieceMap[`${row}_${col}`] = piece!;
        maxRow = Math.max(maxRow, row);
        maxCol = Math.max(maxCol, col);
      }
    });

    const pieceWidth = 500;
    const pieceHeight = 300;
    const canvasWidth = (maxCol + 1) * pieceWidth;
    const canvasHeight = (maxRow + 1) * pieceHeight;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    await Promise.all(
      Object.entries(pieceMap).map(async ([key, piece]) => {
        const [row, col] = key.split("_").map(Number);
        const url = piece.updatedUrl || piece.dataUrl;

        const img = new Image();
        img.crossOrigin = "Anonymous";

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });

        const x = col * pieceWidth;
        const y = row * pieceHeight;
        ctx.drawImage(img, x, y, pieceWidth, pieceHeight);
      })
    );

    const dataUrl = canvas.toDataURL("image/png");

    if (download) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    return dataUrl;
  }
  const router = useRouter();

  if(typeof window !== "undefined"){
    const token = localStorage.getItem("token");
    if(!token){
      return router.push("/login");
    }
  }
  

  return (
    <div className="flex-1">
      <Img.default
        src={ICONS.bg_image}
        alt=""
        width={100}
        height={100}
        className={`absolute ${
          showModal && "h-full"
        } -z-10 top-0 left-0 w-full min-h-screen`}
      />
      <Header
        onNewDrawing={() => {
          setShowModal(true);
        }}
        onConstruct={reconstructImage}
      />
      {showModal && (
        <>
          <div className="h-full bg-black/70 absolute top-0 left-0 w-full z-0" />
          <div className="h-[800px]">
            <Uploadmodal
              onclose={() => {
                setShowModal(false);
              }}
            />
          </div>
        </>
      )}
      {!showModal && (
        <div className="w-full mb-8 py-4 relative">
          <ImageSlicerWithDrawing setPieces={setPieces} pieces={pieces} />
        </div>
      )}
    </div>
  );
};

export default Main;
