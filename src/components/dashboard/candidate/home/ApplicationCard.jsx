import React from "react";
import Image from "next/image";
import Button from "@/components/ui/button";

const ApplicationCard = ({
  status = "Viewed",
  jobTitle = "Senior App Developer",
  company = "Google",
  date = "04/12/2024",
  companyIcon,
}) => {
  const statusStyles = {
    Viewed: "bg-green-100 text-green-800" ,
    Pending: "bg-amber-100 text-amber-800 ",
  };

  const badgeStyle = statusStyles[status] || statusStyles.Viewed;

  return (
    <div className="border border-[#DDDDDD] flex flex-col gap-3 rounded-[16px] w-full sm:w-[300px] overflow-hidden min-h-[250px] px-4 py-4 relative">
      <div className="">
        <span className={`${badgeStyle} px-3 py-1 rounded-full text-[12px] `}>
          {status}
        </span>
      </div>

      <h3
        className="text-[20px] font-bold text-gray-900 mb-1 truncate cursor-default"
        title={jobTitle} // This shows the full text on hover
      >
        {jobTitle}
      </h3>

      <div className="mb-1 flex gap-3 items-center">
        {companyIcon && (
          <Image
            src={companyIcon}
            alt={`${company} logo`}
            width={24}
            height={24}
            className="w-6 h-6"
          />
        )}
        <p className="text-gray-800 text-[16px] truncate" title={company}>
          {company}
        </p>
      </div>

      <p className="text-gray-500 text-[14px]">Applied on {date}</p>

      <Button className="!w-full !py-1 mt-4 text-white !text-[14px] !font-[500]">
        View Insights
      </Button>
    </div>
  );
};

export default ApplicationCard;
