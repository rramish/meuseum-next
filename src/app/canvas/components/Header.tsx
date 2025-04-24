"use client";

import { ICONS } from "@/assets";
import { CustomButton } from "@/components/CustomButton";

const Header = ({
  onFinishDrawing,
  onUndo,
  onRedo,
  onGoBack,
}: {
  onFinishDrawing: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onGoBack: () => void;
}) => {
  return (
    <div className="flex flex-wrap justify-between px-10 py-6 gap-2">
      <div className="flex gap-4">
        <CustomButton
          title="Back"
          icon={ICONS.back_icon}
          onClick={onGoBack}
          bg={"bg-[#fff]"}
          textcolor={"text-[#F287B7]"}
        />
      </div>
      <div className="flex gap-1 md:gap-4">
        <CustomButton
          onClick={onUndo}
          title="Undo"
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
      <div className="flex gap-4">
        <CustomButton
          onClick={onFinishDrawing}
          title="Finish Drawing"
          icon={ICONS.check_icon}
          bg={"bg-[#F287B7]"}
          textcolor={"text-white"}
        />
      </div>
    </div>
  );
};

export default Header;
