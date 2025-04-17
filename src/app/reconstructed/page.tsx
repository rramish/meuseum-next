"use client";

import { Suspense } from "react";

import ReconstructedImage from "./components/ReconstructedImage";

const ReconstructedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Suspense fallback={"loading..."}>
        <ReconstructedImage />
      </Suspense>
    </div>
  );
};

export default ReconstructedPage;
