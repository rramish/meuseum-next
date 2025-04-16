"use client";
import React, { useState } from "react";
import axios from "axios";
import * as Img from "next/image";
import Header from "./components/Header";
import ImageSlicerWithDrawing from "./components/ImageSlicer";

import { ICONS } from "@/assets";
import { useRouter } from "next/navigation";
import { useImageStorage } from "@/store/imageStore";
import { Uploadmodal } from "./components/Uploadmodal";
import { ConfirmModal } from "./components/ConfirmModal";

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
  const [selectedPiece, setSelectedPiece] = useState<ImagePiece>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false); 
  const {setfinalimage} = useImageStorage();

  async function reconstructImage({download}:{download:boolean}): Promise<string | void> {
    const filename = "reconstructed_image.png";
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

    const pieceWidth = 200;
    const pieceHeight = 160;
    const canvasWidth = (maxCol + 2) * pieceWidth;
    const canvasHeight = (maxRow + 2) * pieceHeight;

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
    if(!download){
      setfinalimage(dataUrl);
      router.push(`/reconstructed`);
    }
    return dataUrl;
  }

  const router = useRouter();

  const handleResetProgress = async () => {
    setLoading(true);
    const item = selectedPiece!;
    const obj = {
      pieceId: item._id,
    };
    const resp = await axios.post("/api/drawing-image/reset-progress", obj);
    console.log("response form reset is : ", resp.data);
    // await slicerRef.current?.getDataFromBackend();
    setSelectedPiece(undefined);
    setShowConfirmModal(false);
    setLoading(false);
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (!token) {
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
      onPreview={() =>{reconstructImage({download: false})}}
        onNewDrawing={() => {
          setShowModal(true);
        }}
        onConstruct={() => reconstructImage({download: true})}
      />
      {showModal && (
        <>
          <div className="h-full bg-black/70 absolute top-0 left-0 w-full z-0" />
          <div className="h-[800px]">
            <Uploadmodal
              onclose={() => {
                setShowModal(false)
              }}
            />
          </div>
        </>
      )}

      {showConfirmModal && (
        <>
          <div className="h-[1000px] bg-black/70 absolute top-0 left-0 w-full z-0" />
          <div className="h-[750px]">
            <ConfirmModal
              loading={loading}
              onclose={() => {
                setShowConfirmModal(false);
              }}
              onSubmit={() => {
                if(loading)return;
                handleResetProgress();
              }}
            />
          </div>
        </>
      )}

      {!showModal && (
        <div className="w-full mb-8 py-4 relative">
          <ImageSlicerWithDrawing
            pieces={pieces}
            setPieces={setPieces}
            selectedPiece={selectedPiece}
            setSelectedPiece={setSelectedPiece}
            setShowConfirmModal={setShowConfirmModal}
          />
        </div>
      )}
    </div>
  );
};

export default Main;
