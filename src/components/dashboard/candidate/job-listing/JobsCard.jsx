"use client";
import { useState } from 'react';
import { MapPin, Bookmark } from 'lucide-react';
import Button from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; 

export default function JobCard({ 
  date = "04/12/2024",
  company = "Google", 
  position = "Senior App Developer",
  monthlySalary = 30000, 
  location = "London",
  partTime = true,
  fullTime = true,
  contractBased = true,
  internship = false,
  experienceLevel = "Intermediate level",
  backgroundColor = "bg-white"
}) {
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter(); 
    const id = 1;
  
  // Format salary display
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
    router.push(`/job-listings/${id}`);
  };


  return (
    <motion.div 
      className="w-full cursor-pointer rounded-2xl overflow-hidden border border-gray-200"
      initial={{ boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
      whileHover={{ 
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        y: -2
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 15
      }}
    >
      <div className={`${backgroundColor} p-5 pb-4 relative transition-colors duration-300 group`}>
        <div className="inline-block bg-white rounded-full px-3 py-1 text-sm text-gray-700 mb-3 shadow-sm">
          {date}
        </div>

        <motion.button 
          className="absolute top-5 right-5 focus:outline-none"
          onClick={handleSave}
          aria-label={isSaved ? "Unsave job" : "Save job"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bookmark 
            className={`w-5 h-5 transition-colors ${isSaved ? 'fill-indigo-500 text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} 
          />
        </motion.button>

        <h3 className="text-base font-medium text-gray-800">
          {company}
        </h3>

        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {position}
        </h2>

        <div className="flex flex-wrap gap-2">
          {partTime && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Part time
            </span>
          )}
          {experienceLevel && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              {experienceLevel}
            </span>
          )}
          {fullTime && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Full time
            </span>
          )}
          {contractBased && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Contract
            </span>
          )}
          {internship && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              Internship
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
            {formatSalary(monthlySalary)}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={(e) => {
              e.stopPropagation(); 
              handleViewDetails();
            }} className="!shadow-none text-white bg-indigo-500 hover:bg-indigo-600 !text-sm transition-colors">
            View
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}