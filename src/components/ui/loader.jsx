import React from "react";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex-col gap-4 w-full flex items-center justify-center">
      <div className="w-20 h-20 border-8 text-colors-primary text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-colors-primary rounded-full">
        <div className="h-6 w-6 flex items-center animate-ping justify-center">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
