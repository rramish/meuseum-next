"use client";
import React, { useEffect } from "react";

const Hpmepage = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/home" as any;
    }
  }, []);
  return <div>home</div>;
};

export default Hpmepage;
