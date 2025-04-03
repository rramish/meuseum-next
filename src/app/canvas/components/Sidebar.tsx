"use client";
import Image from "next/image";
import * as fabric from "fabric";

import { useState } from "react";
import { ICONS } from "@/assets";
import { useToolsStore } from "@/store/toolsStore";
import { useCanvasStore } from "@/store/canvasStore";

const Sidebar = () => {
  const [showFolder, setShowFolder] = useState(false);
  const [active, setActive] = useState("pencil");
  const { canvasRef } = useCanvasStore();
  const {setEraser:erase} = useToolsStore();
  const [zoomlevel,setZoomlevel] = useState(1);

  const setPencil = () => {
    if (canvasRef) {
      if (canvasRef.current) {
        canvasRef.current.isDrawingMode = true;
        const instance = canvasRef.current as unknown as fabric.Canvas;
        let remp = canvasRef.current.freeDrawingBrush as unknown as fabric.PencilBrush;
        remp = new fabric.PencilBrush(
          instance
        )
        console.log(remp);
      }
    }
  };

  const toggleZoom = () =>{
    if(canvasRef){
      if(canvasRef.current){
        const instance = canvasRef.current as unknown as fabric.Canvas;
        if(zoomlevel == 1){
          instance.setZoom(zoomlevel);
          setZoomlevel(2);
        }else{
          instance.setZoom(zoomlevel);
          setZoomlevel(1);
        }
      }
    }
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (canvasRef.current?.freeDrawingBrush) {
      canvasRef.current.freeDrawingBrush.color = e.target.value;
    }
  };

  const setBrush = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current as unknown as fabric.Canvas;
      canvas.isDrawingMode = true;

      const brush = new fabric.CircleBrush(canvas);
      brush.width = 10;
      brush.color = canvas.freeDrawingBrush?.color || "#0052cc";

      canvas.freeDrawingBrush = brush;
    }
  };

  const setEraser = () => {
    if (canvasRef.current) {
      console.log("eraser funcitio")
      canvasRef.current.isDrawingMode = false;
      erase(true);
    }
  };

  return (
    <div className="flex flex-col gap-8 bg-white pr-2 rounded-r-xl py-10 -mr-6 z-10 shadow">
      <Image
        src={ICONS.pencil_icon}
        alt=""
        width={70}
        height={70}
        onClick={() => {
          setActive("pencil");
          setPencil();
        }}
        className={`py-1 cursor-pointer hover:scale-150 hover:scale-x-200 duration-300 ${
          active == "pencil" && "scale-150 scale-x-200"
        }`}
      />
      <Image
        src={ICONS.marker_icon}
        alt=""
        width={70}
        height={70}
        onClick={() => {
          setActive("marker");
        }}
        className={`py-1 cursor-pointer hover:scale-150 hover:scale-x-200 duration-300 ${
          active == "marker" && "scale-150 scale-x-200"
        }`}
      />
      <Image
        src={ICONS.brush_icon}
        alt=""
        width={70}
        height={70}
        onClick={() => {
          setActive("brush");
          setBrush();
        }}
        className={`py-1 cursor-pointer hover:scale-150 hover:scale-x-200 duration-300 ${
          active == "brush" && "scale-150 scale-x-200"
        }`}
      />
      <Image
        src={ICONS.eraser_icon}
        alt=""
        width={70}
        height={70}
        onClick={() => {
          setActive("eraser");
          setEraser();
        }}
        className={`py-1 cursor-pointer hover:scale-150 hover:scale-x-200 duration-300 ${
          active == "eraser" && "scale-150 scale-x-200"
        }`}
      />
      <div className="justify-center flex">
        <label
          htmlFor="color"
          className="h-12 w-12 rounded-full bg-[#2622A5] hover:scale-110 duration-300 cursor-pointer"
          onClick={() => {
            setActive("null");
          }}
        />
        <div className="absolute">
          <input
            type="color"
            id="color"
            defaultValue="#0052cc"
            onChange={handleColorChange}
            className="w-10 h-10 hidden"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src={ICONS.folder_icon}
          alt=""
          width={50}
          height={50}
          onClick={() => {
            setActive("null");
            setShowFolder(!showFolder);
          }}
          className={`py-1 hover:scale-110 cursor-pointer duration-300`}
        />
      </div>
      <div className="flex justify-center">
        <Image
          src={ICONS.zoom_2x_icon}
          alt=""
          width={50}
          height={50}
          onClick={() => {
            setActive("null");
            toggleZoom();
          }}
          className={`py-1 hover:scale-110 cursor-pointer duration-300`}
        />
      </div>
    </div>
  );
};

export default Sidebar;
