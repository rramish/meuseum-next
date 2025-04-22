"use client";

import Image from "next/image";
import React from "react";

import { ICONS } from "@/assets";

export const CustomButton = ({
  icon,
  title = "Button",
  fontsize = "text-base",
  bg,
  id,
  textcolor,
  onClick = () => {},
  width = 20,
  height = 20,
}: {
  id?: string;
  bg?: string;
  icon?: string;
  width?: number;
  title?: string;
  height?: number;
  fontsize?: string;
  textcolor?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`flex items-center cursor-pointer hover:scale-105 duration-300 border gap-2 border-[#DADCE0] ${textcolor} ${bg} rounded-lg px-4 py-2 w-auto`}
    >
      {icon && (
        <Image
          src={icon || ICONS.image_icon}
          alt="image"
          width={width}
          height={height}
        />
      )}

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
  onReset,
}: {
  onNewDrawing?: () => void;
  onPreview?: () => void;
  onConstruct?: () => void;
  onReset?: () => void;
}) => {

  return (
    <div className="px-10 py-6">
      <div className="flex items-center justify-center gap-2 h-full flex-wrap flex-col md:flex-row md:justify-between">
        <div className="flex gap-2 flex-wrap items-center justify-center">
          {/* <CustomButton
            id="step1"
            onClick={() => {
              window.location.reload();
            }}
            title={`Canvas ${
              selectedImages.length > 0 ? 20 - selectedImages.length : ""
            } ${selectedImages.length > 0 ? "/" : ""} ${
              selectedImages.length > 0 ? 20 : ""
            }`}
            icon={ICONS.image_icon}
            bg={"bg-transparent"}
            textcolor={"text-[#1A73E8]"}
          /> */}
          {/* <CustomButton
            id="step2"
            onClick={onNewDrawing}
            title="New Session"
            icon={ICONS.plus_icon}
            bg={"bg-transparent"}
            textcolor={"text-[#1A73E8]"}
          /> */}
        </div>

        <div className="self-center flex items-center justify-center">
          <Image src={ICONS.logo} alt="mosida_logo" width={100} height={100} />
        </div>
        <div className="flex gap-2 flex-wrap  items-center justify-center">
          {onNewDrawing && (
            <CustomButton
              id="step2"
              onClick={onNewDrawing}
              title="New Session"
              icon={ICONS.plus_icon}
              bg={"bg-transparent"}
              textcolor={"text-[#1A73E8]"}
            />
          )}

          {onPreview && (
            <CustomButton
              onClick={onPreview}
              title="Preview"
              bg={"bg-white"}
              icon={ICONS.eye_icon}
              textcolor={"text-[#1A73E8]"}
            />
          )}

          {onConstruct && (
            <CustomButton
              onClick={onConstruct}
              title="Reconstruct"
              bg={"bg-[#1A73E8]"}
              icon={ICONS.check_icon}
              textcolor={"text-white"}
            />
          )}

          {onReset && (
            <CustomButton
              onClick={onReset}
              title="Reset Session"
              bg={"bg-[#1A73E8]"}
              textcolor={"text-white"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
