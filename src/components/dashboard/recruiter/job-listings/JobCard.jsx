"use client";
import { useState } from "react";
import { MapPin, Bookmark, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function RecruiterJobCard({
  job,
  backgroundColor = "bg-white",
  onDelete,
  onToggleStatus,
  onView,
}) {
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  const formatSalary = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}m/month`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k/month`;
    }
    return `$${amount}/month`;
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleViewDetails = () => {
    onView();
  };

  return (
    <motion.div
      className="w-full max-w-sm cursor-pointer rounded-2xl overflow-hidden border border-gray-200"
      initial={{ boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
      whileHover={{
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        y: -2,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
    >
      <div
        className={`${backgroundColor} p-5 pb-4 relative transition-colors duration-300 group`}
      >
        {/* Status badge */}
        <span
          className={`absolute top-5 right-5 px-2 py-1 rounded-full text-xs font-medium 
            ${
              job.status === "open"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
        >
          {job.status === "open" ? "Open" : "Closed"}
        </span>

        {/* Delete button moved to top right */}
        <motion.button
          className="absolute top-5 left-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Delete job"
        >
          <Trash2 size={16} />
        </motion.button>

        <div className="inline-block bg-white rounded-full px-3 py-1 text-sm text-gray-700 mb-3 shadow-sm ml-7">
          {job.date}
        </div>

        <h3 className="text-base font-medium text-gray-800">{job.company}</h3>

        <h2 className="text-xl font-bold text-gray-900 mb-3">{job.position}</h2>

        <div className="flex flex-wrap gap-2">
          {job.fullTime && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Full time
            </span>
          )}
          {job.partTime && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Part time
            </span>
          )}
          {job.contract && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Contract
            </span>
          )}
          {job.internship && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Internship
            </span>
          )}
          {job.entryLevel && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Entry level
            </span>
          )}
          {job.intermediate && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Intermediate
            </span>
          )}
          {!job.entryLevel && !job.intermediate && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Senior
            </span>
          )}
        </div>
      </div>

      <motion.div
        className="bg-white p-4 flex justify-between items-center border-t border-gray-100"
        whileHover={{ backgroundColor: "#f9fafb" }}
      >
        <div>
          <div className="font-bold text-gray-900">
            {formatSalary(job.monthlySalary || job.salary)}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{job.location}</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            <span className="font-medium">{job.applicants}</span> applicant
            {job.applicants !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              className="!shadow-none !w-full text-white bg-indigo-500 hover:bg-indigo-600 !text-sm transition-colors"
            >
              View
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus();
              }}
              className={`!shadow-none text-white !text-sm transition-colors ${
                job.status === "open"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {job.status === "open" ? "Close " : "Reopen "}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RecruiterJobCard;
