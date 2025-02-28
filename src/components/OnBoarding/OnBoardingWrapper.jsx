import { useOnboarding } from "@/contexts/OnboardingContext/OnboardingContext";
import StepOne from "@/components/OnBoarding/Recruiter/StepOne";
import StepTwo from "@/components/OnBoarding/Recruiter/StepTwo";
import CandStepOne from "@/components/OnBoarding/Candidate/CandStepOne";
import StepThree from "@/components/OnBoarding/Recruiter/StepThree";
import StepFour from "@/components/OnBoarding/Recruiter/StepFour";

const OnboardingWrapper = ({ role }) => {
  const { step } = useOnboarding();

  const recruiterSteps = [
    <StepOne />,
    <StepTwo />,
    <StepThree />,
    <StepFour />,
  ];
  const candidateSteps = [<CandStepOne />];

  console.log(step);

  return (
    <>
      {role === "recruiter"
        ? recruiterSteps[step - 1]
        : candidateSteps[step - 1]}
    </>
  );
};

export default OnboardingWrapper;
