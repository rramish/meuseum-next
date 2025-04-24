"use client";
import * as fabric from "fabric";

import { useCanvasStore } from "@/store/canvasStore";
import { useImageStorage } from "@/store/imageStore";
import { useRef, useEffect, useState, useCallback } from "react";

const CanvasEditor = ({
  redoStack,
  undoStack,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redoStack: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undoStack: any;
}) => {
  const { setCanvasRef } = useCanvasStore();

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

  const trackObject = (obj: fabric.Object) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(obj as any)._isBackground) {
      undoStack.current.push(obj);
      redoStack.current.push(obj);
    }
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

    canvas.on("object:added", (e) => {
      if (e.target) trackObject(e.target);
    });

    canvasRef.current.addEventListener("contextmenu", handleRightClick);
    canvas.on("mouse:dblclick", toggleZoom);

    return () => {
      canvas.dispose();
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("contextmenu", handleRightClick);
      }
    };
  }, [canvasRef, setCanvasRef, canvasWidth, canvasHeight]);

  const { imagePiece } = useImageStorage();

  const handleAddImage = useCallback(() => {
    if (!canvasInstance.current || !imagePiece || !imagePiece.dataUrl) return;

    const canvas = canvasInstance.current;
    const imageElement = document.createElement("img");
    imageElement.src = imagePiece.dataUrl;

    imageElement.onload = () => {
      const imgWidth = imageElement.naturalWidth;
      const imgHeight = imageElement.naturalHeight;
      const fabricImage = new fabric.Image(imageElement);

      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      fabricImage.set({
        left: 0,
        top: 0,
        width: canvasWidth,
        height: canvasHeight,
        scaleX: canvasWidth / imgWidth,
        scaleY: canvasHeight / imgHeight,
        selectable: false,
        evented: false,
      });

      canvas.add(fabricImage);
      canvas.renderAll();
    };
  }, [canvasWidth, canvasHeight, imagePiece]);
  useEffect(() => {
    handleAddImage();
  }, [handleAddImage]);

  return (
    <div className="relative w-full h-full" ref={canvasContainerRef}>
      <canvas
        className="rounded-0 absolute top-0 left-0 w-full"
        ref={canvasRef}
      />
    </div>
  );
};

export default CanvasEditor;
