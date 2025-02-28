"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnBoardingContext";

const StepTwo = () => {
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

      // Simulate success response
      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your company details have been saved successfully.",
      });
      setShowToast(true);

      // If you have an API call, handle errors like this:
      // setToastConfig({
      //   type: "error",
      //   title: "Error",
      //   message: "Something went wrong. Please try again.",
      // });
      // setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        nextStep({});
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
        Tell us about your company
      </h2>
      <p className="text-[#161819AB] font-[300] text-center mb-6">
        This information helps job seekers know more about your organization.
      </p>

      <div className="space-y-4 w-full px-4 md:px-4">
        <div>
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Company Name
          </label>
          <Input type="text" placeholder="e.g., JobiVerse Inc." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Dropdown
              label="Industry"
              options={[
                { value: "tech", label: "Technology" },
                { value: "finance", label: "Finance" },
                { value: "healthcare", label: "Healthcare" },
              ]}
            />
          </div>
          <div>
            <div>
              <Dropdown
                label="Company Size"
                options={[
                  { value: "small", label: "1-50 employees" },
                  { value: "medium", label: "51-500 employees" },
                  { value: "large", label: "200+ employees" },
                ]}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Location
          </label>
          <Input type="text" placeholder="e.g., New York, NY, USA" />
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
            <Spinner className=" transition-opacity duration-300 opacity-100" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepTwo;
