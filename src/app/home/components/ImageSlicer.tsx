import React, { useEffect, useState } from "react";

interface ImagePiece {
  dataUrl: string;
  name: string;
}

interface ImageSlicerProps {
  imageUrl: string;
}

const ImageSlicer: React.FC<ImageSlicerProps> = ({ imageUrl }) => {

  const FIXED_WIDTH = 800;
  const FIXED_HEIGHT = 800;

  const [imagePieces, setImagePieces] = useState<ImagePiece[]>([]);
  const [, setSelectedPieceUrl] = useState<string | undefined>(
    undefined
  );


  useEffect(() => {
    const sliceImage = async () => {
      const rows = 3;
      const cols = 4;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      const pieceWidth = FIXED_WIDTH / cols;
      const pieceHeight = FIXED_HEIGHT / rows;

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
    };

    sliceImage();
  }, [imageUrl]);

  const handlePieceClick = (piece: ImagePiece) => {
    setSelectedPieceUrl(piece.dataUrl);
  };

  return (
    <div className="">
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(3, ${FIXED_HEIGHT / 3}px)`,
          gridTemplateColumns: `repeat(4, ${FIXED_WIDTH / 4}px)`,
          gap: "10px",
          width: `${FIXED_WIDTH + 100}px`,
          height: `${FIXED_HEIGHT + 100}px`,
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {imagePieces.map((piece, index) => (
          <div
            key={index}
            className="text-center"
            style={{
              padding: 0,
              margin: 0,
              lineHeight: 0,
            }}
          >
            <img
              onClick={() => handlePieceClick(piece)}
              src={piece.dataUrl}
              alt={`Piece ${index + 1}`}
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

      {/* <div style={{ marginTop: "20px" }}>
        <DrawingCanvas imageUrl={selectedPieceUrl} />
      </div> */}
    </div>
  );
};

export default ImageSlicer;
