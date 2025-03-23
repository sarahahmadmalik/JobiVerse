import { motion } from "framer-motion"; // Import motion from Framer Motion
import Image from "next/image";

// Animation variants for HeroRight
const heroRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const HeroRight = () => {
  return (
    <motion.div
      className="relative flex justify-center items-center"
      initial="hidden"
      whileInView="visible"
      variants={heroRightVariants}
      viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of the component is visible
    >
      {/* Background Gradients */}
      <div className="absolute hidden md:block md:-top-[100px] md:w-[420px] lg:w-auto lg:-top-30 min-h-[900px] right-0 z-30">
        <div className="relative hidden md:block ">
          <Image
            src="/assets/hero-rect.svg"
            alt="Background"
            width={700}
            height={800}
            objectFit="cover"
          />
        </div>
      </div>
      <div className="absolute -top-0 w-full md:w-auto right-[280px] md:-top-11 md:right-[18rem] lg:right-[25rem] z-10">
        <div className="relative w-[450px] h-[450px]">
          <Image
            src="/assets/hero-rect-2.svg"
            alt="Background"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>

      {/* Image Container with Fixed Position */}
      <div className="relative w-full h-full hidden md:flex justify-end items-start z-40">
        <div className="absolute md:-right-[120px] md:top-[220px] lg:-right-[180px] lg:top-[250px] xl:-right-[220px]  xl:top-[300px] transform -translate-x-1/2 -translate-y-1/2 rhombus-shape h-[200px] w-[200px] md:w-[380px] md:h-[380px] lg:w-[480px] lg:h-[480px] xl:w-[580px] xl:h-[580px]">
          <Image
            src="/assets/hero-img.svg"
            alt="Job seeker"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HeroRight;