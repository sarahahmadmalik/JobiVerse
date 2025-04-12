'use client';
import { useState } from 'react';
import { Filter, X, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from "./JobsCard";
import JobFilters from "./JobsFilters";
import Dropdown from "@/components/ui/dropdown";

export default function JobsForYou({ jobs }) {
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [jobTypes, setJobTypes] = useState({
    fullTime: false,
    partTime: false,
    contract: false,
    internship: false,
  });

  const [salaryRange, setSalaryRange] = useState({
    min: 1,  // $1k/month minimum
    max: 30  // $30k/month maximum
  });
  
  const [experienceLevel, setExperienceLevel] = useState({
    entryLevel: false,
    intermediate: false,
    senior: false
  });
  
  const [workSetting, setWorkSetting] = useState({
    remote: false,
    hybrid: false,
    onsite: false
  });

  // Enhanced sorting options
  const [sortOption, setSortOption] = useState('recent');
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'salary-high', label: 'Salary (High to Low)' },
    { value: 'salary-low', label: 'Salary (Low to High)' },
    { value: 'experience-high', label: 'Experience (High to Low)' },
    { value: 'experience-low', label: 'Experience (Low to High)' },
    { value: 'company-asc', label: 'Company (A-Z)' },
    { value: 'company-desc', label: 'Company (Z-A)' },
    { value: 'location-asc', label: 'Location (A-Z)' },
    { value: 'location-desc', label: 'Location (Z-A)' },
    { value: 'title-asc', label: 'Job Title (A-Z)' },
    { value: 'title-desc', label: 'Job Title (Z-A)' }
  ];

  const bgColors = [
    "bg-green-50",
    "bg-orange-50",
    "bg-purple-50",
    "bg-indigo-50",
    "bg-blue-50",
    "bg-pink-50"
  ];

  const getBackgroundColor = (index) => bgColors[index % bgColors.length];

  // Filter handlers
  const handleJobTypeChange = (type) => {
    setJobTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleExperienceLevelChange = (level) => {
    setExperienceLevel(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  const handleWorkSettingChange = (setting) => {
    setWorkSetting(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleMinSalaryChange = (e) => {
    const newMin = parseInt(e.target.value);
    setSalaryRange(prev => ({
      min: newMin,
      max: Math.max(prev.max, newMin)
    }));
  };

  const handleMaxSalaryChange = (e) => {
    const newMax = parseInt(e.target.value);
    setSalaryRange(prev => ({
      min: Math.min(prev.min, newMax),
      max: newMax
    }));
  };

  const clearAllFilters = () => {
    setJobTypes({
      fullTime: false,
      partTime: false,
      contract: false,
      internship: false
    });
    setSalaryRange({
      min: 1,
      max: 30
    });
    setExperienceLevel({
      entryLevel: false,
      intermediate: false,
      senior: false
    });
    setWorkSetting({
      remote: false,
      hybrid: false,
      onsite: false
    });
  };

  const formatSalary = (value) => {
    return `$${value}k`;
  };

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter(job => {
    // Job Type Filter
    const jobTypeMatch = 
      (!jobTypes.fullTime && !jobTypes.partTime && !jobTypes.contract && !jobTypes.internship) || 
      (jobTypes.fullTime && job.fullTime) ||
      (jobTypes.partTime && job.partTime) ||
      (jobTypes.contract && job.contractBased) ||
      (jobTypes.internship && job.internship);

    // Salary Filter (using monthlySalary)
    const salaryMatch = 
      job.monthlySalary >= salaryRange.min * 1000 && 
      job.monthlySalary <= salaryRange.max * 1000;

    // Experience Level Filter
    const experienceMatch = 
      (!experienceLevel.entryLevel && !experienceLevel.intermediate && !experienceLevel.senior) ||
      (experienceLevel.entryLevel && job.entryLevel) ||
      (experienceLevel.intermediate && job.intermediate) ||
      (experienceLevel.senior && job.senior);

    // Work Setting Filter
    const workSettingMatch = 
      (!workSetting.remote && !workSetting.hybrid && !workSetting.onsite) ||
      (workSetting.remote && job.remote) ||
      (workSetting.hybrid && job.hybrid) ||
      (workSetting.onsite && job.onsite);

    return jobTypeMatch && salaryMatch && experienceMatch && workSettingMatch;
  });

  // Enhanced sorting function
  const sortedAndFilteredJobs = [...filteredJobs].sort((a, b) => {
    switch (sortOption) {
      case 'salary-high':
        return b.monthlySalary - a.monthlySalary;
      case 'salary-low':
        return a.monthlySalary - b.monthlySalary;
      case 'experience-high':
        return getExperienceValue(b) - getExperienceValue(a);
      case 'experience-low':
        return getExperienceValue(a) - getExperienceValue(b);
      case 'company-asc':
        return a.company.localeCompare(b.company);
      case 'company-desc':
        return b.company.localeCompare(a.company);
      case 'location-asc':
        return a.location.localeCompare(b.location);
      case 'location-desc':
        return b.location.localeCompare(a.location);
      case 'title-asc':
        return a.position.localeCompare(b.position);
      case 'title-desc':
        return b.position.localeCompare(a.position);
      case 'recent':
      default:
        return new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'));
    }
  });

  // Helper function to convert experience levels to numerical values for sorting
  const getExperienceValue = (job) => {
    if (job.senior) return 3;
    if (job.intermediate) return 2;
    if (job.entryLevel) return 1;
    return 0;
  };

  return (
    <div className="w-full relative p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">Jobs For You</h1>
        <div className="flex items-center gap-3">
          {/* Sorting dropdown */}
          <div className="w-48">
            <Dropdown
              options={sortOptions}
              onChange={setSortOption}
              placeholder="Sort by"
              value={sortOption}
              icon={ArrowUpDown} 
            />
          </div>
          
          {/* Mobile filter button */}
          <button 
            onClick={() => setShowFilters(true)}
            className="md:hidden flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg transition-colors"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="hidden md:block w-[300px] flex-shrink-0">
          <JobFilters 
            jobTypes={jobTypes}
            salaryRange={salaryRange}
            experienceLevel={experienceLevel}
            workSetting={workSetting}
            onJobTypeChange={handleJobTypeChange}
            onExperienceLevelChange={handleExperienceLevelChange}
            onWorkSettingChange={handleWorkSettingChange}
            onMinSalaryChange={handleMinSalaryChange}
            onMaxSalaryChange={handleMaxSalaryChange}
            onClearAll={clearAllFilters}
            formatSalary={formatSalary}
          />
        </div>

        <div className="flex-1">
          <div className="mb-4 text-sm text-gray-600">
            Showing {sortedAndFilteredJobs.length} {sortedAndFilteredJobs.length === 1 ? 'job' : 'jobs'}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {sortedAndFilteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                date={job.date}
                company={job.company}
                position={job.position}
                salaryMonth={job.monthlySalary}
                location={job.location}
                partTime={job.partTime}
                fullTime={job.fullTime}
                contractBased={job.contract}
                internship={job.internship}
                entryLevel={job.entryLevel}
                intermediate={job.intermediate}
                senior={job.senior}
                remote={job.remote}
                hybrid={job.hybrid}
                onsite={job.onsite}
                backgroundColor={getBackgroundColor(index)}
              />
            ))}
          </div>

          {sortedAndFilteredJobs.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-2 text-sm text-gray-600">
                Try adjusting your filters to find more jobs
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
              onClick={() => setShowFilters(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <JobFilters 
                    jobTypes={jobTypes}
                    salaryRange={salaryRange}
                    experienceLevel={experienceLevel}
                    workSetting={workSetting}
                    onJobTypeChange={handleJobTypeChange}
                    onExperienceLevelChange={handleExperienceLevelChange}
                    onWorkSettingChange={handleWorkSettingChange}
                    onMinSalaryChange={handleMinSalaryChange}
                    onMaxSalaryChange={handleMaxSalaryChange}
                    onClearAll={clearAllFilters}
                    formatSalary={formatSalary}
                  />
                </div>
                
                <div className="p-4 border-t sticky bottom-0 bg-white flex gap-3">
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}