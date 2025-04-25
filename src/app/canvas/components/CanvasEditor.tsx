"use client";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import * as fabric from "fabric";

import { useCanvasStore } from "@/store/canvasStore";
import { useImageStorage } from "@/store/imageStore";

const CanvasEditor = ({
  redoStack,
  undoStack,
  zoomlevel,
  setZoomlevel,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redoStack: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  undoStack: any;
  zoomlevel: number;
  setZoomlevel: (zoomlevel: number) => void;
}) => {
  const { setCanvasRef } = useCanvasStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);

  const updateCanvasDimensions = useCallback(() => {
    if (canvasContainerRef.current) {
      const { offsetWidth, offsetHeight } = canvasContainerRef.current;
      setCanvasWidth(offsetWidth);
      setCanvasHeight(offsetHeight);
    }
  }, []);

  useLayoutEffect(() => {
    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);
    return () => {
      window.removeEventListener("resize", updateCanvasDimensions);
    };
  }, [updateCanvasDimensions]);

  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);
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
    setZoomlevel(newZoom);

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
  }, [canvasWidth, canvasHeight, canvasRef, setCanvasRef]);

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
        scaleX: canvasWidth / imgWidth,
        scaleY: canvasHeight / imgHeight,
        selectable: false,
        evented: false,
      });

      canvas.add(fabricImage);
      canvas.renderAll();
    };
  }, [imagePiece, canvasWidth, canvasHeight]);

  useEffect(() => {
    handleAddImage();
  }, [handleAddImage]);

  return (
    <div className="relative w-full h-full" ref={canvasContainerRef}>
      <canvas
        className="absolute top-0 left-0 w-full rounded-none"
        ref={canvasRef}
      />
    </div>
  );
};

export default CanvasEditor;
