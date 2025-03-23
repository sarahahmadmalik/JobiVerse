"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Toast from "@/components/ui/toast";
import { X, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";
import Spinner from "@/components/ui/spinner";

const CandStepFour = () => {
  const { nextStep } = useOnboarding();
  const [experiences, setExperiences] = useState([
    {
      jobTitle: "",
      company: "",
      location: "",
      employmentType: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  // Add a new experience field
  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        jobTitle: "",
        company: "",
        location: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  // Remove an experience field
  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // Handle input change
  const handleInputChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);
  };

  // Save & Continue action
  const handleSave = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your work experience has been saved successfully.",
      });
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        nextStep({ experiences });
      }, 2000);
    }, 2000);
  };

  return (
    <div className="flex gap-3 w-full max-w-[637px] min-h-[450px] flex-col items-center justify-center bg-white px-4 py-6 sm:px-6 md:px-8 lg:px-10 rounded-[24px] shadow-[0px_8px_18px_0px_rgba(19,17,28,0.12)]">
      {/* Toast Notification */}
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
            />
            <Input
              label="Company Name"
              placeholder="e.g., ABC Corp"
              value={experience.company}
              onChange={(e) =>
                handleInputChange(index, "company", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <Input
              label="Location"
              placeholder="Select or Enter"
              value={experience.location}
              onChange={(e) =>
                handleInputChange(index, "location", e.target.value)
              }
            />
            <Input
              label="Employment Type"
              placeholder="e.g., Internship"
              value={experience.employmentType}
              onChange={(e) =>
                handleInputChange(index, "employmentType", e.target.value)
              }
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
          disabled={isLoading}
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
