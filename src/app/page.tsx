"use client";
import React, { useEffect } from "react";

const Hpmepage = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      window.location.href = "/home" as any;
    }
  }, []);
  return <div>home</div>;
};

export default Hpmepage;
