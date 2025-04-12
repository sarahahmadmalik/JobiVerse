import React from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import { Briefcase } from "lucide-react";

const ApplicationCard = ({
  status = "Viewed",
  jobTitle = "Senior App Developer",
  company = "Google",
  date = "04/12/2024",
  companyIcon = null,
  fallbackIcon = <Briefcase className="w-5 h-5 text-white" />,
}) => {
  const statusStyles = {
    Viewed: "bg-blue-100 text-blue-800",        // Neutral - Your application was seen
    Submitted: "bg-gray-100 text-gray-800",    // Basic submission
    Shortlisted: "bg-green-100 text-green-800", // Positive - They're interested!
    Interview: "bg-indigo-100 text-indigo-800", // Special - Time-sensitive action
    Rejected: "bg-red-100 text-red-800",       // Negative - Clear closure
    Pending: "bg-amber-100 text-amber-800",    // Warning - Needs attention
    Offer: "bg-emerald-100 text-emerald-800"   // Success - Final positive outcome
  };

  const badgeStyle = statusStyles[status] || statusStyles.Viewed;

  return (
    <div className="border border-[#DDDDDD] max-w-[450px] flex flex-col gap-3 rounded-[16px] w-full overflow-hidden min-h-[250px] px-4 py-4 relative">
      <div className="">
        <span className={`${badgeStyle} px-3 py-1 rounded-full text-[12px]`}>
          {status}
        </span>
      </div>

      <h3
        className="text-[20px] font-bold text-gray-900 mb-1 truncate cursor-default"
        title={jobTitle}
      >
        {jobTitle}
      </h3>

      <div className="mb-1 flex gap-3 items-center">
        {companyIcon ? (
          <Image
            src={companyIcon}
            alt={`${company} logo`}
            width={24}
            height={24}
            className="w-6 h-6"
          />
        ) : (
          <div className="w-7 h-7 p-1 rounded-full flex justify-center items-center bg-blue-300">
            {fallbackIcon}
          </div>
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