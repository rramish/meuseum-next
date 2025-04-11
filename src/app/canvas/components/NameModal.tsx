"use client";
import axios from "axios";
import { ICONS } from "@/assets";
import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useImageStorage } from "@/store/imageStore";
import { CustomButton } from "@/components/CustomButton";

export const NameModal = ({ onclose }: { onclose: () => void }) => {
  const [name, setName] = useState("");
  const { setUserName } = useUserStore();
  const { imagePiece } = useImageStorage();
  const [loading,setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setUserName(name);
    const obj = {
      username: name,
      pieceId: imagePiece?._id,
    };
    const resp = await axios.post("/api/drawing-image/update", obj);
    console.log("update image is : ", resp.data);
    setLoading(false);
    onclose();
  };

  return (
    <div className="flex-1 h-full flex justify-center flex-col relative items-center">
      <div className="p-4 gap-2 rounded-lg w-[500px] h-52 bg-white shadow">
        <div className="flex gap-4 flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-lg font-bold py-2 text-black">Enter you name</p>
          </div>
          <div>
            <input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Enter you name"
              className="w-60 border border-gray-500 rounded-lg py-2 px-2 text-black"
            />
          </div>
          <div className="flex gap-10">
            <CustomButton
              onClick={handleSubmit}
              title={loading ? "Processing...":"Continue"}
              icon={ICONS.plus_icon}
              bg={"bg-[#fff]"}
              textcolor={"text-[#1A73E8]"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
