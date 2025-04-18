"use client";
import React, { useRef, useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DrawingCanvas from "./components/CanvasEditor";

import { NameModal } from "./components/NameModal";
import { useCanvasStore } from "@/store/canvasStore";
import { useImageStorage } from "@/store/imageStore";
import { ConfirmModal } from "./components/ConfirmModal";

const Canvas = () => {
  const { canvasRef } = useCanvasStore();
  const { setSubmissionUrl } = useImageStorage();

  const [showModal, setShowModal] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undoStack = useRef<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const redoStack = useRef<any>([]);

  const handleUndo = () => {
    if (!canvasRef.current || undoStack.current.length === 1) return;
    const canvas = canvasRef.current;
    const lastObject = undoStack.current.pop();
    if (lastObject) {
      canvas.remove(lastObject);
      redoStack.current.push(lastObject);
      canvas.renderAll();
    }
  };

  const handleRedo = () => {
    if (!canvasRef.current || redoStack.current.length === 0) return;
    const canvas = canvasRef.current;
    const object = redoStack.current.pop();
    if (object) {
      canvas.add(object);
      undoStack.current.push(object);
      canvas.renderAll();
    }
  };

  return (
    <>
      <div className="flex flex-col bg-blue min-h-screen">
        {/* <Image
          src={ICONS.bg_image}
          alt=""
          width={100}
          height={100}
          className={`absolute -z-10 top-0 left-0 w-full min-h-screen`}
        /> */}
        {!showModal && !showConfirmModal && (
          <Header
            onRedo={handleRedo}
            onUndo={handleUndo}
            onFinishDrawing={() => {
              const finalImageDataUrl = canvasRef.current!.toDataURL();
              setSubmissionUrl(finalImageDataUrl);
              setShowConfirmModal(true);
            }}
          />
        )}
        {showModal && (
          <>
            <div className="h-full bg-black/70 absolute top-0 left-0 w-full z-0" />
            <NameModal
              onclose={() => {
                setShowModal(false);
              }}
            />
          </>
        )}
        {showConfirmModal && (
          <>
            <div className="h-full bg-black/70 absolute top-0 left-0 w-full z-0" />
            <ConfirmModal
              onclose={() => {
                setShowConfirmModal(false);
              }}
            />
          </>
        )}
        {!showModal && !showConfirmModal && (
          <div className="flex flex-1 w-full h-full">
            <div className="flex flex-1 pb-10">
              <div className="flex justify-center items-center">
                <Sidebar />
              </div>
              <div className="flex flex-1 border-[#DADCE0] border mr-10 bg-white rounded-lg">
                <DrawingCanvas redoStack={redoStack} undoStack={undoStack} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Canvas;
