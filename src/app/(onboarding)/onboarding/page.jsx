"use client";
import { OnboardingProvider } from "@/contexts/OnBoardingContext/OnBoardingContext";
import OnboardingWrapper from "@/components/onboarding/OnboardingWrapper";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Onboarding = () => {
  const router = useRouter();
  const role = router?.query?.role || "recruiter";

  return (
    <OnboardingProvider>
      <div className="flex relative h-screen w-full">
        {/* Background similar to register page */}
        <div className="flex w-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(176,163,255,0.4)_0%,rgba(94,73,217,0.4)_58.17%,rgba(58,31,218,0.4)_100%)] justify-center items-center text-white p-10">
          <Image
            src="/assets/login-union-2.svg"
            alt="Gradient Top Left"
            width={300}
            height={300}
            className="absolute z-0 top-0 left-0 w-80 opacity-50"
          />
          <Image
            src="/assets/login-union-1.svg"
            alt="Gradient Bottom Right"
            width={300}
            height={300}
            className="absolute z-0 bottom-0 right-0 w-96 opacity-50"
          />
          <div className="z-20">
            <OnboardingWrapper role={role} />
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
};

export default Onboarding;
