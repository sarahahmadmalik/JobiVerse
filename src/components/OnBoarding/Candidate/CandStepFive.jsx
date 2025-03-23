"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Toast from "@/components/ui/toast";
import { X, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext/OnboardingContext";
import Spinner from "@/components/ui/spinner";

const CandStepFive = () => {
  const { nextStep } = useOnboarding();
  const [education, setEducation] = useState([
    {
      degree: "",
      fieldOfStudy: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const addEducation = () => {
    setEducation([
      ...education,
      { degree: "", fieldOfStudy: "", institution: "", location: "", startDate: "", endDate: "" },
    ]);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  const handleSave = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your educational background has been saved successfully.",
      });
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        nextStep({ education });
      }, 2000);
    }, 2000);
  };

  return (
    <div className="flex gap-3 w-full max-w-[637px] min-h-[450px] flex-col items-center justify-center bg-white px-4 py-6 sm:px-6 md:px-8 lg:px-10 rounded-[24px] shadow-[0px_8px_18px_0px_rgba(19,17,28,0.12)]">
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-[30px]">
            <Toast type={toastConfig.type} title={toastConfig.title} message={toastConfig.message} onClose={() => setShowToast(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold text-gray-800 text-center">Where Did You Learn It All?</h2>
      <p className="text-gray-500 text-center mb-4">Share your educational background. Every degree, certification, and course counts!</p>

      {education.map((edu, index) => (
        <div key={index} className="w-full bg-gray-50 p-4 rounded-lg mb-4 relative">
          {index > 0 && (
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => removeEducation(index)}>
              <X size={20} />
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Degree" placeholder="Select" value={edu.degree} onChange={(e) => handleInputChange(index, "degree", e.target.value)} />
            <Input label="Field of Study" placeholder="e.g., Computer Science" value={edu.fieldOfStudy} onChange={(e) => handleInputChange(index, "fieldOfStudy", e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <Input label="Institution Name" placeholder="e.g., University of California" value={edu.institution} onChange={(e) => handleInputChange(index, "institution", e.target.value)} />
            <Input label="Location" placeholder="Select or Enter" value={edu.location} onChange={(e) => handleInputChange(index, "location", e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <Input label="Start Date" placeholder="MM/YYYY" type="month" value={edu.startDate} onChange={(e) => handleInputChange(index, "startDate", e.target.value)} />
            <Input label="End Date (Optional)" placeholder="MM/YYYY" type="month" value={edu.endDate} onChange={(e) => handleInputChange(index, "endDate", e.target.value)} />
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row w-full gap-2 justify-end items-center mt-3">
        <button className="flex items-center px-6 py-2 gap-2 text-colors-primary border border-colors-primary rounded-[12px] !font-[400] !text-[16px]" onClick={addEducation} disabled={isLoading}>
          Add Education
          <PlusCircle size={20} className="mr-2" />
        </button>

        <Button className={`!font-[400] !text-[16px] flex items-center justify-center gap-3 transition-all duration-300 ${isLoading ? "!shadow-none" : "subtle-shadow"}`} onClick={handleSave} disabled={isLoading}>
          Save & Continue
          {isLoading && <Spinner className="transition-opacity duration-300 opacity-100" />}
        </Button>
      </div>
    </div>
  );
};

export default CandStepFive;