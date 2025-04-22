"use client";

import Image from "next/image";
import * as fabric from "fabric";
import { useState } from "react";

import { ICONS } from "@/assets";
import { useToolsStore } from "@/store/toolsStore";
import { useCanvasStore } from "@/store/canvasStore";

const hexToRgba = (hex: string, opacity: number) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

type FolderModalProps = {
  brushSize: number;
  brushOpacity: number;
  setBrushSize: (val: number) => void;
  updateBrushSize: (val: number) => void;
  setBrushOpacity: (val: number) => void;
  updateBrushOpacity: (val: number) => void;
};

const FolderModal = ({
  brushSize,
  setBrushSize,
  brushOpacity,
  updateBrushSize,
  setBrushOpacity,
  updateBrushOpacity,
}: FolderModalProps) => {
  return (
    <div className="absolute w-60 left-16 p-4 rounded-lg text-black border border-[#E6E7EA] bg-white z-50">
      <div className="flex gap-2 mb-3">
        <p className="w-14">Size</p>
        <input
          type="range"
          className="w-44"
          min={1}
          max={100}
          value={brushSize}
          onChange={(e) => {
            const newSize = parseInt(e.target.value);
            setBrushSize(newSize);
            updateBrushSize(newSize);
          }}
        />
      </div>
      <div className="flex gap-2">
        <p className="w-14">Opacity</p>
        <input
          type="range"
          className="w-44"
          min={0}
          max={1}
          step={0.01}
          value={brushOpacity}
          onChange={(e) => {
            const newOpacity = parseFloat(e.target.value);
            setBrushOpacity(newOpacity);
            updateBrushOpacity(newOpacity);
          }}
        />
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { setEraser } = useToolsStore();
  const { canvasRef } = useCanvasStore();

  const [zoomlevel, setZoomlevel] = useState(1);
  const [active, setActive] = useState("pencil");
  const [showFolder, setShowFolder] = useState(false);
  const [brushSize, setBrushSize] = useState<number>(10);
  const [brushOpacity, setBrushOpacity] = useState<number>(1);
  const [brushColor, setBrushColor] = useState<string>("#0052cc");

  const getBrushColorWithOpacity = () => hexToRgba(brushColor, brushOpacity);

  const updateBrushSize = (size: number) => {
    const canvas = canvasRef?.current as unknown as fabric.Canvas;
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = size;
    }
  };

  const updateBrushOpacity = (opacity: number) => {
    const canvas = canvasRef?.current as unknown as fabric.Canvas;
    if (active === "eraser") {
      if (canvas?.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = "#FFFFFF";
      }
    } else {
      if (canvas?.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = hexToRgba(brushColor, opacity);
      }
    }
  };

  const setPencil = () => {
    if (canvasRef?.current) {
      const canvas = canvasRef.current as unknown as fabric.Canvas;
      canvas.isDrawingMode = true;
      const pencilBrush = new fabric.PencilBrush(canvas);
      pencilBrush.width = brushSize;
      pencilBrush.color = getBrushColorWithOpacity();
      canvas.freeDrawingBrush = pencilBrush;
    }
  };

  const setBrush = () => {
    if (canvasRef?.current) {
      const canvas = canvasRef.current as unknown as fabric.Canvas;
      canvas.isDrawingMode = true;
      const circleBrush = new fabric.CircleBrush(canvas);
      circleBrush.width = brushSize;
      circleBrush.color = getBrushColorWithOpacity();
      canvas.freeDrawingBrush = circleBrush;
    }
  };

  const setEraserTool = () => {
    const canvas = canvasRef?.current as unknown as fabric.Canvas;
    if (canvas) {
      canvas.isDrawingMode = true;
      const eraserBrush = new fabric.PencilBrush(canvas);
      eraserBrush.width = brushSize;
      eraserBrush.color = "#FFFFFF";
      canvas.freeDrawingBrush = eraserBrush;
      setEraser(true);
      setActive("eraser");
    }
  };

  const toggleZoom = () => {
    if (canvasRef?.current) {
      const canvas = canvasRef.current;
      if (zoomlevel === 1) {
        canvas.setZoom(2);
        setZoomlevel(2);
      } else {
        canvas.setZoom(1);
        setZoomlevel(1);
        canvas.absolutePan(new fabric.Point(0, 0));
      }
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBrushColor(newColor);
    const canvas = canvasRef?.current as unknown as fabric.Canvas;
    if (active === "eraser") {
      if (canvas?.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = "#FFFFFF";
      }
    } else {
      if (canvas?.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = hexToRgba(newColor, brushOpacity);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white pr-2 rounded-r-xl py-14 -mr-6 z-10 shadow">
      <Image
        src={ICONS.pencil_icon}
        alt="Pencil Tool"
        width={50}
        height={50}
        onClick={() => {
          setActive("pencil");
          setPencil();
        }}
        className={`py-1 cursor-pointer hover:scale-150 duration-300 ${
          active === "pencil" && "scale-150 scale-x-150"
        }`}
      />
      <Image
        src={ICONS.brush_icon}
        alt="Brush Tool"
        width={50}
        height={50}
        onClick={() => {
          setActive("brush");
          setBrush();
        }}
        className={`py-1 cursor-pointer hover:scale-150 duration-300 ${
          active === "brush" && "scale-150 scale-x-150"
        }`}
      />
      <Image
        src={ICONS.eraser_icon}
        alt="Eraser Tool"
        width={50}
        height={50}
        onClick={setEraserTool}
        className={`py-1 cursor-pointer hover:scale-150 hover:scale-x-200 duration-300 ${
          active === "eraser" && "scale-150 scale-x-200"
        }`}
      />
      <div className="justify-center flex">
        <label
          htmlFor="color"
          className="h-8 w-8 rounded-full hover:scale-110 duration-300 cursor-pointer"
          style={{ backgroundColor: brushColor ? brushColor : "#0052cc" }}
        />
        <div className="absolute">
          <input
            type="color"
            id="color"
            defaultValue="#0052cc"
            onChange={handleColorChange}
            className="w-4 h-4 hidden"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src={ICONS.folder_icon}
          alt="Brush Settings"
          width={30}
          height={30}
          onClick={() => {
            setShowFolder(!showFolder);
          }}
          className={`py-1 hover:scale-110 cursor-pointer duration-300`}
        />
        {showFolder && (
          <FolderModal
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            updateBrushSize={updateBrushSize}
            brushOpacity={brushOpacity}
            setBrushOpacity={setBrushOpacity}
            updateBrushOpacity={updateBrushOpacity}
          />
        )}
      </div>
      <div className="flex justify-center">
        <Image
          src={ICONS.zoom_2x_icon}
          alt="Zoom Tool"
          width={30}
          height={50}
          onClick={() => {
            toggleZoom();
          }}
          className={`py-1 hover:scale-110 cursor-pointer duration-300`}
        />
      </div>
    </div>
  );
};

export default Sidebar;
