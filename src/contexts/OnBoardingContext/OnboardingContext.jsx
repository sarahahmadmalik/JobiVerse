import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext(null);

export const OnboardingProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  return (
    <OnboardingContext.Provider
      value={{ step, setStep, formData, nextStep, prevStep, goToStep }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
