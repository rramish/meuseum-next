"use client"
import { ICONS } from "@/assets";
import { useSelectedImagesStore } from "@/store/imagesSessionStore";
import Image from "next/image";
import React from "react";

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
  icon: string;
  width?: number;
  height?: number;
  fontsize?: string;
  title?: string;
  bg?: string;
  onClick?: () => void;
  textcolor?: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center cursor-pointer hover:scale-105 duration-300 border gap-2 border-[#DADCE0] ${textcolor} ${bg} rounded-lg px-4 py-2`}
    >
      <div>
        <Image
          src={icon || ICONS.image_icon}
          alt="image"
          width={width}
          height={height}
        />
      </div>
      <div className="flex items-center">
        <p className={`${fontsize}`}>{title} </p>
      </div>
    </div>
  );
};

const Header = () => {
  const {selectedImages} = useSelectedImagesStore();
  return (
    <div className="px-10 py-6">
      <div className="flex">
        <div className="flex-1 flex">
          <CustomButton
            title={`Available Canvas ${20-selectedImages.length}/${20}`}
            icon={ICONS.image_icon}
            bg={"bg-transparent"}
            textcolor={"text-[#1A73E8]"}
          />
        </div>
        <div className="flex-1">
          <Image src={ICONS.logo_icon} alt="" width={100} height={100} />
        </div>
        {/* <CustomButton
          title="Submit Work"
          icon={ICONS.check_icon}
          bg={"bg-[#1A73E8]"}
          textcolor={"text-white"}
        /> */}
      </div>
    </div>
  );
};

export default Header;
