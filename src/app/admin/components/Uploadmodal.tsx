import DropZone from "@/components/DropZone";

import { ICONS } from "@/assets";
import { CustomButton } from "./Header";

export const Uploadmodal = ({ onclose }: { onclose: () => void }) => {
  return (
    <div className="flex-1 h-full flex justify-center flex-col relative items-center">
      <div className="p-4 gap-2 rounded-lg w-[500px] h-88 bg-white shadow">
        <div className="flex gap-4 flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-lg font-bold py-2 text-black">Upload Image</p>
          </div>
          <div>
            <DropZone onclose={onclose} />
          </div>
          <div className="flex gap-10">
            <CustomButton
              onClick={onclose}
              title="Back"
              icon={ICONS.undo_icon}
              bg={"bg-[#fff]"}
              textcolor={"text-[#1A73E8]"}
            />
            {/* <CustomButton
              title="Start Drawing"
              icon={ICONS.check_icon}
              bg={"bg-[#1A73E8]"}
              textcolor={"text-white"}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
