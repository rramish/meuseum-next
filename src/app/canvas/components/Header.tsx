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
      <div className="flex gap-4">
        <CustomButton
          title="Back"
          bg={"bg-[#fff]"}
          onClick={onGoBack}
          icon={ICONS.back_icon}
          textcolor={"text-[#F287B7]"}
        />
      </div>
      <div className="flex gap-1 flex-wrap md:gap-4">
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
      <div className="flex gap-4 flex-wrap">
        <CustomButton
          bg={"bg-[#fff]"}
          title="Toggle Image"
          icon={toggleImage ? ICONS.eye_icon : ICONS.eye_hide_icon}
          onClick={onToggle}
          textcolor={"text-[#F287B7]"}
        />
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
