"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ICONS } from "@/assets";
import { useImageStorage } from "@/store/imageStore";
import { CustomButton } from "@/components/CustomButton";

const ReconstructedImage = () => {
  const navigation = useRouter();

  const { finalimage } = useImageStorage();

  const onDownload = () => {
    try {
      if (!finalimage) {
        throw new Error("No image available to download.");
      }

      // Convert base64 to Blob
      const byteString = atob(finalimage.split(",")[1]);
      const mimeString = finalimage.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "reconstructed_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Failed to download the image. Please try again.");
    }
  };

  const onPublish = () => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    window.location = "https://www.mosida.com/" as any;
  };

  const handleBack = () => {
    navigation.back();
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 py-6 px-4">
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl items-center justify-between py-2 z-10">
        <div className="flex-1 flex justify-start">
          <CustomButton
            onClick={handleBack}
            title="Back"
            icon={ICONS.undo_icon}
            bg={"bg-[#fff]"}
            textcolor={"text-[#1A73E8]"}
          />
        </div>
        <div className="flex-1 flex justify-center">
          <Image width={150} height={150} alt="Logo" src={ICONS.logo} />
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <CustomButton
            onClick={onPublish}
            title="Publish"
            icon={ICONS.eye_icon}
            bg={"bg-[#fff]"}
            textcolor={"text-[#1A73E8]"}
          />
          <CustomButton
            onClick={onDownload}
            title="Reconstruct"
            icon={ICONS.check_icon}
            bg={"bg-[#1A73E8]"}
            textcolor={"text-[#fff]"}
          />
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        {finalimage ? (
          <div className="w-4/5 relative h-[80vh] -top-14">
            <Image
              src={finalimage}
              alt="Reconstructed Image"
              // fill
              width={100}
              height={100}
              className="object-fill  w-full h-full"
              // style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <p className="text-center text-gray-500">No image available</p>
        )}
      </div>
    </div>
  );
};

export default ReconstructedImage;
