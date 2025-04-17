"use client";
import Image from "next/image";
import React, { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DrawingCanvas from "./components/CanvasEditor";

import { ICONS } from "@/assets";
import { NameModal } from "./components/NameModal";
import { useCanvasStore } from "@/store/canvasStore";
import { useImageStorage } from "@/store/imageStore";
import { ConfirmModal } from "./components/ConfirmModal";

const Canvas = () => {
  const { canvasRef } = useCanvasStore();
  const {setSubmissionUrl} = useImageStorage();

  const [showModal, setShowModal] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Image
          src={ICONS.bg_image}
          alt=""
          width={100}
          height={100}
          className={`absolute -z-10 top-0 left-0 w-full min-h-screen`}
        />
        <Header
          onFinishDrawing={() => {
            // canvasRef.current!.toDataURL()
            const finalImageDataUrl = canvasRef.current!.toDataURL();
            setSubmissionUrl(finalImageDataUrl);
            setShowConfirmModal(true);
          }}
        />
        {showModal && (
          <>
            <div className="h-full bg-black/70 absolute top-0 left-0 w-full z-0" />
            <div className="h-[700px]">
              <NameModal
                onclose={() => {
                  setShowModal(false);
                }}
              />
            </div>
          </>
        )}
        {showConfirmModal && (
          <>
            <div className="h-[1000px] bg-black/70 absolute top-0 left-0 w-full z-0" />
            <div className="h-[750px]">
              <ConfirmModal
                onclose={() => {
                  setShowConfirmModal(false);
                }}
              />
            </div>
          </>
        )}
        {!showModal && !showConfirmModal && (
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
        )}
      </div>
    </>
  );
};

export default Canvas;
