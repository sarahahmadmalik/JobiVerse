import Image from "next/image";

const HeroRight = () => {
  return (
    <div className="relative flex justify-center items-center">
      {/* Background Gradients */}
      <div className="absolute  -top-30 min-h-[900px] right-0 z-30">
        <div className="relative ">
          <Image
            src="/assets/hero-rect.svg"
            alt="Background"
            // layout="fill"
            width={600}
            height={600}
            objectFit="cover"
          />
        </div>
      </div>
      <div className="absolute -top-11 right-[25rem] z-10">
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
      <div className="relative w-full h-full flex  justify-end items-start z-40">
        <div className="absolute -right-[220px]  top-[300px] transform -translate-x-1/2 -translate-y-1/2 rhombus-shape w-[300px] h-[300px] md:w-[580px] md:h-[580px]">
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
