import HeroSection from "@/components/Home/Hero/Hero";
import Navbar from "@/components/layout/Header";
import MaxWidth from "@/components/layout/MaxWidth";

export default function Home() {
  return (
    <>
      <Navbar />
      <MaxWidth className="!px-0">
        <HeroSection />
      </MaxWidth>
    </>
  );
}
