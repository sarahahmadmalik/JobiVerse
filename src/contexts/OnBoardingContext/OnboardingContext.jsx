import { createContext, useContext, useState, useEffect } from "react";

const OnboardingContext = createContext(null);

// Enhanced localStorage helpers with error handling
const getStoredData = (key) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
  return null;
};

const setStoredData = (key, value) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }
};

export const OnboardingProvider = ({ children }) => {
  // Initialize state with comprehensive defaults
  const [step, setStep] = useState(() => {
    return getStoredData('onboardingStep') || 1;
  });
  
  const [formData, setFormData] = useState(() => {
    const savedData = getStoredData('onboardingFormData');
    return savedData || {
      personalInfo: {},
      skills: [],
      experience: [],
      education: [],
      socialLinks: {},
      jobPreferences: {}
    };
  });

  // Persist state changes
  useEffect(() => {
    setStoredData('onboardingStep', step);
  }, [step]);

  useEffect(() => {
    setStoredData('onboardingFormData', formData);
  }, [formData]);

  // Enhanced update function with deep merging for nested objects
  const updateFormData = (newData, mergeStrategy = 'shallow') => {
    setFormData(prev => {
      let updated;
      
      if (mergeStrategy === 'deep') {
        // Deep merge for nested objects
        updated = deepMerge(prev, newData);
      } else if (mergeStrategy === 'replace') {
        // Complete replacement
        updated = newData;
      } else {
        // Default shallow merge
        updated = { ...prev, ...newData };
      }
      
      return updated;
    });
  };

  // Helper function for deep merging objects
  const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };

  // Navigation functions with data handling
  const nextStep = (data) => {
    if (data) updateFormData(data);
    setStep(prev => Math.min(prev + 1, 8)); // Don't exceed step 8
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1)); // Don't go below step 1
  };

  const goToStep = (stepNumber, data) => {
    if (data) updateFormData(data);
    setStep(Math.max(1, Math.min(stepNumber, 8))); // Keep between 1-8
  };

  // Clear onboarding data and mark as complete
  const completeOnboarding = () => {
    localStorage.removeItem('onboardingStep');
    localStorage.removeItem('onboardingFormData');
    return {
      step: 1,
      formData: {
        personalInfo: {},
        skills: [],
        experience: [],
        education: [],
        socialLinks: {},
        jobPreferences: {}
      }
    };
  };

  // Reset specific section data
  const resetSection = (sectionKey) => {
    setFormData(prev => ({
      ...prev,
      [sectionKey]: Array.isArray(prev[sectionKey]) ? [] : {}
    }));
  };

  return (
    <OnboardingContext.Provider
      value={{ 
        step, 
        formData,
        updateFormData,
        nextStep,
        prevStep,
        goToStep,
        completeOnboarding,
        resetSection
      }}
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