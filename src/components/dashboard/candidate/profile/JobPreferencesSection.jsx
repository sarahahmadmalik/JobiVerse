"use client"
import { useState } from "react";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";

export default function JobPreferencesSection({ data, onUpdate, editMode }) {
  const [preferences, setPreferences] = useState(data);
  
  const employmentTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" }
  ];

  const remoteOptions = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "On-site" }
  ];

  const industries = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "marketing", label: "Marketing" },
    { value: "design", label: "Design" },
    { value: "other", label: "Other" }
  ];

  const salaryRanges = [
    { value: "under-50k", label: "Under $50,000" },
    { value: "50k-75k", label: "$50,000 - $75,000" },
    { value: "75k-100k", label: "$75,000 - $100,000" },
    { value: "100k-125k", label: "$100,000 - $125,000" },
    { value: "125k-150k", label: "$125,000 - $150,000" },
    { value: "over-150k", label: "Over $150,000" },
    { value: "negotiable", label: "Negotiable" }
  ];

  const handleChange = (field, value) => {
    const updated = { ...preferences, [field]: value };
    setPreferences(updated);
    onUpdate(updated);
  };

  const toggleEmploymentType = (type) => {
    const currentTypes = preferences.employmentTypes || [];
    const updatedTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    handleChange('employmentTypes', updatedTypes);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Job Preferences</h2>
      </div>

      <div className="space-y-6">
        {/* Desired Job Title */}
        <Input
          label="Desired Job Title"
          value={preferences.jobTitle || ''}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          disabled={!editMode}
          placeholder="e.g. Frontend Developer"
          className="!px-3"
        />

        {/* Employment Type - Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type
          </label>
          {editMode ? (
            <div className="space-y-2">
              {employmentTypes.map((type) => (
                <label key={type.value} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.employmentTypes?.includes(type.value) || false}
                    onChange={() => toggleEmploymentType(type.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {preferences.employmentTypes?.length > 0 ? (
                preferences.employmentTypes.map(type => {
                  const label = employmentTypes.find(t => t.value === type)?.label;
                  return (
                    <span key={type} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {label || type}
                    </span>
                  );
                })
              ) : (
                <p className="text-gray-500">Not specified</p>
              )}
            </div>
          )}
        </div>

        {/* Work Location Preference - Dropdown */}
        <Dropdown
          label="Work Location Preference"
          options={remoteOptions}
          value={preferences.remotePreference}
          onChange={(value) => handleChange('remotePreference', value)}
          placeholder="Select work location"
          disabled={!editMode}
        />

        {/* Industry - Dropdown */}
        <Dropdown
          label="Industry"
          options={industries}
          value={preferences.industry}
          onChange={(value) => handleChange('industry', value)}
          placeholder="Select industry"
          disabled={!editMode}
        />

        {/* Salary Expectation Range - Dropdown */}
        <Dropdown
          label="Expected Salary Range (Optional)"
          options={salaryRanges}
          value={preferences.salaryRange}
          onChange={(value) => handleChange('salaryRange', value)}
          placeholder="Select salary range"
          disabled={!editMode}
        />
      </div>
    </div>
  );
}