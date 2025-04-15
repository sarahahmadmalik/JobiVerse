"use client";
import { useState } from "react";
import Dropdown from "@/components/ui/dropdown";
import Input from "@/components/ui/input";
import { CalendarIcon, X } from "lucide-react";

const JobPostingForm = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    experienceLevel: "",
    industry: "",
    salaryExpectation: "",
    qualifications: "",
    startDate: "",
    employmentType: ["Part Time"],
    remotePreference: ["On-Site"],
    skills: [],
    jobDescription: "",
    hiringProcess: ""
  });

  const industryOptions = [
    { value: "tech", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufacturing" }
  ];

  const skillSuggestions = [
    "Project Management",
    "Data Analysis",
    "Communication",
    "JavaScript",
    "UX/UI Design",
    "Content Writing",
    "Search Engine Optimization (SEO)",
    "Customer Service"
  ];

  const handleEmploymentTypeChange = (type) => {
    if (formData.employmentType.includes(type)) {
      setFormData({
        ...formData,
        employmentType: formData.employmentType.filter(item => item !== type)
      });
    } else {
      setFormData({
        ...formData,
        employmentType: [...formData.employmentType, type]
      });
    }
  };

  const handleRemotePreferenceChange = (preference) => {
    if (formData.remotePreference.includes(preference)) {
      setFormData({
        ...formData,
        remotePreference: formData.remotePreference.filter(item => item !== preference)
      });
    } else {
      setFormData({
        ...formData,
        remotePreference: [...formData.remotePreference, preference]
      });
    }
  };

  const handleIndustryChange = (value) => {
    setFormData({
      ...formData,
      industry: value
    });
  };

  const handleSkillSelect = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-xl font-semibold text-gray-800 mb-8">Create Job</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-1">
            <Input 
              label="Job Title" 
              placeholder="e.g., Marketing Manager"
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
            />
          </div>
          <div className="md:col-span-1">
            <Input 
              label="Experience Level" 
              placeholder="e.g., Entry-Level"
              value={formData.experienceLevel}
              onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
            />
          </div>
          <div className="md:col-span-1">
            <Dropdown 
              label="Industry"
              options={industryOptions}
              onChange={handleIndustryChange}
              placeholder="Select"
              value={formData.industry}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
          <div className="md:col-span-1">
            <Input 
              label="Salary Expectation(optional)" 
              placeholder="e.g., $50,000 per year"
              value={formData.salaryExpectation}
              onChange={(e) => setFormData({...formData, salaryExpectation: e.target.value})}
            />
          </div>
          <div className="md:col-span-1">
            <Input 
              label="Preferred Qualifications" 
              placeholder="e.g., MS Computer Science"
              value={formData.qualifications}
              onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
            />
          </div>
          <div className="md:col-span-1">
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Expected Start Date
              </label>
              <div className="relative">
                <Input 
                  placeholder="MM/YYYY"
                  className="pl-4 pr-10"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
                <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Employment Type</p>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-colors-primary rounded border-gray-300 focus:ring-colors-primary" 
                  checked={formData.employmentType.includes("Part Time")} 
                  onChange={() => handleEmploymentTypeChange("Part Time")}
                />
                <span className="ml-2 text-sm text-gray-800">Part Time</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-colors-primary rounded border-gray-300 focus:ring-colors-primary"
                  checked={formData.employmentType.includes("Full Time")} 
                  onChange={() => handleEmploymentTypeChange("Full Time")}
                />
                <span className="ml-2 text-sm text-gray-800">Full Time</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-colors-primary rounded border-gray-300 focus:ring-colors-primary"
                  checked={formData.employmentType.includes("Contract")} 
                  onChange={() => handleEmploymentTypeChange("Contract")}
                />
                <span className="ml-2 text-sm text-gray-800">Contract</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-colors-primary rounded border-gray-300 focus:ring-colors-primary"
                  checked={formData.employmentType.includes("Temporary")} 
                  onChange={() => handleEmploymentTypeChange("Temporary")}
                />
                <span className="ml-2 text-sm text-gray-800">Temporary</span>
              </label>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Remote/In-Office Preferences</p>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-colors-primary rounded border-gray-300 focus:ring-colors-primary"
                  checked={formData.remotePreference.includes("On-Site")} 
                  onChange={() => handleRemotePreferenceChange("On-Site")}
                />
                <span className="ml-2 text-sm text-gray-800">On-Site</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-colors-primary rounded border-gray-300 focus:ring-colors-primary"
                  checked={formData.remotePreference.includes("Remote")} 
                  onChange={() => handleRemotePreferenceChange("Remote")}
                />
                <span className="ml-2 text-sm text-gray-800">Remote</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-colors-primary rounded border-gray-300 focus:ring-colors-primary"
                  checked={formData.remotePreference.includes("Hybrid")} 
                  onChange={() => handleRemotePreferenceChange("Hybrid")}
                />
                <span className="ml-2 text-sm text-gray-800">Hybrid</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Skills Required</p>
          <InputAuto 
            label=""
            placeholder="Type a skill, e.g., Project Management"
            suggestions={skillSuggestions}
            onSelect={handleSkillSelect}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className="flex text-colors-primary items-center px-3 py-1 border border-colors-primary rounded-full text-sm font-[400]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-colors-primary hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Job Description</p>
            <textarea 
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 
                         focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary
                         hover:border-gray-400 transition-all duration-200 ease-in-out"
              placeholder="Enter job description"
              value={formData.jobDescription}
              onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Hiring Process</p>
            <textarea 
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 
                         focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary
                         hover:border-gray-400 transition-all duration-200 ease-in-out"
              placeholder="Describe the hiring process"
              value={formData.hiringProcess}
              onChange={(e) => setFormData({...formData, hiringProcess: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-6 py-3 bg-colors-primary text-white rounded-lg hover:bg-colors-primary-dark transition-colors duration-200"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

const InputAuto = ({ label, suggestions = [], onSelect, ...props }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      setFilteredSuggestions(
        suggestions.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    onSelect(item);
    setInputValue("");
    setFilteredSuggestions([]);
  };

  return (
    <div className="relative flex flex-col w-full">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Input field */}
      <input
        {...props}
        value={inputValue}
        onChange={handleInputChange}
        className="w-full px-[24px] py-[12px] border border-gray-300 rounded-[12px] text-gray-800 placeholder-gray-400 
                   focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
                   hover:border-gray-400 transition-all duration-200 ease-in-out"
      />

      {/* Suggestions dropdown */}
      {inputValue && filteredSuggestions.length > 0 && (
        <div className="absolute top-[4.2rem] z-10 w-full bg-white border border-gray-300 rounded-[12px] mt-1 shadow-md max-h-[200px] overflow-y-auto">
          {filteredSuggestions.map((item) => (
            <div
              key={item}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800"
              onClick={() => handleSelect(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPostingForm;