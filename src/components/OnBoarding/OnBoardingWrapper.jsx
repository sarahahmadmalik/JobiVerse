import { useOnboarding } from "@/contexts/OnBoardingContext/OnBoardingContext";
import StepOne from "@/components/OnBoarding/Recruiter/StepOne";
import StepTwo from "@/components/OnBoarding/Recruiter/StepTwo";
import CandStepOne from "@/components/OnBoarding/Candidate/CandStepOne";
import StepThree from "@/components/OnBoarding/Recruiter/StepThree";

const OnboardingWrapper = ({ role }) => {
  const { step } = useOnboarding();

  const recruiterSteps = [<StepOne />, <StepTwo />, <StepThree />];
  const candidateSteps = [<CandStepOne />];

  return role === "recruiter"
    ? recruiterSteps[step - 1]
    : candidateSteps[step - 1];
};

export default OnboardingWrapper;
