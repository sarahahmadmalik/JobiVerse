import React from "react";
import Image from "next/image";
import Button from "@/components/ui/button";

const ResumeCard = ({ title, image }) => {
  return (
    <div className="bg-white max-w-[400px]  min-h-[250px] overflow-hidden flex flex-col gap-3 px-4 py-4 rounded-[16px] border border-[#00000024]">
      <div className="relative border border-[#DDDDDD] w-full h-40 rounded-[8px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      </div>
      <h3
        className="mt-2 font-[600] text-[18px] truncate cursor-default"
        title={title} // Shows full text on hover
      >
        {title}
      </h3>
      <Button className="!w-full !py-1 text-white !text-[14px] !font-[500]">
        View
      </Button>
    </div>
  );
};

export default ResumeCard;
