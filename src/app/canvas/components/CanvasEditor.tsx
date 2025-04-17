"use client";
import * as fabric from "fabric";
import { useRef, useEffect, useState, useCallback } from "react";
import { useToolsStore } from "@/store/toolsStore";
import { useCanvasStore } from "@/store/canvasStore";
import { useImageStorage } from "@/store/imageStore";

const CanvasEditor = () => {
  const { setCanvasRef } = useCanvasStore();
  const { eraser, setEraser } = useToolsStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const updateCanvasDimensions = useCallback(() => {
    if (canvasContainerRef.current) {
      setCanvasWidth(canvasContainerRef.current.offsetWidth);
      setCanvasHeight(canvasContainerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateCanvasDimensions);
    updateCanvasDimensions();

    return () => {
      window.removeEventListener("resize", updateCanvasDimensions);
    };
  }, [updateCanvasDimensions]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleZoom = (event: any) => {
    if (!canvasInstance.current) return;

    const instance = canvasInstance.current;
    const pointer = instance.getPointer(event.e);
    const newZoom = instance.getZoom() === 1 ? 2 : 1;

    instance.zoomToPoint(new fabric.Point(pointer.x, pointer.y), newZoom);
  };

  useEffect(() => {
    if (!canvasRef.current || !canvasWidth || !canvasHeight) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
    });

    canvasInstance.current = canvas;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCanvasRef(canvasInstance as any);

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    fabric.Object.prototype.transparentCorners = false;

    const handleRightClick = (event: MouseEvent) => {
      event.preventDefault();

      if (!canvasInstance.current) return;
      const canvas = canvasInstance.current;

      const pointer = canvas.getPointer(event);
      const zoomLevel = 2;

      if (canvas.getZoom() !== zoomLevel) {
        canvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), zoomLevel);
      } else {
        canvas.setZoom(1);
        canvas.absolutePan(new fabric.Point(0, 0));
      }
    };

    // if (eraser && canvasInstance.current) {
    //   const canvas = canvasInstance.current;
    //   const activeObjects = canvas.getActiveObjects();
    //   // if (activeObjects.length > 0) {
    //   //   activeObjects.forEach((obj) => canvas.remove(obj));
    //   //   canvas.discardActiveObject();
    //   //   canvas.renderAll();
    //   // }
    // }

    canvasRef.current.addEventListener("contextmenu", handleRightClick);
    canvas.on("mouse:dblclick", toggleZoom);

    return () => {
      canvas.dispose();
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("contextmenu", handleRightClick);
      }
    };
  }, [eraser, canvasRef, setCanvasRef, setEraser, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (eraser && canvasInstance.current) {
      const canvas = canvasInstance.current;
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length > 0) {
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  }, [canvasInstance.current, eraser]);

  const { imagePiece } = useImageStorage();

  const handleAddImage = useCallback(() => {
    if (!canvasInstance.current || !imagePiece || !imagePiece.dataUrl) return;

    const canvas = canvasInstance.current;
    const imageElement = document.createElement("img");
    imageElement.src = imagePiece.dataUrl;

    imageElement.onload = () => {
      const image = new fabric.Image(imageElement);
      const aspectRatio = imageElement.width / imageElement.height;
      const canvasAspectRatio = canvas.width / canvas.height;

      let scaleFactor;
      if (aspectRatio > canvasAspectRatio) {
        scaleFactor = canvas.height / imageElement.height;
      } else {
        scaleFactor = canvas.width / imageElement.width;
      }

      image.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        originX: "center",
        originY: "center",
      });

      image.setCoords();
      image.left = canvas.width / 2;
      image.top = canvas.height / 2;

      canvas.add(image);
      canvas.renderAll();
    };
  }, [canvasWidth, canvasHeight, imagePiece]);

  useEffect(() => {
    handleAddImage();
  }, [handleAddImage]);

  return (
    <div className="relative w-full h-full" ref={canvasContainerRef}>
      <canvas
        className="border border-dotted border-white absolute top-0 left-0 w-full h-full"
        ref={canvasRef}
      />
    </div>
  );
};

export default CanvasEditor;