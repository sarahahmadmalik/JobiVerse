"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import Spinner from "@/components/ui/spinner";
import Toast from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";
import { useOnboardingData } from "@/hooks/useOnboardingData";

const industries = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "construction", label: "Construction" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "transportation", label: "Transportation & Logistics" },
  { value: "energy", label: "Energy & Utilities" },
  { value: "telecom", label: "Telecommunications" },
  { value: "media", label: "Media & Entertainment" },
  { value: "agriculture", label: "Agriculture" },
  { value: "pharmaceutical", label: "Pharmaceutical" },
  { value: "aerospace", label: "Aerospace & Defense" },
  { value: "automotive", label: "Automotive" },
  { value: "real-estate", label: "Real Estate" },
  { value: "professional-services", label: "Professional Services" },
  { value: "non-profit", label: "Non-Profit" },
  { value: "government", label: "Government" },
  { value: "fashion", label: "Fashion & Apparel" },
  { value: "food-beverage", label: "Food & Beverage" },
  { value: "biotech", label: "Biotechnology" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "other", label: "Other" },
];

const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1,000 employees" },
  { value: "1001-5000", label: "1,001-5,000 employees" },
  { value: "5001-10000", label: "5,001-10,000 employees" },
  { value: "10000+", label: "10,000+ employees" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
  value: (currentYear - i).toString(),
  label: (currentYear - i).toString(),
}));

const StepTwo = () => {
  const { nextStep, updateFormData } = useOnboarding();
  const { fetchData, isLoading, error } = useOnboardingData("step-two", "recruiter");
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    location: "",
    website: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    updateFormData(updatedData);
  };

  const handleDropdownChange = (name, value) => {
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    updateFormData(updatedData);
  };

  const handleSave = async () => {
    try {
      await fetchData({
        method: "POST",
        body: formData
      });

      setShowToast(true);
      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Company details saved successfully",
      });

      setTimeout(() => {
        nextStep(formData);
      }, 2000);
    } catch (err) {
      setShowToast(true);
      setToastConfig({
        type: "error",
        title: "Error",
        message: error || "Failed to save company details",
      });
    }
  };

  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

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

      <h2 className="text-2xl text-colors-textPrimary font-[700] mt-4 text-center">
        Tell us about your company
      </h2>
      <p className="text-[#161819AB] font-[300] text-center mb-6">
        This information helps job seekers know more about your organization.
      </p>

      <div className="space-y-4 w-full px-4 md:px-4">
        <div>
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Company Name *
          </label>
          <Input 
            type="text" 
            name="companyName"
            placeholder="e.g., JobiVerse Inc."
            value={formData.companyName}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Dropdown
              label="Industry *"
              name="industry"
              options={industries}
              value={formData.industry}
              onChange={(value) => handleDropdownChange("industry", value)}
            />
          </div>
          <div>
            <Dropdown
              label="Company Size *"
              name="companySize"
              options={companySizes}
              value={formData.companySize}
              onChange={(value) => handleDropdownChange("companySize", value)}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Location *
          </label>
          <Input 
            type="text" 
            name="location"
            placeholder="e.g., New York, NY"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Company Website (optional)
          </label>
          <Input 
            type="url" 
            name="website"
            placeholder="https://yourcompany.com"
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex justify-center sm:justify-end mt-5 mb-5 sm:mt-3 sm:mb-0 w-full px-4">
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

export default StepTwo;