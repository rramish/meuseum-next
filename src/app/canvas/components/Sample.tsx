"use client";
import * as fabric from "fabric";

import { useRef, useEffect } from "react";
import { useToolsStore } from "@/store/toolsStore";
import { useCanvasStore } from "@/store/canvasStore";
import { useImageStorage } from "@/store/imageStore";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const { setCanvasRef } = useCanvasStore();
  const { eraser, setEraser } = useToolsStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleZoom = (event: any) => {
    if (!canvasRef.current) return;

    const instance = canvasRef.current as unknown as fabric.Canvas;

    const pointer = instance.getPointer(event.e);

    const newZoom = instance.getZoom() === 1 ? 2 : 1;

    instance.zoomToPoint(new fabric.Point(pointer.x, pointer.y), newZoom);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1200,
      height: 700,
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

    console.log("eraser on 1");
    if (eraser) {
      console.log("eraser on");
      if (!canvasInstance.current) return;
      console.log("not return");
      const canvas = canvasInstance.current;
      const activeObjects = canvas.getActiveObjects();
      console.log("active objects ",activeObjects);
      if (activeObjects.length > 0) {
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }

    canvasRef.current.addEventListener("contextmenu", handleRightClick);
    canvas.on("mouse:dblclick", toggleZoom);

    return () => {
      canvas.dispose();
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("contextmenu", handleRightClick);
      }
    };
  }, [eraser, canvasRef, setEraser]);

  useEffect(() =>{
    console.log("eraser on 2");
    if (eraser) {
      console.log("eraser on 2");
      if (!canvasInstance.current) return;
      console.log("not return 2");
      const canvas = canvasInstance.current;
      const activeObjects = canvas.getActiveObjects();
      console.log("active objects 2",activeObjects);
      if (activeObjects.length > 0) {
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  }, [canvasInstance.current, eraser])

  const { imagePiece } = useImageStorage();

  // const handleAddImage = () => {
  //   if (!canvasInstance.current) return;

  //   const canvas = canvasInstance.current;
  //   if (!imagePiece) return;

  //   const imageElement = document.createElement("img");
  //   imageElement.src = imagePiece.dataUrl;

  //   imageElement.onload = () => {
  //     const image = new fabric.Image(imageElement);

  //     const aspectRatio = imageElement.width / imageElement.height;
  //     const canvasAspectRatio = canvas.width! / canvas.height!;

  //     let scaleFactor;
  //     if (aspectRatio > canvasAspectRatio) {
  //       scaleFactor = canvas.width! / imageElement.width;
  //     } else {
  //       scaleFactor = canvas.height! / imageElement.height;
  //     }

  //     image.set({
  //       left: 0,
  //       top: 0,
  //       selectable: false,
  //       evented: false,
  //     });

  //     image.scale(scaleFactor);
  //     canvas.add(image);
  //     canvas.renderAll();
  //   };
  // };

  const handleAddImage = () => {
    if (!canvasInstance.current || !imagePiece || !imagePiece.dataUrl) return;

    const canvas = canvasInstance.current;
    const imageElement = document.createElement("img");
    imageElement.src = imagePiece.dataUrl;

    imageElement.onload = () => {
      const image = new fabric.Image(imageElement);
      const aspectRatio = imageElement.width / imageElement.height;
      const canvasAspectRatio = (canvas.width || 1345) / (canvas.height || 700);

      let scaleFactor;
      if (aspectRatio > canvasAspectRatio) {
        // Image is wider: scale by height, crop width
        scaleFactor = (canvas.height || 700) / imageElement.height;
      } else {
        // Image is taller: scale by width, crop height
        scaleFactor = (canvas.width || 1345) / imageElement.width;
      }

      image.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        originX: "center", // Center the image
        originY: "center",
      });

      // Position image at canvas center
      image.setCoords();
      image.left = (canvas.width || 1345) / 2;
      image.top = (canvas.height || 700) / 2;

      canvas.add(image);
      canvas.renderAll();
    };
  };

  useEffect(() => {
    handleAddImage();
  }, []);

  return (
    <div className="container relative">
      <canvas
        width={"100%"}
        height={"100%"}
        className="border border-dotted border-white"
        ref={canvasRef}
      />
    </div>
  );
}

export default App;
