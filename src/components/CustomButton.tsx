import { ICONS } from "@/assets";
import Image from "next/image";

export const CustomButton = ({
  bg,
  icon,
  textcolor,
  width = 20,
  height = 20,
  title = "Button",
  onClick = () => {},
  disabled = false,
  fontsize = "text-base",
}: {
  bg?: string;
  icon?: string;
  title: string;
  width?: number;
  height?: number;
  fontsize?: string;
  textcolor?: string;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`flex items-center justify-center text-sm md:text-base cursor-pointer hover:scale-105 duration-300 border ${
        icon && "gap-2"
      } border-[#DADCE0] ${textcolor} ${bg} rounded-lg px-2 py-1 md:px-4 md:py-2 ${
        disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
      }`}
    >
      <div>
        {icon && (
          <Image
            src={icon || ICONS.image_icon}
            alt="image"
            width={width}
            height={height}
          />
        )}
      </div>
      <div className="flex items-center">
        <p className={`${fontsize}`}>{title} </p>
      </div>
    </div>
  );
};
