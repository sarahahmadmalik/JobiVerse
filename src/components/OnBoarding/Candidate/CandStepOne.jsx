import Button from "@/components/ui/Button";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnBoardingContext";

const CandStepOne = () => {
  const { nextStep } = useOnboarding();

  return (
    <div
      className="flex gap-8 min-w-[370px] lg:w-[750px] lg:max-w-[750px] h-[450px] max-h-[660px] flex-col items-center justify-center bg-white p-6 rounded-[24px] shadow-[0px_8px_18px_0px_rgba(19,17,28,0.12)]
"
    >
      <h2 className="text-3xl text-center text-colors-textPrimary font-bold">
        Welcome to <span className="text-colors-primary">JobiVerse!</span>
      </h2>
      <p className="text-[#161819AB] font-[300] text-lg text-center lg:px-[5rem]">
        We’re excited to help you find your next career opportunity. Let’s get
        started on building your professional journey with JobiVerse!
      </p>
      <Button
        className="!font-[400] !text-[16px] "
        onClick={() => nextStep({})}
      >
        Begin Setup
      </Button>
    </div>
  );
};

export default CandStepOne;
