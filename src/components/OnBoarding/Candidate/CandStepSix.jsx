"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Toast from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";
import Spinner from "@/components/ui/spinner";
import { Link as LinkIcon } from "lucide-react";
import { useOnboardingData } from "@/hooks/useOnboardingData";

const StepSix = () => {
  const { nextStep, updateFormData } = useOnboarding();
  const { fetchData, isLoading, error } = useOnboardingData("step-six");
  const [formData, setFormData] = useState({
    linkedin: "",
    portfolio: "",
    github: "",
    dribbble: "",
    behance: "",
    otherLinks: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    updateFormData({ socialLinks: updatedData });
  };

  const validateLinks = () => {
    // At least one link should be provided
    return (
      formData.linkedin.trim() || 
      formData.portfolio.trim() || 
      formData.github.trim() ||
      formData.dribbble.trim() ||
      formData.behance.trim() ||
      formData.otherLinks.trim()
    );
  };

  const handleSave = async () => {
    if (!validateLinks()) {
      setToastConfig({
        type: "error",
        title: "Validation Error",
        message: "Please provide at least one social link",
      });
      setShowToast(true);
      return;
    }

    try {
      await fetchData({
        method: "POST",
        body: { socialLinks: formData }
      });

      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your links have been saved successfully.",
      });
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        nextStep();
      }, 2000);
    } catch (err) {
      setToastConfig({
        type: "error",
        title: "Error",
        message: error || "Failed to save your links",
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
        Showcase Your Work
      </h2>
      <p className="text-gray-500 text-center mb-4">
        Have a portfolio, website, or professional profiles? Share the links so
        recruiters can explore your work!
      </p>

      <div className="w-full space-y-4">
        <div className="relative w-full">
          <Input
            label="LinkedIn Profile"
            placeholder="https://linkedin.com/in/yourname"
            className="w-full"
            value={formData.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
          <LinkIcon
            className="absolute right-4 top-[2.4rem] text-gray-500"
            size={18}
          />
        </div>

        <div className="relative w-full">
          <Input
            label="Portfolio Website"
            placeholder="https://yourportfolio.com"
            className="w-full"
            value={formData.portfolio}
            onChange={(e) => handleChange("portfolio", e.target.value)}
          />
          <LinkIcon
            className="absolute right-4 top-[2.4rem] text-gray-500"
            size={18}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input
              label="GitHub Profile"
              placeholder="https://github.com/username"
              value={formData.github}
              onChange={(e) => handleChange("github", e.target.value)}
            />
            <LinkIcon
              className="absolute right-4 top-[2.4rem] text-gray-500"
              size={18}
            />
          </div>

          <div className="relative">
            <Input
              label="Dribbble Profile"
              placeholder="https://dribbble.com/username"
              value={formData.dribbble}
              onChange={(e) => handleChange("dribbble", e.target.value)}
            />
            <LinkIcon
              className="absolute right-4 top-[2.4rem] text-gray-500"
              size={18}
            />
          </div>
        </div>

        <div className="relative w-full">
          <Input
            label="Behance Profile"
            placeholder="https://behance.net/username"
            value={formData.behance}
            onChange={(e) => handleChange("behance", e.target.value)}
          />
          <LinkIcon
            className="absolute right-4 top-[2.4rem] text-gray-500"
            size={18}
          />
        </div>

        <div className="relative w-full">
          <Input
            label="Other Links"
            placeholder="Any other relevant links (personal website, blog, etc.)"
            value={formData.otherLinks}
            onChange={(e) => handleChange("otherLinks", e.target.value)}
          />
          <LinkIcon
            className="absolute right-4 top-[2.4rem] text-gray-500"
            size={18}
          />
        </div>
      </div>

      <div className="w-full flex justify-end mt-6">
        <Button
          className={`!font-[400] !text-[16px] flex items-center justify-center gap-3 transition-all duration-300 ${
            isLoading ? "!shadow-none" : "subtle-shadow"
          }`}
          onClick={handleSave}
          disabled={isLoading || !validateLinks()}
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

export default StepSix;