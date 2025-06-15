import React from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";

const ApplicationCard = ({
  id,
  status = "Submitted",
  jobTitle = "Senior App Developer",
  company = "Unknown Company",
  date = "04/12/2024",
  companyIcon = null,
  analysis = {},
  fallbackIcon = <Briefcase className="w-5 h-5 text-white" />,
}) => {
  const statusStyles = {
    Submitted: "bg-amber-100 text-amber-800",
    Reviewed: "bg-blue-100 text-blue-800",
    Interview: "bg-indigo-100 text-indigo-800",
    Rejected: "bg-red-100 text-red-800",
    Shortlisted: "bg-green-100 text-green-800",
    Hired: "bg-emerald-100 text-emerald-800"
  };
  
  const hasInsights = analysis?.topSectionsViewed?.length > 0;
  const badgeStyle = statusStyles[status] || "bg-gray-100 text-gray-800";
  
  return (
    <div className="border border-[#DDDDDD] max-w-[450px] flex flex-col gap-3 rounded-[16px] w-full overflow-hidden min-h-[250px] px-4 py-4 relative">
      <div className="">
        <span className={`${badgeStyle} px-3 py-1 rounded-full text-[12px]`}>
          {status}
        </span>
      </div>
      
      <h3 className="text-[20px] font-bold text-gray-900 mb-1 truncate cursor-default">
        {jobTitle}
      </h3>
      
      <div className="mb-1 flex gap-3 items-center">
        {companyIcon ? (
          <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-white">
            <Image
              src={companyIcon}
              alt={`${company} logo`}
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
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
      
      <div className="mt-auto">
        {hasInsights ? (
          <Link href={`/application-manager/${id}`}>
            <Button className="!w-full !py-2 text-white !text-[14px] !font-[500]">
              View Insights
            </Button>
          </Link>
        ) : (
          <Button 
            className="!w-full !py-2 !text-[14px] !font-[500] text-gray-400 cursor-not-allowed"
            disabled
          >
            No insights yet
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;