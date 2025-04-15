import { ICONS } from "@/assets";
import Image from "next/image";

export const CustomButton = ({
  icon,
  title = "Button",
  fontsize = "text-base",
  bg,
  textcolor,
  onClick = () =>{},
  width = 20,
  height = 20,
}: {
  icon?: string;
  width?: number;
  height?: number;
  fontsize?: string;
  title: string;
  bg?: string;
  onClick?: () =>void;
  textcolor?: string;
}) => {
  return (
    <div
    onClick={onClick}
      className={`flex items-center justify-center cursor-pointer hover:scale-105 duration-300 border gap-2 border-[#DADCE0] ${textcolor} ${bg} rounded-lg px-4 py-2`}
    >
      <div>
        <Image
          src={icon || ICONS.image_icon}
          alt="image"
          width={width}
          height={height}
        />
      </div>
      <div className="flex items-center">
        <p className={`${fontsize}`}>{title} </p>
      </div>
    </div>
  );
};
