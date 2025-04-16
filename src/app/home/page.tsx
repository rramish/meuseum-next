"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Img from "next/image";
import Loader from "@/components/Loader";
import Header from "./components/Header";

import { ICONS } from "@/assets";
import { useRouter } from "next/navigation";
import { useImageStorage } from "@/store/imageStore";
// import { useSelectedImagesStore } from "@/store/imagesSessionStore";

interface ImagePiece {
  name: string;
  dataUrl: string;
  sessionId: string;
  username: string | null;
  updatedUrl: string | null;
}

const Home = () => {

  const [pieces, setPieces] = useState<Partial<ImagePiece[]>>([]);
  const [loading, setLoading] = useState(false);
  // const { selectedImages, setSelectedImages } = useSelectedImagesStore();
  const [w, setW] = useState(100);
  const [h, setH] = useState(100);
  const { image, imageBackend, setImagePiece, setfinalimage } = useImageStorage();
  const [fixedWidth, setFixedWidth] = useState(1200);
  // const FIXED_WIDTH = 1200;
  // const FIXED_WIDTH = window && window.innerWidth - 100 || 1200;
  const FIXED_HEIGHT = 800;

  const getImageDimensions = (dataUrl: string) => {
    let width = 0;
    let height = 0;
    const img = new window.Image();
    img.src = dataUrl;
    img.onload = () => {
      console.log("image inside ", img.naturalWidth, img.naturalHeight);
      width = img.naturalWidth;
      height = img.naturalHeight;

      setW(img.naturalWidth-60);
      // setW(`${img.naturalWidth-59}px`);
      setH(img.naturalHeight);
    };
    img.onerror = () => {
      new Error('Failed to load image from dataUrl');
    };
    console.log(width, height);
  };

  const getDataFromBackend = async () => {
    setLoading(true);
    const resp = await axios.get("/api/drawing-image");
    console.log("resp is : ", resp.data);
    setPieces(resp.data.pieces);
    await getImageDimensions(resp.data.pieces[0].dataUrl);
    setLoading(false);
  };

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFixedWidth(Math.min( 1400, 1100));
    }
    const sliceImage = async () => {
      const rows = 5;
      const cols = 4;
      const pieceWidth = fixedWidth / cols;
      const pieceHeight = FIXED_HEIGHT / rows;
      // setW(`${pieceWidth}px`);
      // setH(`${pieceHeight}px`);

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
          console.error("Failed to get 2D context");
          return;
        }
        canvas.width = pieceWidth;
        canvas.height = pieceHeight;
      }
    };

    sliceImage();
    getDataFromBackend();
  }, [image]);

  const router = useRouter();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex-1">
        <Img.default
          src={ICONS.bg_image}
          alt=""
          width={100}
          height={100}
          className={`absolute -z-10 top-0 left-0 w-full`}
        />
        <Header onPreview={() =>{reconstructImage({download: false})}} />
        <div className="w-full mb-8 py-4 relative">
          <div className="w-full flex flex-col justify-center items-center md:hidden">
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
                  onClick={() => {
                    if (!piece?.username) {
                      // const current = selectedImages;
                      // current.push(index);
                      // setSelectedImages(current);
                      setImagePiece(piece!);
                      router.push("/canvas");
                    }
                  }}
                >
                  <div
                    className={`text-white absolute flex flex-col z-10 flex-1 p-2 ${
                      !piece?.username
                        ? "hover:bg-[#00115A80]"
                        : "hover:bg-[#5F000280] bg-[#00000050] rounded-lg"
                    } hover:rounded-lg`}
                    style={{ width: `${w}px`, height: `${h}px` }}
                  >
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
                    src={piece!.dataUrl}
                    alt={`Piece ${index + 1}`}
                    width={w}
                    height={h}
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
          <div className="w-fullflex-col justify-center hidden md:flex items-center">
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
                        : "hover:bg-[#5F000280] bg-[#00000050] rounded-lg"
                    } hover:rounded-lg`}
                    style={{ width: `${w}px`, height: `${h}px` }}
                  >
                    <div
                      className={`m-auto justify-center items-center hidden group-hover:flex`}
                    >
                      <Img.default
                        src={!piece?.username ? ICONS.ab_icon : ICONS.na1_icon}
                        alt=""
                        width={50}
                        height={50}
                        className=""
                        onClick={() => {
                          if (!piece?.username) {
                            // const current = selectedImages;
                            // current.push(index);
                            // setSelectedImages(current);
                            setImagePiece(piece!);
                            router.push("/canvas");
                          }
                        }}
                      />
                    </div>
                  </div>
                  <Img.default
                    onClick={() => {}}
                    className="rounded-lg bg-black duration-300"
                    src={piece!.dataUrl}
                    alt={`Piece ${index + 1}`}
                    width={w}
                    height={h}
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
        </div>
      </div>
    </>
  );
};

export default Home;
