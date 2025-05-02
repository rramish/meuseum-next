"use client";

import axios from "axios";
import * as Img from "next/image";
import Dropzone from "react-dropzone";
import React, { useState, useRef } from "react";

import { ICONS } from "@/assets";
import { socket } from "@/socket";
import { useImageStorage } from "@/store/imageStore";
import { useSelectedImagesStore } from "@/store/imagesSessionStore";

interface ImagePiece {
  name: string;
  _id?: string;
  serial: number;
  dataUrl: string;
  username?: string;
  updatedUrl?: string;
}

const DropZone = ({ onclose }: { onclose: () => void }) => {
  const isUploading = useRef(false);

  const { clearSelectedImages } = useSelectedImagesStore();
  const { setImageBackend, setImageFolderName } = useImageStorage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const ACCEPTED_TYPES = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  };

  const FIXED_HEIGHT = 800;
  const FIXED_WIDTH = window.innerWidth - 100;

  const sliceImageAndUpload = async (imgUrl: string, folderName: string) => {
    const rows = 5;
    const cols = 4;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;

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
    let serial = 0;

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
          serial,
        });
        serial++;
      }
    }

    const resp = await axios.post("/api/drawing-image", {
      pieces,
      sessionId: folderName,
    });
    socket.emit("image-updated-backend", { hello: "world" });

    window.location.reload();
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    if (isUploading.current) return;
    isUploading.current = true;

    const file = acceptedFiles[0];
    setErrorMessage("");
    setIsLoading(true);

    if (!file) {
      setIsDragging(false);
      setIsLoading(false);
      isUploading.current = false;
      return;
    }

    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      setErrorMessage("Only JPG, JPEG, and PNG files are allowed.");
      setIsDragging(false);
      setIsLoading(false);
      isUploading.current = false;
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", file.name);

    // console.log("Making API call to /api/upload-image");
    const resp = await axios.post("/api/upload-image", formData);

    // console.log("resp is : ", resp.data);

    if (resp?.data?.imageUrl) {
      // console.log("Uploaded image URL:", resp.data.imageUrl);
      setImageBackend(resp.data.imageUrl);
      setImageFolderName(resp.data.folderName);
      await sliceImageAndUpload(resp.data.imageUrl, resp.data.folderName);
      clearSelectedImages();
      setIsDragging(false);
      setIsLoading(false);
      onclose();
    } else {
      setErrorMessage("Image cannot be uploaded");
      setIsDragging(false);
      setIsLoading(false);
    }

    isUploading.current = false;
  };

  const onDragEnter = () => setIsDragging(true);
  const onDragLeave = () => setIsDragging(false);

  return (
    <div className="w-full max-w-md cursor-pointer">
      <Dropzone
        onDrop={handleDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        accept={ACCEPTED_TYPES}
        disabled={isLoading}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div
              {...getRootProps()}
              className={`border-1 border-dashed flex flex-col justify-center items-center rounded-lg p-8 text-center transition-all duration-300 ease-in-out ${
                isDragging
                  ? "border-blue-500 bg-blue-200 bg-opacity-50 shadow-lg"
                  : "border-gray-400 bg-[#0179DC20] hover:bg-gray-100"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input {...getInputProps()} />
              <Img.default
                src={ICONS.upload_icon}
                alt="Upload Icon"
                width={50}
                height={50}
              />
              <p className="text-lg text-gray-600">
                {isDragging
                  ? "Drop your image here!"
                  : "Drag & drop image here, or Browse"}
              </p>
              <span className="text-sm text-gray-400 mt-2 block">
                (Supported formats: JPG, JPEG, PNG)
              </span>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              {isLoading && (
                <p className="text-blue-500 text-sm mt-2">Uploading...</p>
              )}
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

export default DropZone;
