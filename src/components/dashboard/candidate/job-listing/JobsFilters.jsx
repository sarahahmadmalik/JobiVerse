'use client';

export default function JobFilters({
  jobTypes,
  salaryRange,
  experienceLevel,
  workMode,
  onJobTypeChange,
  onExperienceLevelChange,
  onWorkModeChange,
  onMinSalaryChange,
  onMaxSalaryChange,
  onClearAll,
  formatSalary
}) {
  const experienceLevelOptions = [
    { id: "entry", value: "Entry", label: "Entry Level" },
    { id: "intermediate", value: "Intermediate", label: "Intermediate" },
    { id: "senior", value: "Senior", label: "Senior Level" },
    { id: "lead", value: "Lead", label: "Lead" },
    { id: "executive", value: "Executive", label: "Executive" }
  ];

  const jobTypeOptions = [
    { id: "fullTime", value: "Full-time", label: "Full-time" },
    { id: "partTime", value: "Part-time", label: "Part-time" },
    { id: "contract", value: "Contract", label: "Contract" },
    { id: "internship", value: "Internship", label: "Internship" },
    { id: "freelance", value: "Freelance", label: "Freelance" }
  ];

  const workModeOptions = [
    { id: "remote", value: "Remote", label: "Remote" },
    { id: "hybrid", value: "Hybrid", label: "Hybrid" },
    { id: "onsite", value: "On-site", label: "On-site" }
  ];

  // Check if any filters are active
  const isFilterActive = () => {
    const defaultFilters = {
      jobTypes: Object.fromEntries(jobTypeOptions.map(opt => [opt.id, false])),
      salaryRange: { min: 30000, max: 150000 },
      experienceLevel: Object.fromEntries(experienceLevelOptions.map(opt => [opt.id, false])),
      workMode: Object.fromEntries(workModeOptions.map(opt => [opt.id, false]))
    };

    return JSON.stringify({
      jobTypes,
      salaryRange,
      experienceLevel,
      workMode
    }) !== JSON.stringify(defaultFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full">
      {/* Header with Clear All button */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        {isFilterActive() && (
          <button
            onClick={onClearAll}
            className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors flex items-center"
            aria-label="Clear all filters"
          >
            Clear All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Job Type Section */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-3">Job Type</h3>
        <div className="space-y-3">
          {jobTypeOptions.map((type) => (
            <div key={type.id} className="flex items-center">
              <input
                id={`job-type-${type.id}`}
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={jobTypes[type.id]}
                onChange={() => onJobTypeChange(type.id)}
                aria-labelledby={`job-type-label-${type.id}`}
              />
              <label 
                id={`job-type-label-${type.id}`}
                htmlFor={`job-type-${type.id}`} 
                className="ml-3 text-sm text-gray-700 cursor-pointer"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Range Section */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-3">Salary Range (Annual)</h3>
        <div className="space-y-4 px-1">
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="minSalary" className="text-xs text-gray-600">Minimum</label>
              <span className="text-xs font-medium text-indigo-600">{formatSalary(salaryRange.min)}</span>
            </div>
            <input
              id="minSalary"
              type="range"
              min="0"
              max="300000"
              step="5000"
              value={salaryRange.min}
              onChange={(e) => onMinSalaryChange(e.target.value)}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              aria-valuemin="0"
              aria-valuemax="300000"
              aria-valuenow={salaryRange.min}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$300k+</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="maxSalary" className="text-xs text-gray-600">Maximum</label>
              <span className="text-xs font-medium text-indigo-600">{formatSalary(salaryRange.max)}</span>
            </div>
            <input
              id="maxSalary"
              type="range"
              min="0"
              max="300000"
              step="5000"
              value={salaryRange.max}
              onChange={(e) => onMaxSalaryChange(e.target.value)}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              aria-valuemin="0"
              aria-valuemax="300000"
              aria-valuenow={salaryRange.max}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$300k+</span>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-3 rounded-lg text-center">
            <p className="text-sm text-indigo-800 font-medium">
              {formatSalary(salaryRange.min)} - {formatSalary(salaryRange.max)}
            </p>
          </div>
        </div>
      </div>

      {/* Experience Level Section */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-3">Experience Level</h3>
        <div className="space-y-3">
          {experienceLevelOptions.map((level) => (
            <div key={level.id} className="flex items-center">
              <input
                id={`exp-level-${level.id}`}
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={experienceLevel[level.id]}
                onChange={() => onExperienceLevelChange(level.id)}
                aria-labelledby={`exp-level-label-${level.id}`}
              />
              <label 
                id={`exp-level-label-${level.id}`}
                htmlFor={`exp-level-${level.id}`} 
                className="ml-3 text-sm text-gray-700 cursor-pointer"
              >
                {level.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Work Mode Section */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-3">Work Mode</h3>
        <div className="space-y-3">
          {workModeOptions.map((mode) => (
            <div key={mode.id} className="flex items-center">
              <input
                id={`work-mode-${mode.id}`}
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={workMode[mode.id]}
                onChange={() => onWorkModeChange(mode.id)}
                aria-labelledby={`work-mode-label-${mode.id}`}
              />
              <label 
                id={`work-mode-label-${mode.id}`}
                htmlFor={`work-mode-${mode.id}`} 
                className="ml-3 text-sm text-gray-700 cursor-pointer"
              >
                {mode.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}