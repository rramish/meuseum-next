"use client";

import axios from "axios";
import * as Img from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Loader from "@/components/Loader";
import Header from "../../components/Header";
import { useImageStorage } from "@/store/imageStore";
import { Uploadmodal } from "../../components/Uploadmodal";
import { ConfirmModal } from "../../components/ConfirmModal";

interface ImagePiece {
  name: string;
  _id?: string;
  serial: number;
  dataUrl: string;
  username?: string;
  updatedUrl?: string;
  updatedAt?: string;
}

const Session = () => {
  const router = useRouter();
  const params = useParams();
  const { sessionId } = params;
  const { setfinalimage, setOriginalSessionImageURL } = useImageStorage();

  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pieces, setPieces] = useState<Partial<ImagePiece[]>>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showResetConfirmationModal, setShowResetConfirmationModal] =
    useState(false);
  const [selectedPiece, setSelectedPiece] = useState<ImagePiece | undefined>();
  const [showPiecePreviewModal, setShowPiecePreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      } else {
        getDataFromBackend();
      }
    }
  }, [sessionId, router]);

  const getDataFromBackend = async () => {
    try {
      if (!sessionId) {
        setError("Session ID is missing.");
        return;
      }
      setLoading(true);
      const resp = await axios.get(
        `/api/drawing-image?sessionId=${sessionId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPieces(resp.data.pieces);
      if (resp.data.originalImageUrl) {
        setOriginalSessionImageURL(resp.data.originalImageUrl);
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("error is : ", error);
      setError(
        error.response?.data?.error ||
          "Failed to fetch data from the server. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  async function reconstructImage({
    download,
  }: {
    download: boolean;
  }): Promise<string | void> {
    try {
      const filename = "reconstructed_image.png";
      const imagePieces = pieces;
      const pieceMap: { [key: string]: ImagePiece } = {};
      let minRow = Infinity;
      let minCol = Infinity;
      let maxRow = -Infinity;
      let maxCol = -Infinity;

      imagePieces.forEach((piece) => {
        const match = piece!.name.match(/piece_(\d+)_(\d+)\.png/);
        if (match) {
          const row = parseInt(match[1], 10);
          const col = parseInt(match[2], 10);
          pieceMap[`${row}_${col}`] = piece!;
          minRow = Math.min(minRow, row);
          minCol = Math.min(minCol, col);
          maxRow = Math.max(maxRow, row);
          maxCol = Math.max(maxCol, col);
        }
      });

      if (Object.keys(pieceMap).length === 0) {
        throw new Error("No valid pieces found for reconstruction.");
      }

      const pieceWidth = 200;
      const pieceHeight = 160;

      const canvasWidth = (maxCol - minCol + 1) * pieceWidth;
      const canvasHeight = (maxRow - minRow + 1) * pieceHeight;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      console.log(
        `Reconstructing image: minRow=${minRow}, minCol=${minCol}, maxRow=${maxRow}, maxCol=${maxCol}, canvas=${canvasWidth}x${canvasHeight}`
      );

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

          const x = (col - minCol) * pieceWidth;
          const y = (row - minRow) * pieceHeight;
          console.log(`Drawing piece ${piece.name} at x=${x}, y=${y}`);
          ctx.drawImage(img, x, y, pieceWidth, pieceHeight);
        })
      );

      const dataUrl = canvas.toDataURL("image/png", 1.0);
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
    } catch (error) {
      console.error("Error reconstructing image:", error);
      setError("Failed to reconstruct the image. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  }

  const handleResetProgress = async () => {
    try {
      setLoading(true);
      const item = selectedPiece!;
      const obj = {
        pieceId: item._id,
      };
      await axios.post("/api/drawing-image/reset-progress", obj, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSelectedPiece(undefined);
      await getDataFromBackend();
      setShowConfirmationModal(false);
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error resetting progress:", error);
      setError(
        error.response?.data?.error ||
          "Failed to reset progress. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSession = async () => {
    try {
      setLoading(true);
      const obj = { sessionId: sessionId };
      await axios.post("/api/drawing-image/reset-session", obj, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      router.push("/admin");
      setShowResetConfirmationModal(false);
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error resetting progress:", error);
      setError(
        error.response?.data?.error ||
          "Failed to reset progress. Please try again."
      );
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    setShowPiecePreviewModal(false);
  };

  if (error) {
    return (
      <div className="mx-4 max-w-full bg-white pb-2">
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 max-w-full bg-white pb-2">
      <Header
        backButton
        onReset={() => {
          setShowResetConfirmationModal(true);
        }}
        onPreview={() => reconstructImage({ download: false })}
        onReload={() => {
          getDataFromBackend();
        }}
      />
      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto px-10 py-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-400 max-w-full">
                <th className="px-4 py-2 text-left border-b border-gray-100">
                  Cell
                </th>
                <th className="px-4 py-2 text-left border-b border-gray-100">
                  Original Image
                </th>
                <th className="px-4 py-2 text-left border-b border-gray-100">
                  Edited Image
                </th>
                <th className="px-4 py-2 text-left border-b border-gray-100">
                  Timestamp
                </th>
                <th className="px-4 py-2 text-left border-b border-gray-100">
                  User ID
                </th>
                <th className="px-4 py-2 text-left border-b border-gray-100">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-500">
              {/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */}
              {pieces.map((piece: any, index) => (
                <tr
                  key={piece._id || index}
                  className="hover:bg-gray-50 border-b border-gray-100"
                >
                  <td className="px-4 py-2">{piece.serial + 1 || index + 1}</td>
                  <td className="px-4 py-2">
                    {piece.dataUrl ? (
                      <img
                        src={piece.dataUrl}
                        alt="Original"
                        className="w-16 h-16 object-cover cursor-pointer rounded-md"
                        onClick={() => {
                          setShowPiecePreviewModal(true);
                          setPreviewUrl(piece.dataUrl);
                        }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {piece.updatedUrl ? (
                      <div className="w-16 h-16 py-2">
                        <img
                          src={piece.updatedUrl}
                          alt="Edited"
                          className="w-16 h-16 object-cover cursor-pointer rounded-md"
                          onClick={() => {
                            setShowPiecePreviewModal(true);
                            setPreviewUrl(piece.updatedUrl);
                          }}
                        />
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {piece.updatedAt
                      ? new Intl.DateTimeFormat("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          timeZone: "America/New_York",
                        }).format(new Date(piece.updatedAt)) || "N/A"
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">{piece.username || "N/A"}</td>
                  <td className="px-4 py-2 gap-2 flex mt-3">
                    <button
                      disabled={
                        (!piece.updatedUrl && !piece.username) || loading
                      }
                      onClick={() => {
                        setSelectedPiece(piece);
                        setShowConfirmationModal(true);
                      }}
                      className={`px-4 py-2 rounded-xl hover:scale-105 ${
                        !piece.updatedUrl && !piece.username
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                          : "bg-[#f287b7] text-white hover:bg-[#f287b780] cursor-pointer"
                      }`}
                    >
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <Uploadmodal onclose={() => setShowUploadModal(false)} />
        </div>
      )}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <ConfirmModal
            loading={loading}
            onSubmit={handleResetProgress}
            onclose={() => setShowConfirmationModal(false)}
          />
        </div>
      )}
      {showResetConfirmationModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <ConfirmModal
            loading={loading}
            onSubmit={handleResetSession}
            onclose={() => setShowResetConfirmationModal(false)}
          />
        </div>
      )}
      {showPiecePreviewModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-100 p-3"
          onClick={handleClosePreview}
        >
          <div
            className="bg-white p-2 rounded-lg relative min-w-[80%] md:min-w-[50%] max-w-[500px] max-h-[500px] min-h-[50%]"
            onClick={(e) => e.stopPropagation()}
          >
            <Img.default
              fill
              alt="Preview"
              src={previewUrl || ""}
              className="rounded-lg"
              style={{ objectFit: "cover" }}
            />
            <button
              className="absolute cursor-pointer top-0 right-0 text-[#F287B7] bg-gray-200/90 rounded-full flex items-center justify-center h-8 w-8 hover:bg-gray-300/50 font-extrabold"
              onClick={handleClosePreview}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Session;
