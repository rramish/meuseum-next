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
// import { useSelectedImagesStore } from "@/store/imagesSessionStore";

interface ImagePiece {
  name: string;
  _id?: string;
  serial: number;
  dataUrl: string;
  username?: string;
  updatedUrl?: string;
}

const Session = () => {
  const router = useRouter();
  const params = useParams();
  const { sessionId } = params;
  const { setfinalimage } = useImageStorage();
  // const { setSelectedImages } = useSelectedImagesStore();

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
      console.log("API response:", resp.data);
      setPieces(resp.data.pieces);
      // const current = resp.data.pieces.filter((f: ImagePiece) => f.username);
      // setSelectedImages(current);
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("error is : ", error);
      setError(
        error.response?.data?.error ||
          "Failed to fetch data from the server. Please try again."
      );
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
    } catch (error) {
      console.error("Error reconstructing image:", error);
      setError("Failed to reconstruct the image. Please try again.");
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
      // await getDataFromBackend();
      router.push("/admin");
      setShowResetConfirmationModal(false);
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error resetting progress:", error);
      setError(
        error.response?.data?.error ||
          "Failed to reset progress. Please try again."
      );
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
        onReset={() => {
          setShowResetConfirmationModal(true);
        }}
        onPreview={() => reconstructImage({ download: false })}
      />
      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
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
              {/* eslint-disable-next-line  @typescript-eslint/no-explicit-any  */}
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
                        className="w-16 h-16 object-cover cursor-pointer"
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
                      <img
                        src={piece.updatedUrl}
                        alt="Edited"
                        className="w-16 h-16 object-cover cursor-pointer"
                        onClick={() => {
                          setShowPiecePreviewModal(true);
                          setPreviewUrl(piece.updatedUrl);
                        }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {piece.updatedAt
                      ? new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        }).format(new Date(piece.updatedAt)) || "N/A"
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">{piece.username || "N/A"}</td>
                  <td className="px-4 py-2 gap-2 flex">
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
                          : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                      }`}
                    >
                      Reset
                    </button>
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
                          : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                      }`}
                    >
                      Activate
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
            className="bg-white p-2 rounded-lg relative min-w-[80%] md:min-w-[50%] max-w-[500px] max-h-[500px]  min-h-[50%]"
            onClick={(e) => e.stopPropagation()}
          >
            <Img.default
              src={previewUrl || ""}
              alt="Preview"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
            <button
              className="absolute cursor-pointer top-2 right-2 text-gray-500 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
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
