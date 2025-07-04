"use client";

import axios from "axios";
import * as Img from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ICONS } from "@/assets";
import { socket } from "@/socket";
import Loader from "@/components/Loader";
import Header from "./components/Header";
import { useImageStorage } from "@/store/imageStore";

interface ImagePiece {
  name: string;
  dataUrl: string;
  sessionId: string;
  username: string | null;
  updatedUrl: string | null;
}

const Home = () => {
  const FIXED_HEIGHT = 800;

  const router = useRouter();
  const { finalimage, setfinalimage } = useImageStorage();
  const { imageBackend, setImagePiece } = useImageStorage();

  const [totalLen, setTotalLen] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fixedWidth, setFixedWidth] = useState(1200);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [pieces, setPieces] = useState<Partial<ImagePiece[]>>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("image-updated", () => {
      console.log("Received image-updated event");
      getDataFromBackend();
    });

    return () => {
      socket.off("image-updated");
      socket.off("connect");
    };
  }, [socket]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFixedWidth(Math.min(window.innerWidth, 1100));
    }
    const sliceImage = async () => {
      try {
        const rows = 5;
        const cols = 4;
        const pieceWidth = fixedWidth / cols;
        const pieceHeight = FIXED_HEIGHT / rows;

        if (imageBackend) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = imageBackend;

          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
          });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            setError("Failed to get 2D context");
            return;
          }
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
        }
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("error is : ", error);
        setError("Failed to slice the image. Please try again.");
      }
    };

    sliceImage();
    getDataFromBackend();
  }, []);

  useEffect(() => {
    if (totalLen === 20) {
      reconstruct({ download: false });
    }
  }, [totalLen]);

  const getImageDimensions = (dataUrl: string) => {
    try {
      let width = 0;
      let height = 0;
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = () => {
        width = img.naturalWidth;
        height = img.naturalHeight;
      };
      console.log("images dimesion is : ", width, height);
      img.onerror = () => {
        throw new Error("Failed to load image from dataUrl");
      };
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("error is : ", error);
      setError("Failed to get image dimensions. Please check the image URL.");
    }
  };

  const getDataFromBackend = async () => {
    try {
      setLoading(true);
      const resp = await axios.get("/api/drawing-image");
      setPieces(resp.data.pieces);
      getImageDimensions(resp.data.pieces[0]?.dataUrl);
      const current = resp.data.pieces.filter(
        (f: ImagePiece) => f.username && f.username
      );
      setTotalLen(current.length);
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("error is ; ", error);
      setError(
        error?.response?.data?.error ||
          "Failed to fetch data from the backend. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  async function reconstruct({
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
        //  router.push(`/reconstructed`);
      }
      return dataUrl;
    } catch (error) {
      console.error("Error reconstructing image:", error);
      setError("Failed to reconstruct the image. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  }

  return (
    <div className="flex-1 max-h-full bg-white">
      <Header
        length={totalLen}
        // onPreview={() => {
        //   reconstructImage({ download: false });
        // }}
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded mb-4 mx-3">
              <p>{error}</p>
            </div>
          )}
          <div className="w-full p-4 relative h-full max-h-full">
            <div className="w-full flex flex-col justify-center items-center">
              {totalLen === 20 ? (
                <div className="w-full h-[80vh] relative flex items-center justify-center">
                  <img
                    alt="Reconstructed Image"
                    src={(finalimage && finalimage) || ""}
                    className="object-fill w-[90%] h-full"
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: `repeat(5, 1fr)`,
                    gridTemplateColumns: `repeat(4, 1fr)`,
                    gap: "1px",
                    width: "100%",
                    height: "80vh",
                    overflow: "hidden",
                  }}
                >
                  {pieces.map((piece, index) => (
                    <div
                      key={index}
                      className="text-center flex-1 bg-white rounded-lg group relative"
                    >
                      <div
                        className={`text-white absolute flex flex-col z-10 flex-1 p-2 min-h-full min-w-full max-w-full
                        ${
                          !piece?.username ? "bg-[#5F000280] rounded-lg" : ""
                        }  hover:rounded-lg`}
                      >
                        {piece?.username &&
                          (() => {
                            const [firstName, secondName] =
                              piece.username.split(" ");
                            return secondName ? (
                              <p
                                style={{
                                  fontWeight: "bold",
                                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                                }}
                              >
                                {firstName} {secondName[0]}.
                              </p>
                            ) : (
                              <p
                                style={{
                                  fontWeight: "bold",
                                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                                }}
                              >
                                {firstName}
                              </p>
                            );
                          })()}
                        <div className="m-auto justify-center flex items-center w-full h-full relative">
                          <div className="flex justify-center items-center relative w-1/5 h-1/5 cursor-pointer">
                            <Img.default
                              src={
                                !piece?.username
                                  ? ICONS.edit_img
                                  : ICONS.preview_img
                              }
                              alt="edit_icon"
                              width={40}
                              height={40}
                              onClick={() => {
                                if (!piece?.username) {
                                  setImagePiece(piece!);
                                  router.push("/canvas");
                                } else {
                                  setShowPreviewModal(true);
                                  setPreviewUrl(
                                    piece?.updatedUrl || piece?.dataUrl
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <Img.default
                        onClick={() => {}}
                        className="rounded-lg bg-black duration-300"
                        src={
                          piece && piece.updatedUrl
                            ? piece.updatedUrl
                            : piece!.dataUrl
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
              )}
            </div>
          </div>
          {showPreviewModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-100 p-3"
              onClick={() => {
                setPreviewUrl("");
                setShowPreviewModal(false);
              }}
            >
              <div
                className="bg-white relative"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={previewUrl || ""}
                  alt="Preview"
                  width={500}
                  height={500}
                  style={{ objectFit: "contain" }}
                />
                <button
                  className="absolute cursor-pointer top-0 right-0 text-[#F287B7] flex items-center justify-center bg-gray-200/90 rounded-full h-8 w-8 hover:bg-gray-300/50 font-extrabold"
                  onClick={() => {
                    setPreviewUrl("");
                    setShowPreviewModal(false);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
