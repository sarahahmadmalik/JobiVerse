import { ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";
import StatsSection from "@/components/Home/Hero/Stats";

const heroContent = {
  title: "Accelerate Your",
  highlightedText: "Career",
  description: `Discover your <span class="font-semibold text-colors-textPrimary">Dream Job</span>, 
    create a standout resume, and track applications – all in one spot! Your ultimate hub for everything job-related!`,
  buttonText: "Get Started",
};

const HeroLeft = () => {
  return (
    <div className="text-center !py-[2rem] md:py-12 md:px-9 px-4 md:text-left z-40">
      {/* Heading */}
      <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
        {heroContent.title}{" "}
        <span className="text-colors-primary my-2 md:block">
          {heroContent.highlightedText}
        </span>
      </h1>

      {/* Description */}
      <div className="xl:pr-0 md:pr-10 pt-2 text-center md:text-left pr-0">
        <p
          className="mt-4 text-lg lg:text-xl 3xl:text-[24px] !leading-[35px] text-colors-textSecondary"
          dangerouslySetInnerHTML={{ __html: heroContent.description }}
        />
      </div>

      {/* Button */}
      <Button className="px-[24px] mx-auto md:mx-0 mt-10 sm:mt-6 py-[12px] !text-[16px] !font-[400] bg-colors-primary hover:bg-backgroundImage-gradient-primary transition-all duration-300 flex items-center gap-2 group">
        {heroContent.buttonText}
        <ChevronRight
          size={20}
          className="transition-transform duration-300 ease-in-out group-hover:translate-x-1"
        />
      </Button>

      {/* Stats Section */}

      <StatsSection />
    </div>
  );
};

export default HeroLeft;
