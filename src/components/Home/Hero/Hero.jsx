import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import MaxWidth from "@/components/layout/MaxWidth";

const HeroSection = () => {
  return (
    <section className="relative w-full bg-white">
      <div className="flex overflow-hidden md:overflow-visible flex-row w-full justify-center items-start">
        <HeroLeft />
        <HeroRight />
      </div>
    </section>
  );
};

export default HeroSection;
