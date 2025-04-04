"use client";
import { ICONS } from "@/assets";
import { useSelectedImagesStore } from "@/store/imagesSessionStore";
import { useImageStorage } from "@/store/imageStore";
import * as Img from "next/image";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";

const DropZone = ({
  setSelectedImage,
  onclose,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedImage: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onclose: any;
}) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [, setIsLoading] = useState<boolean>(false);
  const {setImage} = useImageStorage();
  const {clearSelectedImages} = useSelectedImagesStore();

  const defaultImageUrl =
    "https://images.unsplash.com/photo-1740421198589-f98aa30526ac?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  // const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ACCEPTED_TYPES = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setErrorMessage("");
    setIsLoading(true);

    if (!file) {
      setIsDragging(false);
      setIsLoading(false);
      return;
    }

    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      setErrorMessage("Only JPG, JPEG, and PNG files are allowed.");
      setIsDragging(false);
      setIsLoading(false);
      return;
    }

    // if (file.size > MAX_FILE_SIZE) {
    //   setErrorMessage("File size must be less than 5 MB.");
    //   setIsDragging(false);
    //   setIsLoading(false);
    //   return;
    // }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImageUrl(imageUrl);
    console.log("image url is : ", imageUrl);
    setSelectedImage(file);
    console.log("Selected file:", file);
    setIsDragging(false);
    clearSelectedImages();
    setImage(file);

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setErrorMessage("Failed to load image.");
      setIsLoading(false);
    };
    onclose();
  };

  useEffect(() => {
    if (!selectedImageUrl) {
      setIsLoading(true);
      const img = new Image();
      img.src = defaultImageUrl;
      img.onload = () => setIsLoading(false);
      img.onerror = () => {
        setErrorMessage("Failed to load default image.");
        setIsLoading(false);
      };
    }

    return () => {
      if (selectedImageUrl) {
        URL.revokeObjectURL(selectedImageUrl);
      }
    };
  }, [selectedImageUrl]);

  const onDragEnter = () => setIsDragging(true);
  const onDragLeave = () => setIsDragging(false);

  return (
    <div>
      <div className="w-full max-w-md cursor-pointer">
        <Dropzone
          onDrop={handleDrop}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          accept={ACCEPTED_TYPES}
          // maxSize={MAX_FILE_SIZE}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div
                {...getRootProps()}
                className={`border-1 border-dashed flex flex-col justify-center items-center rounded-lg p-8 text-center transition-all duration-300 ease-in-out ${
                  isDragging
                    ? "border-blue-500 bg-blue-200 bg-opacity-50 shadow-lg"
                    : "border-gray-400 bg-[#0179DC20] hover:bg-gray-100"
                }`}
              >
                <input {...getInputProps()} />
                <Img.default
                  src={ICONS.upload_icon}
                  alt=""
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
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default DropZone;
