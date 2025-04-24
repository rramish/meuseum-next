"use client";

import { ICONS } from "@/assets";
import { CustomButton } from "@/components/CustomButton";

const Header = ({
  onUndo,
  onRedo,
  onGoBack,
  onToggle,
  toggleImage,
  onFinishDrawing,
}: {
  onUndo: () => void;
  onRedo: () => void;
  onGoBack: () => void;
  onToggle: () => void;
  toggleImage: boolean;
  onFinishDrawing: () => void;
}) => {
  return (
    <div className="flex flex-wrap justify-between px-10 py-6 gap-2">
      <div className="flex gap-4 flex-wrap md:flex-1 items-center justify-center md:justify-start">
        <CustomButton
          title="Back"
          bg={"bg-[#fff]"}
          onClick={onGoBack}
          icon={ICONS.back_icon}
          textcolor={"text-[#F287B7]"}
        />
      </div>
      <div className="flex gap-1 flex-wrap items-center justify-center md:gap-4 md:flex-1">
        <CustomButton
          title="Undo"
          onClick={onUndo}
          bg={"bg-[#fff]"}
          icon={ICONS.undo_icon}
          textcolor={"text-[#F287B7]"}
        />
        <CustomButton
          title="Redo"
          onClick={onRedo}
          bg={"bg-[#fff]"}
          icon={ICONS.redo_icon}
          textcolor={"text-[#F287B7]"}
        />
      </div>
      <div className="flex gap-4 flex-wrap items-center justify-center md:flex-1  md:justify-end">
        <div className="flex items-center gap-2">
          <label className="text-[#F287B7] font-medium">Toggle Image</label>
          <div
            className={`relative w-12 h-6 rounded-full cursor-pointer ${
              toggleImage ? "bg-[#F287B7]" : "bg-gray-300"
            }`}
            onClick={onToggle}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                toggleImage ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
        <CustomButton
          bg={"bg-[#F287B7]"}
          title="Finish Drawing"
          icon={ICONS.check_icon}
          textcolor={"text-white"}
          onClick={onFinishDrawing}
        />
      </div>
    </div>
  );
};

export default Header;
