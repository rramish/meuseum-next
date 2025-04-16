"use client";
import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useImageStorage } from "@/store/imageStore";
// import { useCanvasStore } from "@/store/canvasStore";
import { CustomButton } from "@/components/CustomButton";

export const ConfirmModal = ({ onclose }: { onclose: () => void }) => {
  const { imagePiece } = useImageStorage();
  const [loading, setLoading] = useState(false);
  // const { canvasRef } = useCanvasStore();
  const router = useRouter();
  const{submissionUrl} = useImageStorage();

  const handleSubmit = async () => {
    setLoading(true);
    const obj = {
      updatedUrl: submissionUrl,
      // updatedUrl: canvasRef.current!.toDataURL(),
      pieceId: imagePiece?._id,
    };
    const resp = await axios.post("/api/drawing-image/update", obj);
    console.log("update image is : ", resp.data);
    setLoading(false);
    onclose();
    router.replace("/home");
  };

  return (
    <div className="flex-1 h-full flex justify-center flex-col relative items-center">
      <div className="p-4 gap-2 rounded-lg w-[500px] h-40 bg-white shadow">
        <div className="flex gap-4 flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-lg font-bold py-2 text-black">
              Do you really want to submit?
            </p>
          </div>
          <div className="flex gap-10">
            <CustomButton
              onClick={onclose}
              title={"Cancel"}
              // icon={ICONS.undo_icon}
              bg={"bg-[#fff]"}
              textcolor={"text-[#1A73E8]"}
            />
            <CustomButton
              onClick={() => {
                if (loading) {
                  return;
                }
                handleSubmit();
              }}
              title={loading ? "Processing..." : "Continue"}
              // icon={ICONS.plus_icon}
              bg={"bg-[#fff]"}
              textcolor={"text-[#1A73E8]"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
