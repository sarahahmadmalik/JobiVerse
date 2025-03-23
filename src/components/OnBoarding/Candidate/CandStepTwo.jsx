"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Dropdown from "@/components/ui/dropdown";
import Spinner from "@/components/ui/spinner";
import Toast from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext/OnboardingContext";

const CandStepTwo = () => {
  const { nextStep } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your details have been saved successfully.",
      });
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        nextStep({});
      }, 2000);
    }, 2000);
  };

  return (
    <div className="flex gap-3 w-full  max-w-[637px] min-h-[450px] flex-col items-center justify-center bg-white px-4 py-6 sm:px-6 md:px-8 lg:px-10 rounded-[24px] shadow-[0px_8px_18px_0px_rgba(19,17,28,0.12)]">
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
        Tell us a bit about yourself
      </h2>
      <p className="text-[#161819AB] font-[300] text-center mb-6">
        This information helps recruiters know more about you.
      </p>

      <div className="space-y-4 w-full px-4 md:px-4">
        <div>
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Phone (optional)
          </label>
          <Input type="text" placeholder="e.g., +1 (555) 123-4567" />
        </div>
        <div>
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Desired Job Title
          </label>
          <Input type="text" placeholder="e.g., Software Engineer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Dropdown
              label="Availability Status"
              options={[
                { value: "immediately", label: "Immediately Available" },
                { value: "two_weeks", label: "Available in 2 Weeks" },
                { value: "one_month", label: "Available in 1 Month" },
              ]}
            />
          </div>
          <div>
            <Dropdown
              label="Location"
              options={[
                { value: "remote", label: "Remote" },
                { value: "onsite", label: "On-site" },
                { value: "hybrid", label: "Hybrid" },
              ]}
            />
          </div>
        </div>
      </div>

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

export default CandStepTwo;
