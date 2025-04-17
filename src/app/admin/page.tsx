"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Header from "./components/Header";
import { useImageStorage } from "@/store/imageStore";
import { Uploadmodal } from "./components/Uploadmodal";
import { ConfirmModal } from "./components/ConfirmModal";
import ImageSlicerWithDrawing from "./components/ImageSlicer";

interface ImagePiece {
  name: string;
  _id?: string;
  serial: number;
  dataUrl: string;
  username?: string;
  updatedUrl?: string;
}

const Main = () => {
  const router = useRouter();
  const { setfinalimage } = useImageStorage();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pieces, setPieces] = useState<Partial<ImagePiece[]>>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<ImagePiece>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        return router.push("/login");
      }
    }
  }, []);

  async function reconstructImage({
    download,
  }: {
    download: boolean;
  }): Promise<string | void> {
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
    if (!download) {
      setfinalimage(dataUrl);
      router.push(`/reconstructed`);
    }
    return dataUrl;
  }

  const handleResetProgress = async () => {
    setLoading(true);
    const item = selectedPiece!;
    const obj = {
      pieceId: item._id,
    };
    const resp = await axios.post("/api/drawing-image/reset-progress", obj);
    // console.log("response form reset is : ", resp.data);
    setSelectedPiece(undefined);
    setShowConfirmModal(false);
    setLoading(false);
  };

  return (
    <div className="mx-4 max-w-full bg-white pb-2">
      <Header
        onPreview={() => {
          reconstructImage({ download: false });
        }}
        onNewDrawing={() => {
          setShowModal(true);
          // console.log("here")
        }}
        onConstruct={() => reconstructImage({ download: true })}
      />
      <ImageSlicerWithDrawing
        pieces={pieces}
        loading={loading}
        setPieces={setPieces}
        setLoading={setLoading}
        selectedPiece={selectedPiece}
        setSelectedPiece={setSelectedPiece}
        setShowConfirmModal={setShowConfirmModal}
      />
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <Uploadmodal
            onclose={() => {
              setShowModal(false);
            }}
          />
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <ConfirmModal
            loading={loading}
            onclose={() => {
              setShowConfirmModal(false);
            }}
            onSubmit={() => {
              handleResetProgress();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Main;
