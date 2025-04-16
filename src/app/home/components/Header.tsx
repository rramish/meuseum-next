"use client";
import React from "react";
import Image from "next/image";

import { ICONS } from "@/assets";

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
      className={`flex items-center cursor-pointer hover:scale-105 duration-300 border gap-2 border-[#DADCE0] ${textcolor} ${bg} rounded-lg px-2 md:px-4 py-1 md:py-2 `}
    >
      <div>
        <Image
          src={icon || ICONS.image_icon}
          alt="image"
          width={width}
          height={height}
          className="h-4 w-4 md:h-6 md:w-6"
        />
      </div>
      <div className="flex items-center">
        <p className={`${fontsize} text-xs md:text-base`}>{title} </p>
      </div>
    </div>
  );
};

const Header = ({ onPreview }: { onPreview: () => void }) => {
  return (
    <div className="px-10 py-6">
      <div className="flex items-center justify-center gap-2">
        <div className="flex-1 flex gap-3">
          {/* <CustomButton
            title={`Available Canvas ${20 - selectedImages.length}/${20}`}
            icon={ICONS.image_icon}
            bg={"bg-transparent"}
            textcolor={"text-[#1A73E8]"}
          /> */}
          {/* <CustomButton
            onClick={onNewDrawing}
            title={`New Session`}
            icon={ICONS.plus_icon}
            bg={"bg-transparent"}
            textcolor={"text-[#1A73E8]"}
          /> */}
        </div>
        <div className="flex-1">
          <Image src={ICONS.logo_icon} alt="" width={100} height={100} />
        </div>
        <CustomButton
          title="Preview"
          bg={"bg-white"}
          icon={ICONS.eye_icon}
          textcolor={"text-[#1A73E8]"}
          onClick={onPreview}
        />
      </div>
    </div>
  );
};

export default Header;
