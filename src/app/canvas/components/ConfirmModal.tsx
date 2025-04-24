"use client";
import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useImageStorage } from "@/store/imageStore";
import { CustomButton } from "@/components/CustomButton";

export const ConfirmModal = ({ onclose }: { onclose: () => void }) => {
  const router = useRouter();
  const { imagePiece } = useImageStorage();
  const { submissionUrl } = useImageStorage();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const obj = {
      updatedUrl: submissionUrl,
      pieceId: imagePiece?._id,
    };
    await axios.post("/api/drawing-image/update", obj);
    setLoading(false);
    onclose();
    router.replace("/home");
  };

  return (
    <div className="flex-1 h-full flex justify-center flex-col relative items-center">
      <div className="p-4 gap-2 rounded-lg  w-4/5 md:max-w-[300px] bg-white shadow">
        <div className="flex gap-4 flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-lg font-bold py-2 text-black">
              Do you really want to submit?
            </p>
          </div>
          <div className="flex gap-2 justify-between flex-wrap py-2">
            <CustomButton
              onClick={onclose}
              title={"No"}
              bg={"bg-[#fff]"}
              textcolor={"text-[#F287B7]"}
            />
            <CustomButton
              onClick={() => {
                if (loading) {
                  return;
                }
                handleSubmit();
              }}
              disabled={loading}
              title={loading ? "Processing..." : "Yes"}
              bg={"bg-[#fff]"}
              textcolor={"text-[#F287B7]"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
