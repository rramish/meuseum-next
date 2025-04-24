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
  editedDataUrl: string,
  fileName: string
): Promise<{ original: Dimensions; edited: Dimensions }> => {
  return new Promise((resolve, reject) => {
    const originalImg = new Image();
    originalImg.crossOrigin = "Anonymous";
    originalImg.onload = () => {
      const originalDimensions: Dimensions = {
        width: originalImg.width,
        height: originalImg.height,
      };

      const editedImg = new Image();
      editedImg.onload = () => {
        const editedDimensions: Dimensions = {
          width: editedImg.width,
          height: editedImg.height,
        };

        const canvas = document.createElement("canvas");
        canvas.width = originalDimensions.width;
        canvas.height = originalDimensions.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        ctx.drawImage(
          editedImg,
          0,
          0,
          originalDimensions.width,
          originalDimensions.height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create Blob"));
              return;
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            resolve({ original: originalDimensions, edited: editedDimensions });
          },
          "image/png",
          1.0
        );
      };
      editedImg.onerror = () => {
        reject(new Error("Failed to load edited image"));
      };
      editedImg.src = editedDataUrl;
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

      const fileName = "reconstructed_Image.png";
      const dimensions = await processImageForDownload(
        originalSessionImageURL,
        finalimage,
        fileName
      );
      console.log(
        `Downloaded - Original: ${dimensions.original.width}x${dimensions.original.height}, Edited: ${dimensions.edited.width}x${dimensions.edited.height}`
      );
    } catch (error) {
      console.error("Error downloading the image:", error);
      setError("Failed to download the image. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const onPublish = () => {
    window.location.href = "https://www.mosida.com/";
  };

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
              title="Publish"
              bg="bg-[#fff]"
              onClick={onPublish}
              icon={ICONS.eye_icon}
              textcolor="text-[#F287B7]"
            />
          </div>
          <div>
            <CustomButton
              title="Download"
              bg="bg-[#F287B7]"
              onClick={onDownload}
              icon={ICONS.check_icon}
              textcolor="text-[#fff]"
            />
          </div>
        </div>
      </div>

      {/* Image display */}
      <div className="w-full flex justify-center items-center">
        {finalimage ? (
          <div className="w-full relative h-[80vh]">
            <Img.default
              src={finalimage}
              alt="Reconstructed Image"
              fill
              className="object-contain w-full h-full"
              onClick={toggleFullScreen}
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
