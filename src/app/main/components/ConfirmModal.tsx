"use client";

import { ICONS } from "@/assets";
import { CustomButton } from "@/components/CustomButton";

export const ConfirmModal = ({ onclose, onSubmit, loading }: { onclose: () => void, onSubmit: () => void, loading: boolean }) => {

  return (
    <div className="flex-1 h-full flex justify-center flex-col relative items-center">
      <div className="p-4 gap-2 rounded-lg w-[500px] h-40 bg-white shadow">
        <div className="flex gap-4 flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-lg font-bold py-2 text-black">
              Do you really want to reset?
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
              onClick={onSubmit}
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
