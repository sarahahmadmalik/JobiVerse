import React from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { FiFile } from "react-icons/fi";

const ResumeCard = ({ title, image, isGeneratingThumbnail  }) => {
  return (
    <div className="bg-white max-w-[400px]  min-h-[250px] overflow-hidden flex flex-col gap-3 px-4 py-4 rounded-[16px] border border-[#00000024]">
      <div className="relative border border-[#DDDDDD] w-full h-40 rounded-[8px] overflow-hidden">
       {isGeneratingThumbnail ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Spinner/>
          </div>
        ) : image.endsWith('.svg') ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <FiFile className="w-full h-full text-gray-300" />
          </div>
        ) : (
          <Image
            src={image}
            alt={`Thumbnail for ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top"
            style={{
              objectPosition: 'top center', // Ensure top alignment
              imageRendering: 'optimizeQuality' // Better quality for text
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/dashboard/resume.svg';
            }}
          />
        )}
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
