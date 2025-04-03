"use client";
import React from "react";
import Image from "next/image";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DrawingCanvas from "./components/Sample";

import { ICONS } from "@/assets";


const Canvas = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Image
          src={ICONS.bg_image}
          alt=""
          width={100}
          height={100}
          className={`absolute -z-10 top-0 left-0 w-full h-screen`}
        />
        <Header />
        <div className="flex flex-1 w-full h-full">
          <div className="flex flex-1 pb-10">
            <div className="flex justify-center items-center">
              <Sidebar />
            </div>
            <div className="flex flex-1 border-[#DADCE0] border mr-10 bg-white rounded-lg">
              <DrawingCanvas />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Canvas;
