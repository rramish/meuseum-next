"use server"
import { CustomButton } from "@/app/main/components/Header";
import { ICONS } from "@/assets";
import React from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Uploadmodal = ({ onclose } : { onclose: any }) => {
  return (
    <div className="">
      <div
        className="min-h-screen bg-black/40 absolute top-0 left-0"
        onClick={() => onclose()}
      />
      <div className="p-4 rounded-lg w-96 h-60 bg-white">
        <div>
          <div>
            <p className="text-2xl">UPload Image</p>
          </div>
          <div className="flex gap-10">
            <CustomButton
              title="Submit Work"
              icon={ICONS.check_icon}
              bg={"bg-[#1A73E8]"}
              textcolor={"text-white"}
            />
            <CustomButton
              title="Submit Work"
              icon={ICONS.check_icon}
              bg={"bg-[#1A73E8]"}
              textcolor={"text-white"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploadmodal;
