"use client";
import { useState, useEffect } from "react";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";

export default function JobPreferencesSection({ data, onUpdate, editMode }) {
  // Initialize state with default values matching your data structure
  const [preferences, setPreferences] = useState({
    desiredTitle: "",
    employmentTypes: [],
    preferredLocations: [], // Changed from remotePreference
    industries: [],
    desiredSalary: "",
    ...data // Spread the incoming data to override defaults
  });



  // Update local state when parent data changes
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      ...data
    }));
  }, [data]);


  const employmentTypes = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Freelance", label: "Freelance" },
    { value: "Temporary", label: "Temporary" }
  ];

  const locationOptions = [
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "On-site", label: "On-site" }
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

  const togglePreferredLocation = (location) => {
    const currentLocations = preferences.preferredLocations || [];
    const updatedLocations = currentLocations.includes(location)
      ? currentLocations.filter(l => l !== location)
      : [...currentLocations, location];
    handleChange('preferredLocations', updatedLocations);
  };

  const handleIndustryChange = (industry) => {
    // For single selection, replace the array with the new value
    handleChange('industries', industry ? [industry] : []);
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
          value={preferences.desiredTitle || ''}
          onChange={(e) => handleChange('desiredTitle', e.target.value)}
          disabled={!editMode}
          placeholder="e.g. Software Engineer"
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
                preferences.employmentTypes.map(type => (
                  <span key={type} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {type}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">Not specified</p>
              )}
            </div>
          )}
        </div>

        {/* Preferred Locations - Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Work Locations
          </label>
          {editMode ? (
            <div className="space-y-2">
              {locationOptions.map((location) => (
                <label key={location.value} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.preferredLocations?.includes(location.value) || false}
                    onChange={() => togglePreferredLocation(location.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{location.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {preferences.preferredLocations?.length > 0 ? (
                preferences.preferredLocations.map(location => (
                  <span key={location} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {location}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">Not specified</p>
              )}
            </div>
          )}
        </div>

        {/* Industry */}
        <Dropdown
          label="Industry"
          options={industries}
          value={preferences.industries[0] || ''}
          onChange={handleIndustryChange}
          placeholder="Select industry"
          disabled={!editMode}
        />

        {/* Desired Salary */}
        <Input
          label="Desired Salary (Optional)"
          value={preferences.desiredSalary || ''}
          onChange={(e) => handleChange('desiredSalary', e.target.value)}
          disabled={!editMode}
          placeholder="e.g. $80,000 - $100,000"
          className="!px-3"
        />
      </div>
    </div>
  );
}