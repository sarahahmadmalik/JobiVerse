"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Toast from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";
import Spinner from "@/components/ui/spinner";
import { Link } from "lucide-react";

const StepSix = () => {
  const { nextStep } = useOnboarding();
  const [formData, setFormData] = useState({
    linkedin: "",
    portfolio: "",
    otherLinks: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
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
        Showcase Your Work
      </h2>
      <p className="text-gray-500 text-center mb-4">
        Have a portfolio, website, or LinkedIn profile? Share the link so
        recruiters can explore your work!
      </p>

      <div className="relative w-full">
        <Input
          label="LinkedIn Profile"
          placeholder="Paste your LinkedIn URL"
          className="w-full"
          value={formData.linkedin}
          onChange={(e) => handleChange("linkedin", e.target.value)}
        />
        <Link
          className="absolute right-4  top-[2.4rem] text-gray-500"
          size={18}
        />
      </div>

      <div className="relative w-full">
        <Input
          label="Portfolio Website"
          className="w-full"
          placeholder="Paste your portfolio URL"
          value={formData.portfolio}
          onChange={(e) => handleChange("portfolio", e.target.value)}
        />
        <Link
          className="absolute right-4  top-[2.4rem] text-gray-500"
          size={18}
        />
      </div>

      <div className="relative w-full">
        <Input
          label="GitHub/Dribbble/Other Links"
          className="w-full"
          placeholder="Add more links to showcase your work"
          value={formData.otherLinks}
          onChange={(e) => handleChange("otherLinks", e.target.value)}
        />
        <Link
          className="absolute right-4 top-[2.4rem] text-gray-500"
          size={18}
        />
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

export default StepSix;
