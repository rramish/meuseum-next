"use client";

import { useRouter } from "next/navigation";

import { ICONS } from "@/assets";
import { CustomButton } from "@/components/CustomButton";

const Header = ({ onFinishDrawing }: { onFinishDrawing: () => void }) => {
  const router = useRouter();
  return (
    <div className="flex justify-between px-10 py-6">
      <div className="flex gap-4">
        <CustomButton
          title="Back"
          icon={ICONS.back_icon}
          onClick={() => {
            router.push("/home");
          }}
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
      {/* <div className="flex gap-4">
        <CustomButton
          title="Undo"
          icon={ICONS.undo_icon}
          bg={"bg-[#fff]"}
          textcolor={"text-[#1A73E8]"}
        />
        <CustomButton
          title="Redo"
          icon={ICONS.redo_icon}
          bg={"bg-[#fff]"}
          textcolor={"text-[#1A73E8]"}
        />
      </div> */}
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
