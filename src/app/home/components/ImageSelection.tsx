"use client";

import Dropzone from "react-dropzone";
import React, { useEffect, useState } from "react";

const ImageSelection = () => {
  const defaultImageUrl =
    "https://images.unsplash.com/photo-1740421198589-f98aa30526ac?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const ACCEPTED_TYPES = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  };

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  useEffect(() => {
    if (!selectedImageUrl) {
      const img = new Image();
      img.src = defaultImageUrl;
      img.onerror = () => {
        setErrorMessage("Failed to load default image.");
      };
    }

    return () => {
      if (selectedImageUrl) {
        URL.revokeObjectURL(selectedImageUrl);
      }
    };
  }, [selectedImageUrl]);

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setErrorMessage("");

    if (!file) {
      setIsDragging(false);
      return;
    }

    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      setErrorMessage("Only JPG, JPEG, and PNG files are allowed.");
      setIsDragging(false);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImageUrl(imageUrl);
    setIsDragging(false);

    const img = new Image();
    img.src = imageUrl;
    img.onerror = () => {
      setErrorMessage("Failed to load image.");
    };
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
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div
              {...getRootProps()}
              className={`border-4 border-dashed rounded-lg p-8 text-center transition-all duration-300 ease-in-out ${
                isDragging
                  ? "border-blue-500 bg-blue-200 bg-opacity-50 shadow-lg"
                  : "border-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-lg text-gray-600">
                {isDragging
                  ? "Drop your image here!"
                  : "Drag 'n' drop an image here, or click to select"}
              </p>
              <span className="text-sm text-gray-400 mt-2 block">
                (Only JPG, JPEG, PNG up to 5 MB)
              </span>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

export default ImageSelection;
