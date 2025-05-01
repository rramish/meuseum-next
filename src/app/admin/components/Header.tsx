"use client";

import Image from "next/image";
import React, { useState } from "react";

import { ICONS } from "@/assets";
import { useRouter } from "next/navigation";

export const CustomButton = ({
  id,
  bg,
  icon,
  textcolor,
  width = 20,
  height = 20,
  title = "Button",
  onClick = () => {},
  fontsize = "text-base",
}: {
  id?: string;
  bg?: string;
  icon?: string;
  width?: number;
  title?: string;
  height?: number;
  fontsize?: string;
  textcolor?: string;
  disabled?: boolean;
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
  onReset,
  onReload,
  onPreview,
  onConstruct,
  onNewDrawing,
  onEndSession,
  logout = false,
  piecesLength = 0,
  backButton = false,
}: {
  reload?: boolean;
  logout?: boolean;
  onReset?: () => void;
  backButton?: boolean;
  piecesLength?: number;
  onReload?: () => void;
  onPreview?: () => void;
  onConstruct?: () => void;
  onNewDrawing?: () => void;
  onEndSession?: () => void;
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await localStorage.removeItem("token");
    setLoading(false);
    router.push("/login");
  };

  console.log("length", piecesLength);

  return (
    <div className="px-10 py-6">
      <div className="flex items-center justify-center gap-2 h-full flex-wrap flex-col md:flex-row md:justify-between">
        <div className="flex gap-2 flex-wrap items-start justify-center md:justify-start flex-1">
          {logout && (
            <CustomButton
              title="Logout"
              bg={"bg-white"}
              disabled={loading}
              onClick={handleLogout}
              icon={ICONS.logout_icon}
              textcolor={"text-[#F287B7]"}
            />
          )}
          {backButton && (
            <CustomButton
              title="Back"
              bg={"bg-white"}
              onClick={() => {
                router.back();
              }}
              icon={ICONS.back_icon}
              textcolor={"text-[#F287B7]"}
            />
          )}
          {onReload && (
            <CustomButton
              title="Reload"
              bg={"bg-white"}
              onClick={onReload}
              icon={ICONS.reload_icon}
              textcolor={"text-[#F287B7]"}
            />
          )}
        </div>

        <div className="self-center flex items-center justify-center flex-1">
          <Image src={ICONS.logo} alt="mosida_logo" width={150} height={150} />
        </div>
        <div className="flex gap-2 flex-wrap justify-center items-center md:justify-end flex-1">
          {onNewDrawing && (
            <CustomButton
              id="step2"
              onClick={onNewDrawing}
              title="New Session"
              icon={ICONS.plus_icon}
              bg={"bg-transparent"}
              textcolor={"text-[#F287B7]"}
            />
          )}

          {piecesLength > 0 && piecesLength < 20 && (
            <CustomButton
            disabled={true}
            bg={"bg-white"}
            title="Complete"
            onClick={onEndSession}
              textcolor={"text-[#F287B7]"}
            />
          )}

          {onPreview && (
            <CustomButton
              onClick={onPreview}
              title="Preview"
              bg={"bg-white"}
              icon={ICONS.eye_icon}
              textcolor={"text-[#F287B7]"}
            />
          )}

          {onConstruct && (
            <CustomButton
              onClick={onConstruct}
              title="Reconstruct"
              bg={"bg-[#F287B7]"}
              icon={ICONS.check_icon}
              textcolor={"text-white"}
            />
          )}

          {onReset && (
            <CustomButton
              onClick={onReset}
              title="Reset Session"
              bg={"bg-[#F287B7]"}
              textcolor={"text-white"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
