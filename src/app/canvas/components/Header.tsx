"use client";

import { ICONS } from "@/assets";
import { CustomButton } from "@/components/CustomButton";

const Header = ({
  onFinishDrawing,
  onUndo,
  onRedo,
  onGoBack
}: {
  onFinishDrawing: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onGoBack: () => void;
}) => {
  return (
    <div className="flex justify-between px-10 py-6 gap-2">
      <div className="flex gap-4">
        <CustomButton
          title="Back"
          icon={ICONS.back_icon}
          onClick={onGoBack}
          bg={"bg-[#fff]"}
          textcolor={"text-[#1A73E8]"}
        />
        {/* <CustomButton
          title="New Drawing"
          icon={ICONS.plus_icon}
          bg={"bg-[#fff]"}
          textcolor={"text-[#1A73E8]"}
        />
        <CustomButton
          title={`Canvas 4`}
          icon={ICONS.image_icon}
          bg={"bg-[#fff]"}
          textcolor={"text-[#1A73E8]"}
        /> */}
      </div>
      <div className="flex gap-1 md:gap-4">
        <CustomButton
          onClick={onUndo}
          title="Undo"
          icon={ICONS.undo_icon}
          bg={"bg-[#fff]"}
          textcolor={"text-[#1A73E8]"}
        />
        <CustomButton
          onClick={onRedo}
          title="Redo"
          icon={ICONS.redo_icon}
          bg={"bg-[#fff]"}
          textcolor={"text-[#1A73E8]"}
        />
      </div>
      <div className="flex gap-4">
        {/* <CustomButton
          title="Preview Drawing"
          icon={ICONS.eye_icon}
          bg={"bg-[#fff]"}
          textcolor={"text-[#1A73E8]"}
        /> */}
        <CustomButton
          onClick={onFinishDrawing}
          title="Finish Drawing"
          icon={ICONS.check_icon}
          bg={"bg-[#1A73E8]"}
          textcolor={"text-white"}
        />
      </div>
    </div>
  );
};

export default Header;
