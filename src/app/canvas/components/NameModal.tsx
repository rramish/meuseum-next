"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/store/userStore";
import { useImageStorage } from "@/store/imageStore";
import { CustomButton } from "@/components/CustomButton";
// import { socket } from "@/socket";

export const NameModal = ({ onclose }: { onclose: () => void }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const { setUserName } = useUserStore();
  const { imagePiece } = useImageStorage();
  const [loading, setLoading] = useState(false);
  const [errormsg, setErrormsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name) {
      setErrormsg("Name field cannot be empty!");
      setTimeout(() => {
        setErrormsg(null);
      }, 3000);
      return;
    }
    setLoading(true);
    setUserName(name);
    const obj = {
      username: name,
      pieceId: imagePiece?._id,
    };
    await axios.post("/api/drawing-image/update", obj);
    // socket.emit("image-updated-backend", { hello: "world" });

    setLoading(false);
    onclose();
  };

  return (
    <div className="flex-1 h-full flex justify-center flex-col relative items-center">
      <div className="p-4 gap-2 rounded-lg w-4/5 md:max-w-[300px] bg-white shadow">
        <div className="flex gap-4 flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-lg font-bold py-2 text-black">
              Enter your Full Name.
            </p>
          </div>
          <div>
            <input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Enter your full name..."
              className=" w-full md:max-w-60 border outline-[#f287b7] border-gray-500 rounded-lg py-2 px-2 text-black"
            />
            {errormsg && <p className="text-red-400 text-center">{errormsg}</p>}
          </div>
          <div className="flex gap-2 md:gap-4 flex-wrap items-center py-2">
            <CustomButton
              bg={"bg-[#fff]"}
              title={"Cancel"}
              onClick={() => {
                router.back();
                onclose();
              }}
              textcolor={"text-[#F287B7]"}
            />
            <CustomButton
              disabled={loading}
              bg={"bg-[#fff]"}
              onClick={handleSubmit}
              textcolor={"text-[#F287B7]"}
              title={"Continue"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
