import Image from "next/image";

const HeroRight = () => {
  return (
    <div className="relative flex justify-center items-center">
      {/* Background Gradients */}
      <div className="absolute hidden md:block md:-top-[100px] md:w-[420px] lg:w-auto lg:-top-30 min-h-[900px] right-0 z-30">
        <div className="relative hidden md:block ">
          <Image
            src="/assets/hero-rect.svg"
            alt="Background"
            // layout="fill"
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
    </div>
  );
};

export default HeroRight;
