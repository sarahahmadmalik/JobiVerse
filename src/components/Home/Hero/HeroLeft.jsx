import Button from "@/components/ui/Button";
import StatsSection from "@/components/Home/Hero/Stats"

const HeroLeft = () => {
  return (
    <div className="text-center py-10 px-9 md:text-left z-40">
      <h1 className="lg:text-5xl 3xl:text-[56px] font-bold text-gray-900 leading-tight">
        Accelerate Your <span className="text-colors-primary block">Career</span>
      </h1>
      <p className="mt-4 lg:text-xl 3xl:text-[24px] text-colors-textSecondary">
        Discover your <span className="font-semibold text-colors-textPrimary">Dream Job</span>, create a
        standout resume, and track applications – all in one spot! Your ultimate
        hub for everything job-related!
      </p>
      <Button className="px-[24px] mt-6 py-[12px] text-[16px] !font-[400] bg-colors-primary hover:bg-backgroundImage-gradient-primary transition-all duration-300">
        Get Started {">"}
      </Button>

      {/* Stats Section */}
      <StatsSection />
    </div>
  );
};

export default HeroLeft;
