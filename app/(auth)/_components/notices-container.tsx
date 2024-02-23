import Image from "next/image";
import React from "react";

export const NoticesContainer = () => {
  return (
    <div className="relative overflow-hidden lg:flex  w-1/2 bg-gradient-to-tr from-primary to-secondary justify-around items-center hidden">
      <Image
        priority
        style={{ width: "auto", height: "auto" }}
        src={"/hseq.png"}
        width={250}
        height={300}
        alt="Logo de grupo hseq"
      />

      <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 border-opacity-30 border-"></div>
      <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 border-opacity-30 border-"></div>

      <div className="absolute -top-36 -right-4 w-80 h-80 border-4 border-opacity-30"></div>
      <div className="absolute -top-28 -right-20 w-80 h-80 border-4 border-opacity-30 border-t-"></div>
    </div>
  );
};
