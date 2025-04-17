"use client";

import { Suspense } from "react";

import ReconstructedImage from "./components/ReconstructedImage";

const ReconstructedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Suspense fallback={"loading..."}>
        <ReconstructedImage />
      </Suspense>
    </div>
  );
};

export default ReconstructedPage;
