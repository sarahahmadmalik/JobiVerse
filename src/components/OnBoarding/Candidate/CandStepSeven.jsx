"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import Toast from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";
import Spinner from "@/components/ui/spinner";

const CandStepSeven = () => {
  const { nextStep } = useOnboarding();
  const [jobPreferences, setJobPreferences] = useState({
    jobTitle: "",
    locations: "",
    industry: "",
    salary: "",
    employmentType: [],
  });
  const [isLoading, setIsLoading] = useState(false);
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
      const updatedTypes = prev.employmentType.includes(type)
        ? prev.employmentType.filter((t) => t !== type)
        : [...prev.employmentType, type];
      return { ...prev, employmentType: updatedTypes };
    });
  };

  const handleSave = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
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
    }, 2000);
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
        value={jobPreferences.jobTitle}
        onChange={(e) => handleChange("jobTitle", e.target.value)}
      />
      <Input
        label="Preferred Locations"
        placeholder="e.g., New York, Remote"
        value={jobPreferences.locations}
        onChange={(e) => handleChange("locations", e.target.value)}
      />

      <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 gap-3 w-full">
        <Dropdown
          label="Industry"
          options={[
            { label: "Tech", value: "tech" },
            { label: "Finance", value: "finance" },
            { label: "Healthcare", value: "healthcare" },
          ]}
          onChange={(value) => handleChange("industry", value)}
          placeholder="Select an industry"
        />
        <Input
          label="Salary Expectation (optional)"
          placeholder="e.g., $50,000 per year"
          className="-mb-5"
          value={jobPreferences.salary}
          onChange={(e) => handleChange("salary", e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full mt-3">
        <label className="text-sm font-medium text-gray-700">
          Employment Type
        </label>
        <div className="flex flex-wrap gap-5 mt-2">
          {["Part Time", "Full Time", "Contract", "Temporary"].map(
            (type, index) => (
              <div className="flex gap-3 items-center" key={index}>
                <label
                  key={type}
                  className="flex text-gray-700 text-sm items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={jobPreferences.employmentType.includes(type)}
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
