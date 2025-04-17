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

  const handleBack = () => {
    navigation.back();
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 p-6">
      <div className="flex gap-10  md:mb-6 w-full max-w-3xl">
        <CustomButton
          onClick={handleBack}
          title="Back"
          icon={ICONS.undo_icon}
          bg={"bg-[#fff]"}
          textcolor={"text-[#1A73E8]"}
        />
      </div>

      {finalimage ? (
        <div className="relative w-full h-[600px] max-w-6xl mx-auto">
          <Image
            src={finalimage}
            alt="Reconstructed Image"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No image available</p>
      )}
    </div>
  );
};

export default ReconstructedImage;
