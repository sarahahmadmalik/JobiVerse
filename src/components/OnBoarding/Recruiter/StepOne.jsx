import Button from "@/components/ui/button";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";

const StepOne = () => {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex gap-7 w-full max-w-[637px] min-h-[450px] flex-col items-center justify-center bg-white px-4 py-6 sm:px-6 md:px-8 lg:px-10 rounded-[24px] shadow-[0px_8px_18px_0px_rgba(19,17,28,0.12)]">
      <h2 className="text-3xl text-center text-colors-textPrimary font-bold">
        Welcome to <span className="text-colors-primary">JobiVerse!</span>
      </h2>
      <p className="text-[#161819AB] font-[300] text-lg text-center lg:px-[3.2rem]">
        We're excited to help you find top talent. Let’s get your company
        profile set up for success!
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

export default StepOne;
