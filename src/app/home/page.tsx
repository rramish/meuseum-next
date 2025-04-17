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

  const { image, imageBackend, setImagePiece } = useImageStorage();

  const [loading, setLoading] = useState(false);
  const [fixedWidth, setFixedWidth] = useState(1200);
  const [pieces, setPieces] = useState<Partial<ImagePiece[]>>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFixedWidth(Math.min(window.innerWidth, 1100));
    }
    const sliceImage = async () => {
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

  const getImageDimensions = (dataUrl: string) => {
    let width = 0;
    let height = 0;
    const img = new window.Image();
    img.src = dataUrl;
    img.onload = () => {
      console.log("image inside ", img.naturalWidth, img.naturalHeight);
      width = img.naturalWidth;
      height = img.naturalHeight;
    };
    img.onerror = () => {
      new Error("Failed to load image from dataUrl");
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex-1 max-h-full bg-white">
      <Header />
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
                  className={`text-white absolute flex flex-col z-10 flex-1 p-2 w-full h-full ${
                    !piece?.username
                      ? "hover:bg-[#00115A80]"
                      : "hover:bg-[#5F000280] bg-[#00000050] rounded-lg"
                  } hover:rounded-lg`}
                >
                  <div
                    className={`m-auto justify-center hidden items-center w-full h-full group-hover:flex relative`}
                  >
                    <div
                      className={`flex justify-center items-center relative w-1/5 h-1/5 ${
                        !piece?.username
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      } hover:scale-120`}
                    >
                      <Img.default
                        src={!piece?.username ? ICONS.edit_img : ICONS.not_available_image}
                        alt="edit_icon"
                        width={90}
                        height={90}
                        className=""
                      />
                    </div>
                  </div>
                </div>
                <Img.default
                  onClick={() => {}}
                  className="rounded-lg bg-black duration-300"
                  src={piece!.dataUrl}
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
    </div>
  );
};

export default Home;
