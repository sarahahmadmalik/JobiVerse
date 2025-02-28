import { useOnboarding } from "@/contexts/OnBoardingContext/OnBoardingContext";
import StepOne from "@/components/OnBoarding/Recruiter/StepOne";
import StepTwo from "@/components/OnBoarding/Recruiter/StepTwo";
import CandStepOne from "@/components/OnBoarding/Candidate/CandStepOne";

const OnboardingWrapper = ({ role }) => {
  const { step } = useOnboarding();
  console.log(step);

  const recruiterSteps = [<StepOne />, <StepTwo />];
  const candidateSteps = [<CandStepOne />];

  return role === "recruiter"
    ? recruiterSteps[step - 1]
    : candidateSteps[step - 1];
};

export default OnboardingWrapper;
