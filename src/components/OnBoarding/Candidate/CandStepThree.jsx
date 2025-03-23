"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Toast from "@/components/ui/toast";
import Spinner from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext/OnboardingContext";
import InputAuto from "@/components/ui/input-auto";
import { X } from "lucide-react";
import { SKILLS } from "@/constants/constants";

const CandStepThree = () => {
  const { nextStep } = useOnboarding();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  // Add a skill from the input field
  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Remove a skill from the selected list
  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your skills have been saved successfully.",
      });
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        nextStep({ selectedSkills });
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

      <h2 className="text-2xl text-colors-textPrimary font-[700] mt-4 text-center">
        Show Off Your Skills!
      </h2>
      <p className="text-[#161819AB] font-[300] text-center mb-6">
        Let recruiters know what you’re best at. Add your top skills to stand
        out!
      </p>

      {/* Autocomplete Input for Skill Selection */}
      <div className="w-full px-4">
        <InputAuto
          label="Skills"
          placeholder="Type a skill, e.g., Project Management"
          suggestions={SKILLS}
          onSelect={addSkill}
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
            loading ? "!shadow-none" : "subtle-shadow"
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          Save & Continue
          {loading && (
            <Spinner className="transition-opacity duration-300 opacity-100" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default CandStepThree;
