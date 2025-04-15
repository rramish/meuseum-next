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
  const { image, imageBackend, setImagePiece } = useImageStorage();
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

      setW(img.naturalWidth);
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFixedWidth(Math.min( window.innerWidth - 100, 1200));
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
        <Header />
        <div className="w-full mb-8 py-4 relative">
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
