"use client";

import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";
import { CheckCircle, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/toast";
import Spinner from "@/components/ui/spinner";
import { useOnboardingData } from "@/hooks/useOnboardingData";

const StepFour = () => {
  const { goToStep } = useOnboarding();
  const { fetchData, isLoading, error } = useOnboardingData("step-four", "recruiter");
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });
  const router = useRouter();

  const sections = [
    { id: 2, title: "Company Information" },
    { id: 3, title: "Branding" },
  ];

  const handleEdit = (section) => {
    goToStep(section.id);
  };

  const handleCompleteOnboarding = async () => {
    try {
      // Call the complete onboarding API
      const response = await fetchData({
        method: "PUT"
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setToastConfig({
        type: "success",
        title: "Congratulations!",
        message: "Your company profile is complete and ready to use.",
      });
      setShowToast(true);

      setTimeout(() => {
        router.push("/recruiter/home");
      }, 2000);
    } catch (err) {
      setToastConfig({
        type: "error",
        title: "Error",
        message: error || "Failed to complete onboarding",
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

      <h2 className="text-2xl font-bold text-gray-900 text-center">
        You're All Set Up
      </h2>

      <p className="text-gray-500 text-center mb-4">
        Make sure everything looks perfect! You can edit any details before
        going live.
      </p>

      <div className="mt-6 w-full space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex items-center text-gray-800 justify-between p-4 border border-[#00000066] rounded-[12px] shadow-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span>{section.title}</span>
            </div>
            <button onClick={() => handleEdit(section)}>
              <Pencil className="text-gray-500 hover:text-gray-700" size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center sm:justify-end mt-5 mb-5 sm:mt-3 sm:mb-0 w-full px-4">
        <Button
          className={`!font-[400] !text-[16px] flex items-center justify-center gap-3 transition-all duration-300 ${
            isLoading ? "!shadow-none" : "subtle-shadow"
          }`}
          onClick={handleCompleteOnboarding}
          disabled={isLoading}
        >
          Save & Complete
          {isLoading && <Spinner />}
        </Button>
      </div>
    </div>
  );
};

export default StepFour;