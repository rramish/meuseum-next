

import { CustomButton } from "@/components/CustomButton";
import DropZone from "@/components/DropZone";

export const Uploadmodal = ({ onclose }: { onclose: () => void }) => {
  return (
    <div className="flex-1 h-full flex justify-center flex-col relative items-center w-full p-2">
      <div className="p-4 gap-2 rounded-lg w-4/5 md:max-w-[500px] bg-white shadow">
        <div className="flex gap-4 flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-lg font-bold py-2 text-black">Upload Image</p>
          </div>
          <div>
            <DropZone onclose={onclose} />
          </div>
          <div className="flex gap-10">
            <CustomButton
              bg={"bg-[#fff]"}
              title={"Cancel"}
              onClick={onclose}
              textcolor={"text-[#F287B7]"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
