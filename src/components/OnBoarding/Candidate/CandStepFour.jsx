"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import Toast from "@/components/ui/toast";
import { X, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";
import Spinner from "@/components/ui/spinner";
import { useOnboardingData } from "@/hooks/useOnboardingData";

// Constants for dropdown options
const WORK_LOCATIONS = [
  { value: "Onsite", label: "Onsite" },
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" }
];

const EMPLOYMENT_TYPES = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Temporary", label: "Temporary" },
  { value: "Internship", label: "Internship" },
  { value: "Freelance", label: "Freelance" }
];

const CandStepFour = () => {
  const { nextStep, updateFormData } = useOnboarding();
  const { fetchData, isLoading, error } = useOnboardingData("step-four");
  const [experiences, setExperiences] = useState([
    {
      jobTitle: "",
      companyName: "",
      location: "", // Changed from 'location' to 'location'
      employmentType: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        jobTitle: "",
        companyName: "",
        location: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);
    updateFormData({ experiences: updatedExperiences });
  };

  const validateExperiences = () => {
    return experiences.every(exp => 
      exp.jobTitle.trim() && 
      exp.companyName.trim() && 
      exp.startDate &&
      exp.location && // Added validation for work location
      exp.employmentType // Added validation for employment type
    );
  };

  const handleSave = async () => {
    if (!validateExperiences()) {
      setToastConfig({
        type: "error",
        title: "Validation Error",
        message: "Please fill all required fields (Job Title, companyName, Start Date, Work Location, and Employment Type)",
      });
      setShowToast(true);
      return;
    }

    try {
      const formattedExperiences = experiences.map(exp => ({
        jobTitle: exp.jobTitle.trim(),
        companyNameName: exp.companyName.trim(),
        location: exp.location,
        employmentType: exp.employmentType,
        startDate: exp.startDate,
        endDate: exp.endDate || null,
        description: exp.description.trim()
      }));

      await fetchData({
        method: "POST",
        body: { experiences: formattedExperiences }
      });

      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your work experience has been saved successfully.",
      });
      setShowToast(true);

      setTimeout(() => {
        nextStep({ experiences: formattedExperiences });
      }, 2000);
    } catch (err) {
      setToastConfig({
        type: "error",
        title: "Error",
        message: error || "Failed to save your experiences",
      });
      setShowToast(true);
    }
  };

  return (
    <div className="flex gap-3 w-full max-w-[637px] min-h-[450px] flex-col items-center justify-center bg-white px-4 py-6 sm:px-6 md:px-8 lg:px-10 rounded-[24px] shadow-[0px_8px_18px_0px_rgba(19,17,28,0.12)]">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[30px]"
          >
            <Toast
              type={toastConfig.type}
              title={toastConfig.title}
              message={toastConfig.message}
              onClose={() => setShowToast(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Your Career Journey So Far
      </h2>
      <p className="text-gray-500 text-center mb-4">
        From your first job to your latest role, tell us about your professional
        experience. It all adds up!
      </p>

      {experiences.map((experience, index) => (
        <div
          key={index}
          className="w-full bg-gray-50 p-4 rounded-lg mb-4 relative"
        >
          {index > 0 && (
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => removeExperience(index)}
            >
              <X size={20} />
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Job Title"
              placeholder="e.g., Marketing Manager"
              value={experience.jobTitle}
              onChange={(e) =>
                handleInputChange(index, "jobTitle", e.target.value)
              }
              required
            />
            <Input
              label="companyName Name"
              placeholder="e.g., ABC Corp"
              value={experience.companyName}
              onChange={(e) =>
                handleInputChange(index, "companyName", e.target.value)
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <Dropdown
              label="Work Location"
              options={WORK_LOCATIONS}
              value={experience.location}
              onChange={(value) =>
                handleInputChange(index, "location", value)
              }
              placeholder="Select work location"
              required
            />
            <Dropdown
              label="Employment Type"
              options={EMPLOYMENT_TYPES}
              value={experience.employmentType}
              onChange={(value) =>
                handleInputChange(index, "employmentType", value)
              }
              placeholder="Select employment type"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <Input
              label="Start Date"
              placeholder="MM/YYYY"
              type="month"
              value={experience.startDate}
              onChange={(e) =>
                handleInputChange(index, "startDate", e.target.value)
              }
              required
            />
            <Input
              label="End Date (Optional)"
              placeholder="MM/YYYY"
              type="month"
              value={experience.endDate}
              onChange={(e) =>
                handleInputChange(index, "endDate", e.target.value)
              }
            />
          </div>

          <div className="mt-3">
            <Input
              label="Job Description"
              placeholder="Briefly describe your role"
              value={experience.description}
              onChange={(e) =>
                handleInputChange(index, "description", e.target.value)
              }
              multiline
            />
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row w-full gap-2 justify-end items-center mt-3">
        <button
          className="flex items-center px-6 py-2 gap-2 text-colors-primary border border-colors-primary rounded-[12px] !font-[400] !text-[16px]"
          onClick={addExperience}
          disabled={isLoading}
        >
          Add Experience
          <PlusCircle size={20} className="mr-2" />
        </button>

        <Button
          className={`!font-[400] !text-[16px] flex items-center justify-center gap-3 transition-all duration-300 ${
            isLoading ? "!shadow-none" : "subtle-shadow"
          }`}
          onClick={handleSave}
          disabled={isLoading || !validateExperiences()}
        >
          Save & Continue
          {isLoading && (
            <Spinner className="transition-opacity duration-300 opacity-100" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default CandStepFour;