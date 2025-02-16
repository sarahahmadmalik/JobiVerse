import Features from "@/components/Home/Feature/Features";
import HeroSection from "@/components/Home/Hero/Hero";
import StepByStep from "@/components/Home/Steps/StepByStep";
import Navbar from "@/components/layout/Header";
import MaxWidth from "@/components/layout/MaxWidth";
import Footer from "@/components/layout/Footer";
import CareerCTA from "@/components/Home/CallToAction/CallToAction";

export default function Home() {
  return (
    <>
      <Navbar />
      <MaxWidth className="!px-0">
        <HeroSection />
        <Features />
        <StepByStep />
        <CareerCTA />
        <Footer />
      </MaxWidth>
    </>
  );
}
