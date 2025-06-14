"use client";
import { useState } from "react";
import Dropdown from "@/components/ui/dropdown";
import Input from "@/components/ui/input";
import InputAuto from "@/components/ui/input-auto";
import { CalendarIcon, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { createJobPost } from "@/services/jobpost-service";
import { SKILLS } from "@/constants/constants";

const JobPostingForm = () => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    responsibilities: [""],
    requirements: [""],
    experienceLevel: "",
    jobType: "",
    salary: {
      value: "",
      currency: "USD"
    },
    location: "",
    workMode: "",
    skills: []
  });

  const experienceLevelOptions = [
    { value: "Entry", label: "Entry Level" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Senior", label: "Senior Level" },
    { value: "Lead", label: "Lead" },
    { value: "Executive", label: "Executive" }
  ];

  const jobTypeOptions = [
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
    { value: "Freelance", label: "Freelance" }
  ];

  const workModeOptions = [
    { value: "Onsite", label: "Onsite" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Remote", label: "Remote" }
  ];


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        value: e.target.value
      }
    }));
  };

  const handleResponsibilityChange = (index, value) => {
    const newResponsibilities = [...formData.responsibilities];
    newResponsibilities[index] = value;
    setFormData(prev => ({ ...prev, responsibilities: newResponsibilities }));
  };

  const addResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""]
    }));
  };

  const removeResponsibility = (index) => {
    const newResponsibilities = formData.responsibilities.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, responsibilities: newResponsibilities }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }));
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const handleSkillSelect = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the data for API submission
      const submissionData = {
        ...formData,
        // Convert salary value to number
        salary: {
          ...formData.salary,
          value: formData.salary.value ? Number(formData.salary.value) : null
        },
        // Filter out empty responsibilities and requirements
        responsibilities: formData.responsibilities.filter(r => r.trim() !== ""),
        requirements: formData.requirements.filter(r => r.trim() !== ""),
        // Add recruiter ID from session
        recruiterId: session?.user?.id
      };
      const createdJob = await createJobPost(submissionData);
      
      router.push("/recruiter/job-posts");
      
    } catch (error) {
      throw error
      console.error("Failed to create job post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-xl font-semibold text-gray-800 mb-8">Create Job</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <Input 
              label="Job Title" 
              name="jobTitle"
              placeholder="e.g., Marketing Manager"
              value={formData.jobTitle}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Dropdown 
              label="Experience Level"
              options={experienceLevelOptions}
              onChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
              placeholder="Select experience level"
              value={formData.experienceLevel}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Job Description</label>
          <textarea
            name="jobDescription"
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 
                      focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary
                      hover:border-gray-400 transition-all duration-200 ease-in-out"
            placeholder="Enter detailed job description"
            value={formData.jobDescription}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Responsibilities</label>
          {formData.responsibilities.map((responsibility, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Input
                value={responsibility}
                onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                placeholder={`Responsibility ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => removeResponsibility(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addResponsibility}
            className="mt-2 text-colors-primary hover:text-colors-primary-dark text-sm"
          >
            + Add Responsibility
          </button>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Requirements</label>
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Input
                value={requirement}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                placeholder={`Requirement ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="mt-2 text-colors-primary hover:text-colors-primary-dark text-sm"
          >
            + Add Requirement
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
          <div>
            <Dropdown 
              label="Job Type"
              options={jobTypeOptions}
              onChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}
              placeholder="Select job type"
              value={formData.jobType}
              required
            />
          </div>
          <div>
            <Dropdown 
              label="Work Mode"
              options={workModeOptions}
              onChange={(value) => setFormData(prev => ({ ...prev, workMode: value }))}
              placeholder="Select work mode"
              value={formData.workMode}
              required
            />
          </div>
          <div>
            <Input 
              label="Location" 
              name="location"
              placeholder="e.g., New York, NY"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

 <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Skills Required</label>
          <InputAuto 
            placeholder="Type a skill, e.g., Project Management"
            suggestions={SKILLS}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2">
          <div>
            <Input 
              label="Salary" 
              name="salary"
              type="number"
              placeholder="e.g., 50000"
              value={formData.salary.value}
              onChange={handleSalaryChange}
            />
          </div>
          <div>
            <Dropdown 
              label="Currency"
              options={[{ value: "USD", label: "USD" }]}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                salary: { ...prev.salary, currency: value } 
              }))}
              value={formData.salary.currency}
              disabled
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

export default JobPostingForm;