"use client";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Image from "next/image";
import { ICONS } from "@/assets";
import { CustomButton } from "@/app/main/components/Header";
import DropZone from "@/components/DropZone";
import ImageSlicerWithDrawing from "./components/ImageSlicer";
import { useImageStorage } from "@/store/imageStore";

const Uploadmodal = ({
  onclose,
  setSelectedImage,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onclose: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedImage: any;
}) => {
  return (
    <div className="flex-1 h-full flex justify-center flex-col relative items-center">
      <div className="p-4 gap-2 rounded-lg w-[500px] h-80 bg-white shadow">
        <div className="flex gap-4 flex-col justify-center items-center">
          <div className="text-center">
            <p className="text-lg font-bold py-2 text-black">Upload Image</p>
          </div>
          <div>
            <DropZone onclose={onclose} setSelectedImage={setSelectedImage} />
          </div>
          <div className="flex gap-10">
            <CustomButton
              onClick={onclose}
              title="Back to Canvas"
              icon={ICONS.undo_icon}
              bg={"bg-[#fff]"}
              textcolor={"text-[#1A73E8]"}
            />
            <CustomButton
              title="Start Drawing"
              icon={ICONS.check_icon}
              bg={"bg-[#1A73E8]"}
              textcolor={"text-white"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Main = () => {
  const { image } = useImageStorage();
  const [selectedImageUrl, setSelectedImageUrl] = useState<
    Blob | MediaSource | undefined
  >(image? image : undefined);
  const [showModal, setShowModal] = useState(image ? false : true);
  const defaultImageUrl =
    "https://images.unsplash.com/photo-1740421198589-f98aa30526ac?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    console.log("in main page", selectedImageUrl);
  }, [selectedImageUrl]);
  return (
    <div className="flex-1">
      <Image
        src={ICONS.bg_image}
        alt=""
        width={100}
        height={100}
        className={`absolute ${
          showModal && "h-full"
        } -z-10 top-0 left-0 w-full`}
      />
      <Header />
      {showModal && (
        <div className="h-full bg-black/70 absolute top-0 left-0 w-full z-0" />
      )}
      {showModal && (
        <div className="h-[700px]">
          <Uploadmodal
            setSelectedImage={setSelectedImageUrl}
            onclose={() => {
              setShowModal(false);
            }}
          />
        </div>
      )}
      {!showModal && (
        <div className="w-full mb-8 py-4 relative">
          {/* <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div> */}
          {selectedImageUrl && (
            <ImageSlicerWithDrawing
              imageUrl={
                URL.createObjectURL(selectedImageUrl) || defaultImageUrl
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
