"use client"
import { useState } from "react";
import { TrashIcon } from "lucide-react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function ExperienceSection({ data, onUpdate, editMode }) {
  const [experiences, setExperiences] = useState(data);
  const [newExperience, setNewExperience] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    employmentType: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newExperience.jobTitle && newExperience.companyName) {
      const updated = [...experiences, { 
        ...newExperience, 
        id: Date.now() + Math.random().toString(36).substring(2) // More unique ID
      }];
      setExperiences(updated);
      onUpdate(updated);
      setNewExperience({
        jobTitle: '',
        companyName: '',
        location: '',
        employmentType: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      setIsAdding(false);
    }
  };

  const handleRemove = (id) => {
    const updated = experiences.filter(exp => exp.id !== id);
    setExperiences(updated);
    onUpdate(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        {editMode && !isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="!px-3 py-1 !font-[500] !shadow-none text-white !text-sm rounded-md"
          >
            Add Experience
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-md">
          <h3 className="font-medium mb-3">Add New Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Title*"
              type="text"
              placeholder="e.g., Marketing Manager"
              value={newExperience.jobTitle}
              onChange={(e) => setNewExperience({...newExperience, jobTitle: e.target.value})}
              className={"!px-3"}
            />
            <Input
              label="Company Name*"
              type="text"
              placeholder="e.g., ABC Corp"
              value={newExperience.companyName}
              onChange={(e) => setNewExperience({...newExperience, companyName: e.target.value})}
              className={"!px-3"}
            />
            <Input
              label="Location"
              type="text"
              placeholder="Select or Enter"
              value={newExperience.location}
              onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
              className={"!px-3"}
            />
            <Input
              label="Employment Type"
              type="text"
              placeholder="e.g., Internship"
              value={newExperience.employmentType}
              onChange={(e) => setNewExperience({...newExperience, employmentType: e.target.value})}
              className={"!px-3"}
            />
            <Input
              label="Start Date"
              type="month"
              placeholder="MM/YYYY"
              value={newExperience.startDate}
              onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
              className={"!px-3"}
            />
            <Input
              label="End Date (Optional)"
              type="month"
              placeholder="MM/YYYY"
              value={newExperience.endDate}
              onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
              className={"!px-3"}
            />
            <div className="md:col-span-2">
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  placeholder="e.g., Managed marketing campaigns..."
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-[12px] border border-gray-300 rounded-[12px] text-gray-800 placeholder-gray-400 
                             focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
                             hover:border-gray-400 transition-all duration-200 ease-in-out"
                />
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-end space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <Button
              onClick={handleAdd}
              disabled={!newExperience.jobTitle || !newExperience.companyName}
              className={`!px-3 py-1 text-white !shadow-none !rounded !text-sm ${
                !newExperience.jobTitle || !newExperience.companyName
                  ? 'cursor-not-allowed'
                  : ''
              }`}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {experiences.length === 0 ? (
          <p className="text-gray-500">No work experience added yet</p>
        ) : (
          experiences.map(exp => (
            <div key={exp.id || exp._id || `${exp.jobTitle}-${exp.companyName}`} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium">{exp.jobTitle}</h3>
                  <p className="text-gray-600">
                    {exp.companyName}
                    {exp.location && ` | ${exp.location}`}
                  </p>
                  {(exp.startDate || exp.endDate) && (
                    <p className="text-sm text-gray-500">
                      {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                    </p>
                  )}
                  {exp.employmentType && (
                    <p className="text-sm text-gray-500">{exp.employmentType}</p>
                  )}
                  {exp.description && (
                    <p className="mt-1 text-gray-700 text-sm">{exp.description}</p>
                  )}
                </div>
                {editMode && (
                  <button
                    onClick={() => handleRemove(exp.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                    aria-label="Remove experience"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}