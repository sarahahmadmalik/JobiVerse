"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/button";
import Toast from "@/components/ui/toast";
import Spinner from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import InputAuto from "@/components/ui/input-auto";
import { X } from "lucide-react";
import { SKILLS } from "@/constants/constants";
import { useOnboardingData } from "@/hooks/useOnboardingData";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";

const CandStepThree = () => {
  const { nextStep, updateFormData } = useOnboarding();
  const { fetchData, isLoading, error } = useOnboardingData("step-three");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [inputValue, setInputValue] = useState(""); // New state for input value
  const inputRef = useRef(null); // Ref for the input element
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      updateFormData({ skills: newSkills });
      setInputValue(""); // Clear the input value
      inputRef.current?.blur(); // Blur the input to close dropdown
    }
  };

  const removeSkill = (skill) => {
    const newSkills = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(newSkills);
    updateFormData({ skills: newSkills });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() && !selectedSkills.includes(inputValue.trim())) {
      addSkill(inputValue.trim());
    }
  };

  const handleSave = async () => {
    if (selectedSkills.length === 0) {
      setToastConfig({
        type: "error",
        title: "Error",
        message: "Please add at least one skill",
      });
      setShowToast(true);
      return;
    }

    try {
      await fetchData({
        method: "POST",
        body: { skills: selectedSkills }
      });

      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your skills have been saved successfully.",
      });
      setShowToast(true);

      setTimeout(() => {
        nextStep({ skills: selectedSkills });
      }, 2000);
    } catch (err) {
      setToastConfig({
        type: "error",
        title: "Error",
        message: error || "Failed to save your skills",
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

      <h2 className="text-2xl text-colors-textPrimary font-[700] mt-4 text-center">
        Show Off Your Skills!
      </h2>
      <p className="text-[#161819AB] font-[300] text-center mb-6">
        Let recruiters know what you're best at. Add your top skills to stand
        out!
      </p>

      <div className="w-full px-4">
        <InputAuto
          ref={inputRef}
          label="Skills"
          placeholder="Type a skill, e.g., Project Management"
          suggestions={SKILLS}
          onSelect={addSkill}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Display Selected Skills as Tags */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 w-full px-4 mt-3">
          {selectedSkills.map((skill) => (
            <div
              key={skill}
              className="flex text-colors-primary items-center px-3 py-1 border border-colors-primary rounded-full text-sm font-[400]"
            >
              <span>{skill}</span>
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 text-colors-primary hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center sm:justify-end mt-5 mb-5 sm:mt-3 sm:mb-0 w-full px-4">
        <Button
          className={`!font-[400] !text-[16px] flex items-center justify-center gap-3 transition-all duration-300 ${
            isLoading ? "!shadow-none" : "subtle-shadow"
          }`}
          onClick={handleSave}
          disabled={isLoading || selectedSkills.length === 0}
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

export default CandStepThree;