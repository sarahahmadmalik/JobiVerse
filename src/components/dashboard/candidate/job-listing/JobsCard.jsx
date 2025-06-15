'use client';
import { useState } from 'react';
import { MapPin, Bookmark } from 'lucide-react';
import Button from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function JobCard({ 
  id,
  postedAt,
  company = {},
  position = "Senior App Developer",
  salary = { value: 0, currency: 'USD' },
  location = "London",
  jobType = "Full-time",
  experienceLevel = "Intermediate",
  workMode = "Remote",
  skills = [],
  backgroundColor = "bg-white"
}) {
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  // Format date display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format salary display
  const formatSalary = (amount) => {
    if (!amount) return "Salary not specified";
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}m/month`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k/month`;
    }
    return `$${amount}/month`;
  };

  // Get job type badges
  const getJobTypeBadges = () => {
    const badges = [];
    if (jobType === 'Full-time') badges.push('Full time');
    if (jobType === 'Part-time') badges.push('Part time');
    if (jobType === 'Contract') badges.push('Contract');
    if (jobType === 'Internship') badges.push('Internship');
    return badges;
  };

  // Get work mode badges
  const getWorkModeBadges = () => {
    const badges = [];
    if (workMode === 'Remote') badges.push('Remote');
    if (workMode === 'Hybrid') badges.push('Hybrid');
    if (workMode === 'On-site') badges.push('On-site');
    return badges;
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
      onClick={handleViewDetails}
    >
      <div className={`${backgroundColor} p-5 pb-4 relative transition-colors duration-300 group`}>
        <div className="inline-block bg-white rounded-full px-3 py-1 text-sm text-gray-700 mb-3 shadow-sm">
          {formatDate(postedAt)}
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
          {company.name || company}
        </h3>

        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {position}
        </h2>

        <div className="flex flex-wrap gap-2">
          {getJobTypeBadges().map((badge, index) => (
            <span key={index} className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              {badge}
            </span>
          ))}
          {experienceLevel && (
            <span className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              {experienceLevel}
            </span>
          )}
          {getWorkModeBadges().map((badge, index) => (
            <span key={index} className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              {badge}
            </span>
          ))}
          {skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="bg-white/80 text-gray-600 border border-gray-200 rounded-full px-3 py-1 text-xs shadow-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <motion.div 
        className="bg-white p-4 flex justify-between items-center border-t border-gray-100"
        whileHover={{ backgroundColor: "#f9fafb" }}
      >
        <div>
          <div className="font-bold text-gray-900">
            {formatSalary(salary?.value)}
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
          <Button 
            onClick={(e) => {
              e.stopPropagation(); 
              handleViewDetails();
            }} 
            className="!shadow-none text-white bg-indigo-500 hover:bg-indigo-600 !text-sm"
          >
            View
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}