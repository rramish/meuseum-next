"use client";

import React from "react";
import Image from "next/image";

import { ICONS } from "@/assets";
import { useSelectedImagesStore } from "@/store/imagesSessionStore";

export const CustomButton = ({
  icon,
  title = "Button",
  fontsize = "text-base",
  bg,
  textcolor,
  onClick = () => {},
  width = 20,
  height = 20,
}: {
  bg?: string;
  icon: string;
  width?: number;
  title?: string;
  height?: number;
  fontsize?: string;
  textcolor?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center cursor-pointer hover:scale-105 duration-300 border gap-2 border-[#DADCE0] ${textcolor} ${bg} rounded-lg px-4 py-2 w-auto`}
    >
      <Image
        src={icon || ICONS.image_icon}
        alt="image"
        width={width}
        height={height}
      />
      <div className="flex items-center">
        <p className={`${fontsize} text-sm md:text-base`}>{title} </p>
      </div>
    </div>
  );
};

const Header = ({
  onNewDrawing,
  onPreview,
  onConstruct,
}: {
  onNewDrawing: () => void;
  onPreview: () => void;
  onConstruct: () => void;
}) => {
  const { selectedImages } = useSelectedImagesStore();
  return (
    <div className="px-10 py-6">
      <div className="flex items-center justify-center gap-2 h-full flex-wrap flex-col md:flex-row md:justify-between">
        <div className="flex gap-2 flex-wrap items-center justify-center">
          <CustomButton
            title={`Canvas ${20 - selectedImages.length}/${20}`}
            icon={ICONS.image_icon}
            bg={"bg-transparent"}
            textcolor={"text-[#1A73E8]"}
          />
          <CustomButton
            onClick={onNewDrawing}
            title="New Session"
            icon={ICONS.plus_icon}
            bg={"bg-transparent"}
            textcolor={"text-[#1A73E8]"}
          />
        </div>

        <div className="self-center flex items-center justify-center">
          <Image
            src={ICONS.logo_icon}
            alt="mosida_logo"
            width={100}
            height={100}
          />
        </div>
        <div className="flex gap-2 flex-wrap  items-center justify-center">
          <CustomButton
            onClick={onPreview}
            title="Preview"
            bg={"bg-white"}
            icon={ICONS.eye_icon}
            textcolor={"text-[#1A73E8]"}
          />
          <CustomButton
            onClick={onConstruct}
            title="Reconstruct"
            bg={"bg-[#1A73E8]"}
            icon={ICONS.check_icon}
            textcolor={"text-white"}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
