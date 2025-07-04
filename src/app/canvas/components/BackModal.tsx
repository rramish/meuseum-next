"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { socket } from "@/socket";
import { useImageStorage } from "@/store/imageStore";
import { CustomButton } from "@/components/CustomButton";

export const BackModal = ({ onclose }: { onclose: () => void }) => {
  const router = useRouter();
  const { imagePiece } = useImageStorage();
  const { submissionUrl } = useImageStorage();

  const [loading, setLoading] = useState(false);
  const [loadingNotSave, setLoadingNotSave] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const obj = {
      updatedUrl: submissionUrl,
      pieceId: imagePiece?._id,
    };
    await axios.post("/api/drawing-image/update", obj);
    socket.emit("image-updated-user", { hello: "world" });
    socket.emit("image-updated-backend", { hello: "world" });
    setLoading(false);
    onclose();
    router.replace("/home");
  };

  const handleDontSave = async () => {
    setLoadingNotSave(true);
    const obj = {
      pieceId: imagePiece?._id,
    };
    await axios.post("/api/drawing-image/reset-progress", obj);
    socket.emit("image-updated-backend", { hello: "world" });

    setLoadingNotSave(false);
    onclose();
    router.replace("/home");
  };

  return (
    <div className="flex-1 h-full flex justify-center flex-col relative items-center">
      <div className="p-4 gap-2 rounded-lg  w-4/5 md:max-w-[500px] bg-white shadow">
        <div className="flex gap-4 flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-lg font-bold py-2 text-black">
              Do you want to save you work?
            </p>
          </div>
          <div className="flex gap-4 justify-center md:justify-between flex-wrap py-2">
            <CustomButton
              onClick={handleSubmit}
              disabled={loading}
              title={"Save"}
              bg={"bg-[#fff]"}
              textcolor={"text-[#F287B7]"}
            />
            <CustomButton
              onClick={handleDontSave}
              disabled={loadingNotSave}
              title={"Don't Save"}
              bg={"bg-[#fff]"}
              textcolor={"text-[#F287B7]"}
            />
            <CustomButton
              onClick={onclose}
              title={"Cancel"}
              bg={"bg-[#fff]"}
              textcolor={"text-[#F287B7]"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
