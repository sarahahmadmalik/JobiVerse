"use client";
import Image from "next/image";
import Button from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ApplicationCard = ({
  id,
  status = "Viewed",
  position = "Senior App Developer",
  candidate = "John Doe",
  date = "04/12/2024",
  candidatePhoto = null,
  fallbackIcon = <User className="w-5 h-5 text-white" />,
}) => {
  const router = useRouter();

  const statusStyles = {
    Viewed: "bg-blue-100 text-blue-800",
    Submitted: "bg-gray-100 text-gray-800",
    Shortlisted: "bg-green-100 text-green-800",
    Interview: "bg-indigo-100 text-indigo-800",
    Rejected: "bg-red-100 text-red-800",
    Pending: "bg-amber-100 text-amber-800",
    Offer: "bg-emerald-100 text-emerald-800"
  };
  
  const badgeStyle = statusStyles[status] || statusStyles.Viewed;
  
  const handleViewDetails = () => {
    router.push(`/dashboard/recruiter/applications/${id}`);
  };
  
  return (
    <div className="border border-[#DDDDDD] max-w-[450px] flex flex-col gap-3 rounded-[16px] w-full overflow-hidden min-h-[250px] px-4 py-4 relative">
      <div className="">
        <span className={`${badgeStyle} px-3 py-1 rounded-full text-[12px]`}>
          {status}
        </span>
      </div>
      
      <h3
        className="text-[20px] font-bold text-gray-900 mb-1 truncate cursor-default"
        title={position}
      >
        {position}
      </h3>
      
      <div className="mb-1 flex gap-3 items-center">
        {candidatePhoto ? (
          <Image
            src={candidatePhoto}
            alt={`${candidate} photo`}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-7 h-7 p-1 rounded-full flex justify-center items-center bg-blue-300">
            {fallbackIcon}
          </div>
        )}
        <p className="text-gray-800 text-[16px] truncate" title={candidate}>
          {candidate}
        </p>
      </div>
      
      <p className="text-gray-500 text-[14px]">Applied on {date}</p>
      
      <Link href={`/dashboard/recruiter/applications/${id}`} className="mt-4">
        <Button className="!w-full !py-1 text-white !text-[14px] !font-[500]">
          View Details
        </Button>
      </Link>
    </div>
  );
};

export default ApplicationCard;