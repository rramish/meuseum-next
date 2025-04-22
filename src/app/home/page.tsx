"use client";
import React, { useEffect, useState } from "react";

import axios from "axios";
import * as Img from "next/image";
import Loader from "@/components/Loader";
import Header from "./components/Header";

import { ICONS } from "@/assets";
import { useRouter } from "next/navigation";
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
  const { setfinalimage } = useImageStorage();
  const { imageBackend, setImagePiece } = useImageStorage();

  const [loading, setLoading] = useState(false);
  const [fixedWidth, setFixedWidth] = useState(1200);
  const [totalLen, setTotalLen] = useState(0);
  const [pieces, setPieces] = useState<Partial<ImagePiece[]>>([]);
  const [error, setError] = useState<string | null>(null);

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
      } catch (error:any) {
        console.log("error is : ", error);
        setError("Failed to slice the image. Please try again.");
      }
    };

    sliceImage();
    getDataFromBackend();
  }, []);

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
    } catch (error:any) {
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
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log("error is : ", error);
      setError("Failed to reconstruct the image. Please try again.");
    }
  }

  return (
    <div className="flex-1 max-h-full bg-white">
      <Header
        length={totalLen}
        onPreview={() => {
          reconstructImage({ download: false });
        }}
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
                    className={`text-center flex-1 bg-white rounded-lg group relative`}
                    onClick={() => {
                      if (!piece?.username) {
                        setImagePiece(piece!);
                        router.push("/canvas");
                      }
                    }}
                  >
                    <div
                      className={`text-white absolute flex flex-col z-10 flex-1 p-2 min-h-full min-w-full max-w-full ${
                        !piece?.username
                          ? "hover:bg-[#00115A80]"
                          : "hover:bg-[#5F000280] bg-[#00000050] rounded-lg"
                      } hover:rounded-lg`}
                    >
                      {piece?.username && (
                        <p className="max-w-full truncate ml-2">
                          {piece?.username}
                        </p>
                      )}
                      <div
                        className={`m-auto justify-center flex md:hidden items-center w-full h-full group-hover:flex relative`}
                      >
                        <div
                          className={`flex justify-center items-center relative w-1/5 h-1/5 ${
                            !piece?.username
                              ? "cursor-pointer"
                              : "cursor-not-allowed"
                          } hover:scale-120`}
                        >
                          <Img.default
                            src={
                              !piece?.username
                                ? ICONS.edit_img
                                : ICONS.not_available_image
                            }
                            alt="edit_icon"
                            width={40}
                            height={40}
                            className=""
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
