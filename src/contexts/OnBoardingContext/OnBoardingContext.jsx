import { createContext, useContext, useState } from "react";

const OnboardingContext = createContext(null);

export const OnboardingProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  return (
    <OnboardingContext.Provider value={{ step, setStep, formData, nextStep }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
