"use client";

import { CustomButton } from "@/components/CustomButton";

export const ConfirmModal = ({
  onclose,
  onSubmit,
  loading,
}: {
  onclose: () => void;
  onSubmit: () => void;
  loading: boolean;
}) => {
  return (
    <div className="flex-1 h-full flex justify-center flex-col relative items-center">
      <div className="p-4 gap-2 rounded-lg w-4/5 md:max-w-[300px] bg-white shadow">
        <div className="flex gap-4 flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-lg font-bold py-2 text-black">
              Do you really want to reset?
            </p>
          </div>
          <div className="flex gap-2 md:gap-10 flex-wrap items-center py-2">
            <CustomButton
              bg={"bg-[#fff]"}
              title={"Cancel"}
              onClick={onclose}
              textcolor={"text-[#F287B7]"}
            />
            <CustomButton
              disabled={loading}
              bg={"bg-[#fff]"}
              onClick={onSubmit}
              textcolor={"text-[#F287B7]"}
              title={"Yes"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
