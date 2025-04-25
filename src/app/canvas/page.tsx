"use client";
import React, { useRef, useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DrawingCanvas from "./components/CanvasEditor";

import { BackModal } from "./components/BackModal";
import { NameModal } from "./components/NameModal";
import { useCanvasStore } from "@/store/canvasStore";
import { useImageStorage } from "@/store/imageStore";
import { ConfirmModal } from "./components/ConfirmModal";

const Canvas = () => {
  const { canvasRef } = useCanvasStore();
  const { setSubmissionUrl } = useImageStorage();

  const [zoomlevel, setZoomlevel] = useState(1);
  const [showModal, setShowModal] = useState(true);
  const [showBackModal, setShowBackModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toggleImage, setToggleImage] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const undoStack = useRef<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const redoStack = useRef<any>([]);

  const handleUndo = () => {
    if (!canvasRef.current || undoStack.current.length === 1) return;
    if (undoStack.current.length > 1) {
      const canvas = canvasRef.current;
      const lastObject = undoStack.current.pop();
      if (lastObject) {
        canvas.remove(lastObject);
        redoStack.current.push(lastObject);
        canvas.renderAll();
      }
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

  const handleToggle = () => {
    const toggled = toggleImage;
    setToggleImage(!toggleImage);
    const canvas = canvasRef?.current as unknown as fabric.Canvas;

    if (canvas && canvas._objects.length > 0) {
      canvas._objects.forEach((obj, index) => {
        if (index !== 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          toggled ? obj.set("opacity", 1) : obj.set("opacity", 0);
        }
        canvas.renderAll();
      });
    }
  };

  return (
    <div className="flex flex-col bg-blue min-h-screen">
      <Header
        toggleImage={toggleImage}
        onToggle={handleToggle}
        onRedo={handleRedo}
        onUndo={handleUndo}
        onFinishDrawing={() => {
          if(toggleImage){
            handleToggle();
          }
          const finalImageDataUrl = canvasRef.current!.toDataURL();
          setSubmissionUrl(finalImageDataUrl);
          setShowConfirmModal(true);
        }}
        onGoBack={() => {
          const finalImageDataUrl = canvasRef.current!.toDataURL();
          setSubmissionUrl(finalImageDataUrl);
          setShowBackModal(true);
        }}
      />
      {showModal && (
        <>
          <div className="h-[900px] bg-black/70 absolute top-0 left-0 w-full z-20" />
          <div className="absolute z-30 top-0 h-[900px] w-full justify-center flex items-center">
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
          <div className="h-[900px] bg-black/70 absolute top-0 left-0 w-full z-20" />
          <div className="absolute z-30 top-0 h-[900px] w-full justify-center flex items-center">
            <ConfirmModal
              onclose={() => {
                setShowConfirmModal(false);
              }}
            />
          </div>
        </>
      )}
      {showBackModal && (
        <>
          <div className="h-[900px] bg-black/70 absolute top-0 left-0 w-full z-20" />
          <div className="absolute z-30 top-0 h-[900px] w-full justify-center flex items-center">
            <BackModal
              onclose={() => {
                setShowBackModal(false);
              }}
            />
          </div>
        </>
      )}
      <div className="flex flex-1 w-full h-full">
        <div className="flex flex-1 pb-10">
          <div className="flex justify-center items-center">
            <Sidebar zoomlevel={zoomlevel} setZoomlevel={setZoomlevel} />
          </div>
          <div className="flex flex-1 mr-10 bg-white">
            <DrawingCanvas zoomlevel={zoomlevel} setZoomlevel={setZoomlevel} redoStack={redoStack} undoStack={undoStack} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
