import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";
import StepOne from "@/components/OnBoarding/Recruiter/StepOne";
import StepTwo from "@/components/OnBoarding/Recruiter/StepTwo";
import CandStepOne from "@/components/OnBoarding/Candidate/CandStepOne";
import StepThree from "@/components/OnBoarding/Recruiter/StepThree";
import StepFour from "@/components/OnBoarding/Recruiter/StepFour";
import CandStepTwo from "./Candidate/CandStepTwo";
import CandStepThree from "./Candidate/CandStepThree";
import CandStepFour from "./Candidate/CandStepFour";
import CandStepFive from "./Candidate/CandStepFive";
import CandStepSix from "./Candidate/CandStepSix";
import CandStepSeven from "./Candidate/CandStepSeven";
import CandStepEight from "./Candidate/CandStepEight";

const OnboardingWrapper = ({ role }) => {
  const { step } = useOnboarding();

  const recruiterSteps = [
    <StepOne />,
    <StepTwo />,
    <StepThree />,
    <StepFour />,
  ];
  const candidateSteps = [
    <CandStepOne />,
    <CandStepTwo />,
    <CandStepThree />,
    <CandStepFour />,
    <CandStepFive />,
    <CandStepSix />,
    <CandStepSeven />,
    <CandStepEight />,
  ];

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
