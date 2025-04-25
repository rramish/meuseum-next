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
  imageOpacity: number;
  setImageOpacity: (val: number) => void;
  updateImageOpacity: (val: number) => void;
};

const FolderModal = ({
  brushSize,
  setBrushSize,
  brushOpacity,
  updateBrushSize,
  setBrushOpacity,
  updateBrushOpacity,
  imageOpacity,
  setImageOpacity,
  updateImageOpacity,
}: FolderModalProps) => {
  return (
    <div className="absolute w-60 left-16 p-4 rounded-lg text-black border border-[#E6E7EA] bg-white z-10">
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
      <div className="flex gap-2 mb-3">
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
      <div className="flex gap-2">
        <p className="w-14">Image Opacity</p>
        <input
          type="range"
          className="w-44"
          min={0}
          max={1}
          step={0.01}
          value={imageOpacity}
          onChange={(e) => {
            const newOpacity = parseFloat(e.target.value);
            setImageOpacity(newOpacity);
            updateImageOpacity(newOpacity);
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
  const [imageOpacity, setImageOpacity] = useState<number>(1);

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

  const updateImageOpacity = (opacity: number) => {
    const canvas = canvasRef?.current as unknown as fabric.Canvas;
    if (canvas && canvas._objects.length > 0) {
      const imageObject = canvas._objects[0];
      if (imageObject && imageObject.type === "image") {
        imageObject.opacity = opacity;
        canvas.renderAll();
      }
    }
  };

  const setPencil = () => {
    const canvas = canvasRef?.current as unknown as fabric.Canvas;

    if (canvas) {
      canvas.off("mouse:down");

      const canvasContainer = canvas.lowerCanvasEl.parentNode as HTMLElement;
      canvasContainer.classList.remove("canvas-zoom");

      canvas.isDrawingMode = true;

      const pencilBrush = new fabric.PencilBrush(canvas);
      pencilBrush.width = brushSize;
      pencilBrush.color = getBrushColorWithOpacity();
      canvas.freeDrawingBrush = pencilBrush;

      setActive("pencil");
    }
  };

  const setBrush = () => {
    const canvas = canvasRef?.current as unknown as fabric.Canvas;

    if (canvas) {
      canvas.off("mouse:down");

      const canvasContainer = canvas.lowerCanvasEl.parentNode as HTMLElement;
      canvasContainer.classList.remove("canvas-zoom");

      canvas.isDrawingMode = true;

      const circleBrush = new fabric.CircleBrush(canvas);
      circleBrush.width = brushSize;
      circleBrush.color = getBrushColorWithOpacity();
      canvas.freeDrawingBrush = circleBrush;

      setActive("brush");
    }
  };

  const setEraserTool = () => {
    const canvas = canvasRef?.current as unknown as fabric.Canvas;

    if (canvas) {
      canvas.off("mouse:down");

      const canvasContainer = canvas.lowerCanvasEl.parentNode as HTMLElement;
      canvasContainer.classList.remove("canvas-zoom");

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
    const canvas = canvasRef?.current as unknown as fabric.Canvas;
    const canvasContainer = canvas?.lowerCanvasEl.parentNode as HTMLElement;

    if (canvas) {
      canvas.off("mouse:down");

      if (zoomlevel === 1) {
        canvasContainer.classList.add("canvas-zoom");
        canvas.isDrawingMode = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const zoomHandler = (event: any) => {
          const pointer = canvas.getPointer(event.e);
          canvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), 2);
          setZoomlevel(2);
        };

        canvas.on("mouse:down", zoomHandler);

        setActive("zoom");
      } else {
        canvas.zoomToPoint(new fabric.Point(0, 0), 1);
        canvas.absolutePan(new fabric.Point(0, 0));
        canvasContainer.classList.remove("canvas-zoom");
        setZoomlevel(1);

        canvas.off("mouse:down");
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
          setShowFolder(false);
        }}
        className={`py-1 cursor-pointer hover:scale-150 duration-300 ${
          active === "pencil" && "scale-150 scale-x-150"
        }`}
        style={{
          opacity: active === "pencil" && brushOpacity > 0 ? brushOpacity : 1,
        }}
      />
      <Image
        src={ICONS.brush_icon}
        alt="Brush Tool"
        width={50}
        height={50}
        onClick={() => {
          setActive("brush");
          setBrush();
          setShowFolder(false);
        }}
        className={`py-1 cursor-pointer hover:scale-150 duration-300 ${
          active === "brush" && "scale-150 scale-x-150"
        }`}
        style={{
          opacity: active === "brush" && brushOpacity > 0 ? brushOpacity : 1,
        }}
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
            brushOpacity={brushOpacity}
            setBrushOpacity={setBrushOpacity}
            updateBrushSize={updateBrushSize}
            updateBrushOpacity={updateBrushOpacity}
            imageOpacity={imageOpacity}
            setImageOpacity={setImageOpacity}
            updateImageOpacity={updateImageOpacity}
          />
        )}
      </div>
      <div className="flex justify-center">
        <Image
          src={zoomlevel === 1 ? ICONS.zoom_2x_icon : ICONS.zoom_1x_icon}
          alt={zoomlevel === 1 ? "Zoom In Tool" : "Zoom Out Tool"}
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
