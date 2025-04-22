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
    const link = document.createElement("a");
    link.href = finalimage!;
    link.download = finalimage!;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onPublish = () =>{
    window.location = "https://www.mosida.com/" as any;
  }

  const handleBack = () => {
    navigation.back();
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 py-6 px-10">
      <div className="flex gap-10 w-full max-w-4xl py-2 z-10">
        <div className="flex-1 flex">
          <CustomButton
            onClick={handleBack}
            title="Back"
            icon={ICONS.undo_icon}
            bg={"bg-[#fff]"}
            textcolor={"text-[#1A73E8]"}
          />
        </div>
        <div className="flex-1 flex justify-center">
          <Image width={100} height={100} alt="" src={ICONS.logo} />
        </div>
        <div className="flex-1 flex gap-1">
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

      {finalimage ? (
        // <div className="relative w-full h-[75vh] max-w-6xl mx-auto overflow-hidden z-0 p-2
        // ">
        <Image
          src={finalimage}
          alt="Reconstructed Image"
          layout="fill"
          className="max-w-full max-h-full object-fill rounded-lg shadow-lg"
        />
      ) : (
        // </div>
        <p className="text-center text-gray-500">No image available</p>
      )}
    </div>
  );
};

export default ReconstructedImage;
