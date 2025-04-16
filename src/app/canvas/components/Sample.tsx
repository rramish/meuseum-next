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
      width: 1350,
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

    if (eraser) {
      if (!canvasInstance.current) return;
      const canvas = canvasInstance.current;
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length > 0) {
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }




  }, [canvasInstance.current, eraser])

  const { imagePiece } = useImageStorage();

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
        scaleFactor = (canvas.height || 700) / imageElement.height;
      } else {
        scaleFactor = (canvas.width || 1345) / imageElement.width;
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


// "use client";
// import React, { useRef, useEffect, useState, useCallback } from "react";
// import * as fabric from "fabric";

// import { useToolsStore } from "@/store/toolsStore";
// import { useCanvasStore } from "@/store/canvasStore";
// import { useImageStorage } from "@/store/imageStore";

// // Define a type for the canvas state (JSON representation)
// type CanvasState = string;

// function App() {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const canvasInstance = useRef<fabric.Canvas | null>(null);
//   const { setCanvasRef } = useCanvasStore();
//   const { eraser } = useToolsStore(); // Removed unused setEraser if not needed elsewhere
//   const { imagePiece } = useImageStorage();

//   // --- Undo/Redo State ---
//   const [history, setHistory] = useState<CanvasState[]>([]);
//   const [redoStack, setRedoStack] = useState<CanvasState[]>([]);
//   const isPerformingUndoRedo = useRef(false); // Ref to prevent saving state during undo/redo load
//   const initialCanvasState = useRef<CanvasState | null>(null); // Track initial state

//   // --- Function to save canvas state ---
//   const saveState = useCallback(() => {
//     if (isPerformingUndoRedo.current || !canvasInstance.current) return;

//     const canvas = canvasInstance.current;
//     const jsonState = JSON.stringify(canvas.toJSON());

//     // Avoid saving identical consecutive states or the initial state repeatedly
//     const previousState = history[history.length - 1];
//      if (jsonState === previousState || (history.length === 0 && jsonState === initialCanvasState.current)) {
//         // console.log("State unchanged, not saving."); // Optional: reduce console noise
//         return;
//     }

//     console.log("Saving state...");
//     setHistory((prevHistory) => [...prevHistory, jsonState]);
//     setRedoStack([]); // Clear redo stack on new action
//   }, [history]); // Dependency on history needed here

//   // --- Undo Function ---
//   const handleUndo = () => {
//     if (history.length === 0) {
//       console.log("Undo history empty");
//       return;
//     }

//     isPerformingUndoRedo.current = true; // Set flag before loading

//     const canvas = canvasInstance.current;
//     if (!canvas) {
//         isPerformingUndoRedo.current = false;
//         return;
//     }

//     // State to load is the last one in history
//     const stateToLoad = history[history.length - 1];
//     // Get the current state to push onto the redo stack (BEFORE making changes)
//     const currentState = JSON.stringify(canvas.toJSON());


//     console.log("Undoing...");
//     setRedoStack((prevRedo) => [currentState, ...prevRedo]); // Push current state to redo
//     setHistory((prevHistory) => prevHistory.slice(0, -1)); // Remove last state from history

//     // Clear canvas before loading, might prevent flicker or issues with complex states
//     // canvas.clear(); // Optional, test if needed

//     canvas.loadFromJSON(stateToLoad, () => {
//       canvas.renderAll();
//       console.log("Undo complete, canvas re-rendered");
//       // Crucially reset the flag in the callback *after* rendering
//       isPerformingUndoRedo.current = false;
//        // Re-apply non-JSON settings if needed (zoom/pan are often preserved but good practice)
//        // const currentZoom = canvas.getZoom(); // Example if needed
//        // canvas.setZoom(currentZoom);
//     });
//   };

//   // --- Redo Function ---
//   const handleRedo = () => {
//     if (redoStack.length === 0) {
//       console.log("Redo stack empty");
//       return;
//     }

//     isPerformingUndoRedo.current = true; // Set flag

//     const canvas = canvasInstance.current;
//     if (!canvas) {
//         isPerformingUndoRedo.current = false;
//         return;
//     }

//     // State to load is the first in the redo stack
//     const stateToLoad = redoStack[0];
//     // Current state goes back into history (BEFORE making changes)
//     const currentState = JSON.stringify(canvas.toJSON());

//     console.log("Redoing...");
//     setHistory((prevHistory) => [...prevHistory, currentState]); // Push current state back to history
//     setRedoStack((prevRedo) => prevRedo.slice(1)); // Remove the first state from redo stack

//     // canvas.clear(); // Optional, test if needed

//     canvas.loadFromJSON(stateToLoad, () => {
//       canvas.renderAll();
//       console.log("Redo complete, canvas re-rendered");
//       // Reset flag in the callback
//       isPerformingUndoRedo.current = false;
//        // Re-apply non-JSON settings if needed
//     });
//   };

//    // --- Add Image Logic ---
//    const handleAddImage = useCallback(() => {
//     if (!canvasInstance.current || !imagePiece?.dataUrl) {
//       console.log("Cannot add image: Canvas or Image Data URL missing.");
//       return;
//     }

//     const canvas = canvasInstance.current;
//     const imageUrl = imagePiece.dataUrl;

//     console.log("Adding image...");

//     fabric.Image.fromURL(imageUrl, (img:any) => {
//         if (!canvas || !canvas.width || !canvas.height) {
//             console.error("Canvas not fully available when image loaded.");
//             return;
//         }
//         const canvasWidth = canvas.width;
//         const canvasHeight = canvas.height;

//         const scaleX = canvasWidth / img.width!;
//         const scaleY = canvasHeight / img.height!;
//         const scale = Math.min(scaleX, scaleY, 1);

//         img.set({
//             left: canvasWidth / 2,
//             top: canvasHeight / 2,
//             originX: 'center',
//             originY: 'center',
//             selectable: true,
//             evented: true,
//             scaleX: scale,
//             scaleY: scale,
//         });

//         canvas.add(img);
//         canvas.renderAll();
//         console.log("Image added to canvas");

//         // Save state AFTER adding the image
//         saveState();

//     }, { crossOrigin: 'anonymous' });

//   }, [imagePiece, saveState]); // Include saveState


//   // Main effect for canvas initialization and event listeners
//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const canvas = new fabric.Canvas(canvasRef.current, {
//       width: 1350,
//       height: 700,
//       objectCaching: true, // Enable object caching
//       // Consider adding preserveObjectStacking: true if layer order is important
//       // preserveObjectStacking: true,
//     });

//     canvasInstance.current = canvas;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     setCanvasRef(canvasInstance as any); // Use correct type if possible

//     canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
//     fabric.Object.prototype.transparentCorners = false;

//      // --- Save Initial State ---
//     setTimeout(() => {
//         if (!canvasInstance.current) return; // Check again inside timeout
//         const initialStateJson = JSON.stringify(canvasInstance.current.toJSON());
//         initialCanvasState.current = initialStateJson;
//         // Start with empty history, first *change* will populate it.
//         setHistory([]);
//         setRedoStack([]);
//         console.log("Initial state captured.");
//     }, 0);


//     // --- Event Listeners for Saving State ---
//     const handleCanvasChange = () => {
//         // Debounce or throttle saveState here if performance becomes an issue
//         // For simplicity now, save directly
//         saveState();
//     };

//     canvas.on("object:added", handleCanvasChange);
//     canvas.on("object:removed", handleCanvasChange);
//     canvas.on("object:modified", handleCanvasChange); // Catches transforms, property changes
//     canvas.on("path:created", handleCanvasChange); // For free drawing

//     // --- Existing Zoom Event Listeners ---
//     const handleRightClick = (event: MouseEvent) => {
//       event.preventDefault();
//       if (!canvasInstance.current) return;
//       const canvas = canvasInstance.current;
//       const pointer = canvas.getPointer(event);
//       const zoomLevel = 2;
//       if (canvas.getZoom() !== zoomLevel) {
//         canvas.zoomToPoint(new fabric.Point(pointer.x, pointer.y), zoomLevel);
//       } else {
//         canvas.setZoom(1);
//         canvas.absolutePan(new fabric.Point(0, 0));
//       }
//       // Note: Zoom/pan changes are NOT saved in the undo history by default
//     };

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const toggleZoom = (event: any) => {
//       if (!canvasInstance.current) return;
//       const instance = canvasInstance.current;
//       const pointer = instance.getPointer(event.e);
//       const currentZoom = instance.getZoom();
//       const newZoom = currentZoom === 1 ? 2 : 1;
//       instance.zoomToPoint(new fabric.Point(pointer.x, pointer.y), newZoom);
//     };


//     canvasRef.current?.addEventListener("contextmenu", handleRightClick);
//     canvas.on("mouse:dblclick", toggleZoom);

//     // --- Cleanup ---
//     return () => {
//       canvas.off("object:added", handleCanvasChange);
//       canvas.off("object:removed", handleCanvasChange);
//       canvas.off("object:modified", handleCanvasChange);
//       canvas.off("path:created", handleCanvasChange);
//       canvas.off("mouse:dblclick", toggleZoom);

//       canvasRef.current?.removeEventListener("contextmenu", handleRightClick);

//       canvas.dispose();
//       canvasInstance.current = null;
//       console.log("Canvas disposed");
//     };
//   }, [setCanvasRef, saveState]); // Add saveState

//    // Effect to handle eraser toggling
//   useEffect(() => {
//     if (!canvasInstance.current) return;
//     const canvas = canvasInstance.current;

//     canvas.isDrawingMode = !eraser;

//     if (eraser) {
//       console.log("Eraser mode ON");
//        // Your original logic: remove active objects immediately on toggle ON
//        // This *is* a state change, so it should be captured.
//       const activeObjects = canvas.getActiveObjects();
//       if (activeObjects.length > 0) {
//         console.log("Removing active objects due to eraser toggle");
//         activeObjects.forEach((obj) => canvas.remove(obj));
//         canvas.discardActiveObject(); // Deselect
//         canvas.renderAll();
//         // Save state AFTER removing objects
//         saveState();
//       }
//     } else {
//        console.log("Eraser mode OFF: Free drawing enabled");
//        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas); // Ensure brush is set
//     }

//   }, [eraser, saveState]); // Add saveState dependency

//   // Effect to add image (runs when handleAddImage changes - i.e. when imagePiece or saveState changes)
//   useEffect(() => {
//     // Add the image *once* if imagePiece is available when the component mounts
//     // or if imagePiece changes later AND there's data.
//     if (imagePiece?.dataUrl) {
//         console.log("useEffect triggered for handleAddImage");
//         handleAddImage();
//     }
//     // Dependencies ensure it re-runs if the image source changes or saveState function updates.
//     // If you only want to add the *initial* image, you might need different logic
//     // (e.g., a flag to track if the initial image was added).
//   }, [handleAddImage, imagePiece]);


//   return (
//     <div className="container relative mx-auto p-4">
//       {/* --- Control Buttons --- */}
//       <div className="mb-2 flex space-x-2">
//         <button
//           onClick={handleUndo}
//           disabled={history.length === 0}
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
//         >
//           Undo ({history.length})
//         </button>
//         <button
//           onClick={handleRedo}
//           disabled={redoStack.length === 0}
//           className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600"
//         >
//           Redo ({redoStack.length})
//         </button>
//          {/* Example Toggle Eraser Button (if needed)
//          <button
//             onClick={() => useToolsStore.setState({ eraser: !eraser })} // Example using Zustand direct set
//             className={`px-4 py-2 rounded ${eraser ? 'bg-red-500' : 'bg-gray-500'} text-white`}
//          >
//             Eraser {eraser ? 'ON' : 'OFF'}
//          </button>
//          */}
//       </div>

//       {/* --- Canvas --- */}
//       <div className="canvas-container border border-dotted border-gray-400">
//         <canvas
//           className="block"
//           ref={canvasRef}
//           // Let Fabric manage width/height via options
//         />
//       </div>
//     </div>
//   );
// }

// export default App;