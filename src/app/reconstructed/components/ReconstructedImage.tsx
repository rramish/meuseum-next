"use client";

import React, { useEffect, useState } from "react";
import { ICONS } from "@/assets";
import { useRouter } from "next/navigation";
import { useImageStorage } from "@/store/imageStore";
import { CustomButton } from "@/components/CustomButton";
import * as Img from "next/image";

interface Dimensions {
  width: number;
  height: number;
}

const processImageForDownload = (
  originalImageUrl: string,
  editedDataUrl: string
): Promise<{ original: Dimensions; edited: Dimensions }> => {
  return new Promise((resolve, reject) => {
    if (!editedDataUrl) {
      throw new Error("Original image URL is missing.");
    }
    const originalImg = new Image();
    originalImg.crossOrigin = "Anonymous";
    originalImg.onload = () => {
      const originalDimensions: Dimensions = {
        width: originalImg.width,
        height: originalImg.height,
      };

      const base64Data = editedDataUrl.split(",")[1];
      if (!base64Data) {
        throw new Error("Invalid base64 image data.");
      }

      const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${
        originalDimensions.width
      }" height="${
        originalDimensions.height
      }"><image href="${editedDataUrl.replace(/"/g, "&quot;")}" width="${
        originalDimensions.width
      }" height="${
        originalDimensions.height
      }" preserveAspectRatio="none" /></svg>`;

      // Create a Blob from the SVG data
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "reconstructed_Image.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Original image downloaded as vector successfully.");
    };
    originalImg.onerror = () => {
      reject(new Error("Failed to load original image"));
    };
    originalImg.src = originalImageUrl;
  });
};

const ReconstructedImage: React.FC = () => {
  const router = useRouter();
  const { finalimage, originalSessionImageURL } = useImageStorage();
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const onDownload = async () => {
    try {
      if (!finalimage) {
        throw new Error("No edited image available to download.");
      }
      if (!originalSessionImageURL) {
        throw new Error("Original image URL is missing.");
      }

      await processImageForDownload(originalSessionImageURL, finalimage);
    } catch (error) {
      console.error("Error downloading the image:", error);
      setError("Failed to download the image. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // const onPublish = () => {
  //   window.location.href = "https://www.mosida.com/";
  // };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    return () => {
      const fullScreenImg = document.querySelector(".fullscreen-image");
      if (fullScreenImg) {
        fullScreenImg.remove();
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {/* Header with buttons */}
      <div className="flex flex-wrap justify-between px-10 py-6 gap-2 w-full">
        <div className="flex-1 flex justify-start">
          <div>
            <CustomButton
              title="Back"
              bg="bg-[#fff]"
              onClick={handleBack}
              icon={ICONS.back_icon}
              textcolor="text-[#F287B7]"
            />
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Img.default width={150} height={150} alt="Logo" src={ICONS.logo} />
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <div>
            <CustomButton
              title="Download"
              bg="bg-[#F287B7]"
              onClick={onDownload}
              icon={ICONS.download}
              textcolor="text-[#fff]"
            />
          </div>
        </div>
      </div>

      {/* Image display */}
      <div className="w-full flex justify-center items-center">
        {finalimage ? (
          <div className="w-full h-[80vh] relative flex items-center justify-center">
            <img
              src={finalimage}
              alt="Reconstructed Image"
              onClick={toggleFullScreen}
              className="object-fill w-[90%] h-full"
            />
          </div>
        ) : (
          <p className="text-center text-gray-500">No image available</p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="fixed bottom-4 bg-red-500 text-white px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ReconstructedImage;
