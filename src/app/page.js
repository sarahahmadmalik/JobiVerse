"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Features from "@/components/Home/Feature/Features";
import HeroSection from "@/components/Home/Hero/Hero";
import StepByStep from "@/components/Home/Steps/StepByStep";
import Navbar from "@/components/layout/Header";
import MaxWidth from "@/components/layout/MaxWidth";
import Footer from "@/components/layout/Footer";
import CareerCTA from "@/components/Home/CallToAction/CallToAction";
import Testimonials from "@/components/Home/Testimonials/Testimonials";

// Define animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

// SectionWrapper component
const SectionWrapper = ({ children, id, variants }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      id={id}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <>
      <Navbar />
     
        <HeroSection />
         <MaxWidth className="!px-0">
        <SectionWrapper id="features" variants={fadeInUp}>
          <Features />
        </SectionWrapper>
        <SectionWrapper id="steps" variants={fadeInLeft}>
          <StepByStep />
        </SectionWrapper>
        </MaxWidth>
        <SectionWrapper id="career-cta" variants={fadeInUp}>
          <CareerCTA />
      </SectionWrapper>
      <MaxWidth className="!px-0">
        <SectionWrapper id="testimonials" variants={fadeInUp}>
          <Testimonials />
        </SectionWrapper>
        </MaxWidth>
       
   
      <Footer />
    </>
  );
}
