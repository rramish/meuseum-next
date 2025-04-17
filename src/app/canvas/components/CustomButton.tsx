import React from "react";
import Image from "next/image";

const CustomButton = ({
  icon,
  title,
  onclick,
}: {
  icon?: string;
  title?: string;
  onclick: () => void;
}) => {
  return (
    <div onClick={onclick} className="bg-white text-sm justify-center flex rounded-lg px-1 py-2 text-center cursor-pointer hover:scale-110 duration-200">
      {icon && (
        <Image src={icon} width={300} height={300} className="h-6 w-6" alt={icon} />
      )}
      <p className="text-sm">
      {title}
      </p>
    </div>
  );
};

export default CustomButton;
