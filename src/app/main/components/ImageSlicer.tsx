"use client";
import React, { useEffect, useState } from "react";
import * as Img from "next/image";

import { ICONS } from "@/assets";
import { useRouter } from "next/navigation";
import { useImageStorage } from "@/store/imageStore";
import { useSelectedImagesStore } from "@/store/imagesSessionStore";

interface ImagePiece {
  dataUrl: string;
  name: string;
}

interface ImageSlicerProps {
  imageUrl: string;
}

const ImageSlicerWithDrawing: React.FC<ImageSlicerProps> = ({}) => {
  const [imagePieces, setImagePieces] = useState<ImagePiece[]>([]);
  const { selectedImages, setSelectedImages } = useSelectedImagesStore();
  const [, setSelectedPieceUrl] = useState<string | undefined>(undefined);
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const { image, setImagePiece } = useImageStorage();
  const FIXED_WIDTH = window.innerWidth - 100;
  const FIXED_HEIGHT = 800;
  useEffect(() => {
    const sliceImage = async () => {
      const rows = 5;
      const cols = 4;

      if (image) {
        const imgUrl = URL.createObjectURL(image);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imgUrl;

        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
        });

        const pieceWidth = FIXED_WIDTH / cols;
        const pieceHeight = FIXED_HEIGHT / rows;
        setW(`${pieceWidth}px`);
        setH(`${pieceHeight}px`);

        const pieces: ImagePiece[] = [];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("Failed to get 2D context");
          return;
        }

        canvas.width = pieceWidth;
        canvas.height = pieceHeight;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
              img,
              col * (img.width / cols),
              row * (img.height / rows),
              img.width / cols,
              img.height / rows,
              0,
              0,
              pieceWidth,
              pieceHeight
            );
            const pieceDataUrl = canvas.toDataURL();
            pieces.push({
              dataUrl: pieceDataUrl,
              name: `piece_${row + 1}_${col + 1}.png`,
            });
          }
        }
        setImagePieces(pieces);
      }
    };

    sliceImage();
  }, [image]);

  const handlePieceClick = (piece: ImagePiece) => {
    setSelectedPieceUrl(piece.dataUrl);
  };

  const router = useRouter();

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(5, ${FIXED_HEIGHT / 5}px)`,
          gridTemplateColumns: `repeat(4, ${FIXED_WIDTH / 4}px)`,
          gap: "1px",
          // width: `${FIXED_WIDTH + 100}px`,
          height: `${FIXED_HEIGHT + 100}px`,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {imagePieces.map((piece, index) => (
          <div
            key={index}
            className={`text-center flex-1 bg-white rounded-lg group`}
          >
            <div
              className={`text-white absolute flex flex-col z-10 flex-1 p-2 ${
                !selectedImages.includes(index)
                  ? "hover:bg-[#00115A80] "
                  : "hover:bg-[#5F000280]"
              } hover:rounded-lg`}
              style={{ width: w, height: h }}
            >
              <div
                className={`m-auto justify-center items-center hidden group-hover:flex`}
              >
                <Img.default
                  src={
                    !selectedImages.includes(index)
                      ? ICONS.ab_icon
                      : ICONS.na1_icon
                  }
                  alt=""
                  width={50}
                  height={50}
                  className=""
                  onClick={() => {
                    if (!selectedImages.includes(index)) {
                      const current = selectedImages;
                      current.push(index);
                      setSelectedImages(current);
                      setImagePiece(piece.dataUrl);
                      router.push("/canvas");
                    }
                  }}
                />
              </div>
            </div>
            <Img.default
              onClick={() => handlePieceClick(piece)}
              className="rounded-lg bg-black duration-300"
              // className="rounded-lg bg-black group-hover:scale-105 duration-300"
              src={piece.dataUrl}
              alt={`Piece ${index + 1}`}
              width={100}
              height={100}
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
  );
};

export default ImageSlicerWithDrawing;
