'use client';
import { useState } from 'react';
import { Filter, X, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from "./JobsCard";
import JobFilters from "./JobsFilters";
import Dropdown from "@/components/ui/dropdown";

export default function JobsForYou({ jobs, title = "Recommended Jobs" }) {
  const [showFilters, setShowFilters] = useState(false);
  
  // Default filter states
  const defaultFilters = {
    jobTypes: {
      fullTime: false,
      partTime: false,
      contract: false,
      internship: false,
      freelance: false
    },
    salaryRange: {
      min: 30000,  // $30k/year minimum
      max: 150000  // $150k/year maximum
    },
    experienceLevel: {
      entry: false,
      intermediate: false,
      senior: false,
      lead: false,
      executive: false
    },
    workMode: {
      remote: false,
      hybrid: false,
      onsite: false
    }
  };

  // Current filter states
  const [filters, setFilters] = useState(defaultFilters);
  const [sortOption, setSortOption] = useState('recent');

  // Check if any filters are active
  const areFiltersActive = () => {
    return JSON.stringify(filters) !== JSON.stringify(defaultFilters);
  };

  // Filter jobs only if filters are applied
  const filteredJobs = areFiltersActive() ? jobs.filter(job => {
    // Job Type Filter
    const jobTypeMatch = 
      (!filters.jobTypes.fullTime && 
       !filters.jobTypes.partTime && 
       !filters.jobTypes.contract && 
       !filters.jobTypes.internship &&
       !filters.jobTypes.freelance) || 
      (filters.jobTypes.fullTime && job.jobType === 'Full-time') ||
      (filters.jobTypes.partTime && job.jobType === 'Part-time') ||
      (filters.jobTypes.contract && job.jobType === 'Contract') ||
      (filters.jobTypes.internship && job.jobType === 'Internship') ||
      (filters.jobTypes.freelance && job.jobType === 'Freelance');

    // Salary Filter - properly handles undefined salaries
    const salaryValue = job.salary?.value;
    const salaryMatch = salaryValue !== undefined 
      ? salaryValue >= filters.salaryRange.min && 
        salaryValue <= filters.salaryRange.max
      : false;

    // Experience Level Filter
    const experienceMatch = 
      (!filters.experienceLevel.entry && 
       !filters.experienceLevel.intermediate && 
       !filters.experienceLevel.senior &&
       !filters.experienceLevel.lead &&
       !filters.experienceLevel.executive) ||
      (filters.experienceLevel.entry && job.experienceLevel === 'Entry') ||
      (filters.experienceLevel.intermediate && job.experienceLevel === 'Intermediate') ||
      (filters.experienceLevel.senior && job.experienceLevel === 'Senior') ||
      (filters.experienceLevel.lead && job.experienceLevel === 'Lead') ||
      (filters.experienceLevel.executive && job.experienceLevel === 'Executive');

    // Work Mode Filter
    const workModeMatch = 
      (!filters.workMode.remote && 
       !filters.workMode.hybrid && 
       !filters.workMode.onsite) ||
      (filters.workMode.remote && job.workMode === 'Remote') ||
      (filters.workMode.hybrid && job.workMode === 'Hybrid') ||
      (filters.workMode.onsite && job.workMode === 'On-site');

    return jobTypeMatch && salaryMatch && experienceMatch && workModeMatch;
  }) : jobs;

  // Sort the jobs (always applied)
  const sortedAndFilteredJobs = [...filteredJobs].sort((a, b) => {
    const salaryA = a.salary?.value || 0;
    const salaryB = b.salary?.value || 0;
    
    switch (sortOption) {
      case 'salary-high':
        return salaryB - salaryA;
      case 'salary-low':
        return salaryA - salaryB;
      case 'experience-high':
        return getExperienceValue(b) - getExperienceValue(a);
      case 'experience-low':
        return getExperienceValue(a) - getExperienceValue(b);
      case 'company-asc':
        return (a.recruiterInfo?.company?.name || '').localeCompare(b.recruiterInfo?.company?.name || '');
      case 'company-desc':
        return (b.recruiterInfo?.company?.name || '').localeCompare(a.recruiterInfo?.company?.name || '');
      case 'location-asc':
        return a.location.localeCompare(b.location);
      case 'location-desc':
        return b.location.localeCompare(a.location);
      case 'title-asc':
        return a.jobTitle.localeCompare(b.jobTitle);
      case 'title-desc':
        return b.jobTitle.localeCompare(a.jobTitle);
      case 'recent':
      default:
        return new Date(b.postedAt) - new Date(a.postedAt);
    }
  });

  // Helper function to convert experience levels to numerical values for sorting
  const getExperienceValue = (job) => {
    switch (job.experienceLevel) {
      case 'Executive': return 5;
      case 'Lead': return 4;
      case 'Senior': return 3;
      case 'Intermediate': return 2;
      case 'Entry': return 1;
      default: return 0;
    }
  };

  // Filter handlers
  const handleJobTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      jobTypes: {
        ...prev.jobTypes,
        [type]: !prev.jobTypes[type]
      }
    }));
  };

  const handleExperienceLevelChange = (level) => {
    setFilters(prev => ({
      ...prev,
      experienceLevel: {
        ...prev.experienceLevel,
        [level]: !prev.experienceLevel[level]
      }
    }));
  };

  const handleWorkModeChange = (mode) => {
    setFilters(prev => ({
      ...prev,
      workMode: {
        ...prev.workMode,
        [mode]: !prev.workMode[mode]
      }
    }));
  };

  const handleMinSalaryChange = (value) => {
    const newMin = parseInt(value);
    setFilters(prev => ({
      ...prev,
      salaryRange: {
        min: newMin,
        max: Math.max(prev.salaryRange.max, newMin)
      }
    }));
  };

  const handleMaxSalaryChange = (value) => {
    const newMax = parseInt(value);
    setFilters(prev => ({
      ...prev,
      salaryRange: {
        min: Math.min(prev.salaryRange.min, newMax),
        max: newMax
      }
    }));
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  const formatSalary = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  // Sorting options
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

  return (
    <div className="w-full relative py-4 md:px-4 px-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h1>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {sortedAndFilteredJobs.length} {sortedAndFilteredJobs.length === 1 ? 'job' : 'jobs'}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-6 mb-2 md:my-0">
          <div className="w-48">
            <Dropdown
              options={sortOptions}
              onChange={setSortOption}
              placeholder="Sort by"
              value={sortOption}
              icon={ArrowUpDown} 
            />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className="md:hidden flex flex-1 items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-3 rounded-lg transition-colors"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="hidden md:block w-[300px] flex-shrink-0">
          <JobFilters 
            jobTypes={filters.jobTypes}
            salaryRange={filters.salaryRange}
            experienceLevel={filters.experienceLevel}
            workMode={filters.workMode}
            onJobTypeChange={handleJobTypeChange}
            onExperienceLevelChange={handleExperienceLevelChange}
            onWorkModeChange={handleWorkModeChange}
            onMinSalaryChange={handleMinSalaryChange}
            onMaxSalaryChange={handleMaxSalaryChange}
            onClearAll={clearAllFilters}
            formatSalary={formatSalary}
          />
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {sortedAndFilteredJobs.map((job, index) => (
              <JobCard
                key={job._id}
                id={job._id}
                postedAt={job.postedAt}
                company={job.recruiterInfo?.company}
                position={job.jobTitle}
                salary={job.salary}
                location={job.location}
                jobType={job.jobType}
                experienceLevel={job.experienceLevel}
                workMode={job.workMode}
                skills={job.skills}
                backgroundColor={getBackgroundColor(index)}
              />
            ))}
          </div>

          {sortedAndFilteredJobs.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-2 text-sm text-gray-600">
                {areFiltersActive() 
                  ? "Try adjusting your filters to find more jobs" 
                  : "No jobs available at the moment"}
              </p>
              {areFiltersActive() && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear all filters
                </button>
              )}
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
                    jobTypes={filters.jobTypes}
                    salaryRange={filters.salaryRange}
                    experienceLevel={filters.experienceLevel}
                    workMode={filters.workMode}
                    onJobTypeChange={handleJobTypeChange}
                    onExperienceLevelChange={handleExperienceLevelChange}
                    onWorkModeChange={handleWorkModeChange}
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