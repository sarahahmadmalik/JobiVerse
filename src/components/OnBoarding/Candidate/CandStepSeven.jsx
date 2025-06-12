"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import Toast from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";
import Spinner from "@/components/ui/spinner";
import { useOnboardingData } from "@/hooks/useOnboardingData";

const LOCATIONS = [
  { value: "Remote", label: "Remote" },
  { value: "New York, NY", label: "New York, NY" },
  { value: "San Francisco, CA", label: "San Francisco, CA" },
  { value: "Austin, TX", label: "Austin, TX" },
  { value: "Seattle, WA", label: "Seattle, WA" },
  { value: "Chicago, IL", label: "Chicago, IL" },
  { value: "Other", label: "Other" }
];

const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "hospitality", label: "Hospitality" },
  { value: "marketing", label: "Marketing" },
  { value: "design", label: "Design" },
  { value: "construction", label: "Construction" },
  { value: "transportation", label: "Transportation" },
  { value: "entertainment", label: "Entertainment" },
  { value: "energy", label: "Energy" },
  { value: "agriculture", label: "Agriculture" },
  { value: "government", label: "Government" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "other", label: "Other" }
];

const CandStepSeven = () => {
  const { nextStep, updateFormData } = useOnboarding();
  const { fetchData, isLoading, error } = useOnboardingData("step-seven");
  const [jobPreferences, setJobPreferences] = useState({
    desiredTitle: "",
    preferredLocations: [],
    industries: [],
    salaryExpectation: "",
    employmentTypes: [],
  });
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const handleChange = (field, value) => {
    setJobPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmploymentTypeChange = (type) => {
    setJobPreferences((prev) => {
      const updatedTypes = prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter((t) => t !== type)
        : [...prev.employmentTypes, type];
      return { ...prev, employmentTypes: updatedTypes };
    });
  };

  const handleSave = async () => {
    if (!jobPreferences.desiredTitle || jobPreferences.employmentTypes.length === 0) {
      setToastConfig({
        type: "error",
        title: "Validation Error",
        message: "Please fill in required fields (Job Title and Employment Type)",
      });
      setShowToast(true);
      return;
    }

    try {
      await fetchData({
        method: "POST",
        body: { jobPreferences }
      });

      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your job preferences have been saved successfully.",
      });
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        nextStep({ jobPreferences });
      }, 2000);
    } catch (err) {
      setToastConfig({
        type: "error",
        title: "Error",
        message: error || "Failed to save your preferences",
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
        Your Ideal Job, Defined
      </h2>
      <p className="text-gray-500 text-center mb-4">
        Tell us what you're looking for—preferred roles, locations, and
        industries.
      </p>

      <Input
        label="Desired Job Title"
        placeholder="e.g., Data Scientist, Marketing Specialist"
        value={jobPreferences.desiredTitle}
        onChange={(e) => handleChange("desiredTitle", e.target.value)}
      />

      <Dropdown
        label="Preferred Locations"
        options={LOCATIONS}
        value={jobPreferences.preferredLocations[0] || ""}
        onChange={(value) => handleChange("preferredLocations", [value])}
        placeholder="Select preferred location"
      />

      <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 gap-3 w-full">
        <Dropdown
          label="Industry"
          options={INDUSTRIES}
          value={jobPreferences.industries[0] || ""}
          onChange={(value) => handleChange("industries", [value])}
          placeholder="Select an industry"
        />
        <Input
          label="Salary Expectation (optional)"
          placeholder="e.g., $50,000 per year"
          className="-mb-5"
          value={jobPreferences.salaryExpectation}
          onChange={(e) => handleChange("salaryExpectation", e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full mt-3">
        <label className="text-sm font-medium text-gray-700">
          Employment Type
        </label>
        <div className="flex flex-wrap gap-5 mt-2">
          {["Full Time", "Part Time", "Contract", "Freelance", "Internship"].map(
            (type, index) => (
              <div className="flex gap-3 items-center" key={index}>
                <label
                  key={type}
                  className="flex text-gray-700 text-sm items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={jobPreferences.employmentTypes.includes(type)}
                    onChange={() => handleEmploymentTypeChange(type)}
                  />
                  {type}
                </label>
              </div>
            )
          )}
        </div>
      </div>

      <div className="w-full flex justify-end">
        <Button
          className={`mt-5 !font-[400] !text-[16px] flex items-center justify-center gap-3 transition-all duration-300 ${
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

export default CandStepSeven;