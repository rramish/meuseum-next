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
      className={`flex items-center cursor-pointer hover:scale-105 duration-300 border gap-2 border-[#DADCE0] px-2 py-1 md:px-4  md:py-2  ${textcolor} ${bg} rounded-lg`}
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
        <p className={`${fontsize} text-sm md:text-base`}>{title} </p>
      </div>
    </div>
  );
};

const Header = ({
  onPreview,
  length,
}: {
  onPreview: () => void;
  length: number;
}) => {
  return (
    <div className="px-10 py-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 justify-center flex "></div>
        <div className="flex-1 justify-center flex ">
          <Image
            src={ICONS.logo}
            alt="logo image"
            width={150}
            height={150}
            className="max-w-full max-h-full"
          />
        </div>
        <div className="flex-1 justify-end flex">
          {/* {length == 20 && ( */}
            <CustomButton
              onClick={onPreview}
              title="Preview"
              bg={"bg-white"}
              icon={ICONS.eye_icon}
              textcolor={"text-[#1A73E8]"}
            />
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default Header;
