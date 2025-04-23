import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center py-10 justify-center  bg-opacity-50">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
