"use client";
import { OnboardingProvider } from "@/contexts/OnBoardingContext/OnboardingContext";
import OnboardingWrapper from "@/components/OnBoarding/OnboardingWrapper";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";

const Onboarding = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">
      <Loader/>
    </div>;
  }

  return (
    <OnboardingProvider>
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(176,163,255,0.4)_0%,rgba(94,73,217,0.4)_58.17%,rgba(58,31,218,0.4)_100%)]">
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
        </div>
        
        <div className="relative z-20 min-h-screen w-full flex justify-center items-center p-10">
          <OnboardingWrapper role={session?.user?.role || "candidate"} />
        </div>
      </div>
    </OnboardingProvider>
  );
};

export default Onboarding;