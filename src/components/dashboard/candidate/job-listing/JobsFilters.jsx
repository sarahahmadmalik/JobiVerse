'use client';

export default function JobFilters({
  jobTypes,
  salaryRange,
  experienceLevel,
  workSetting,
  onJobTypeChange,
  onExperienceLevelChange,
  onWorkSettingChange,
  onMinSalaryChange,
  onMaxSalaryChange,
  onClearAll,
  formatSalary
}) {
  return (
    <div className="bg-white p-6 min-w-[300px] min-h-screen h-full rounded-lg shadow-sm border border-gray-100">
      {/* Clear All Button at the Top */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <button
          onClick={onClearAll}
          className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors flex items-center"
        >
          Clear All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Job Type Section */}
      <div className="mb-5">
        <h3 className="text-md font-medium text-gray-900 mb-3">Job Type</h3>
        <div className="space-y-2">
          {['fullTime', 'partTime', 'contract', 'internship'].map((type) => (
            <div key={type} className="flex items-center">
              <input
                id={type}
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={jobTypes[type]}
                onChange={() => onJobTypeChange(type)}
              />
              <label htmlFor={type} className="ml-2 text-sm text-gray-700">
                {type.split(/(?=[A-Z])/).join(' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Range Section */}
      <div className="mb-5">
        <h3 className="text-md font-medium text-gray-900 mb-3">Salary Range (Annual)</h3>
        <div className="space-y-4 px-2">
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="minSalary" className="text-xs text-gray-600">Minimum</label>
              <span className="text-xs font-medium text-indigo-600">{formatSalary(salaryRange.min)}</span>
            </div>
            <input
              id="minSalary"
              type="range"
              min="0"
              max="200"
              step="5"
              value={salaryRange.min}
              onChange={onMinSalaryChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0k</span>
              <span>$200k</span>
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
              max="200"
              step="5"
              value={salaryRange.max}
              onChange={onMaxSalaryChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0k</span>
              <span>$200k</span>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-2 rounded-lg text-center">
            <p className="text-xs text-indigo-800">
              {formatSalary(salaryRange.min)} - {formatSalary(salaryRange.max)}/year
            </p>
          </div>
        </div>
      </div>

      {/* Experience Level Section */}
      <div className="mb-5">
        <h3 className="text-md font-medium text-gray-900 mb-3">Experience Level</h3>
        <div className="space-y-2">
          {['entryLevel', 'intermediate', 'senior'].map((level) => (
            <div key={level} className="flex items-center">
              <input
                id={level}
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={experienceLevel[level]}
                onChange={() => onExperienceLevelChange(level)}
              />
              <label htmlFor={level} className="ml-2 text-sm text-gray-700">
                {level.split(/(?=[A-Z])/).join(' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Work Setting Section */}
      <div className="mb-5">
        <h3 className="text-md font-medium text-gray-900 mb-3">Work Setting</h3>
        <div className="space-y-2">
          {['remote', 'hybrid', 'onsite'].map((setting) => (
            <div key={setting} className="flex items-center">
              <input
                id={setting}
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={workSetting[setting]}
                onChange={() => onWorkSettingChange(setting)}
              />
              <label htmlFor={setting} className="ml-2 text-sm text-gray-700">
                {setting === 'onsite' ? 'On-site' : setting.charAt(0).toUpperCase() + setting.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}