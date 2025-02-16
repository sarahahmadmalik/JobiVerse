import Image from "next/image";
import Button from "@/components/ui/Button";

const CareerCTA = () => {
  return (
    <section
      className="relative w-full mb-[3rem] py-12 flex flex-col items-center justify-center h-[290px] overflow-hidden text-center"
      style={{
        background:
          "radial-gradient(50% 50% at 50% 50%, rgba(176, 163, 255, 0.4) 0%, rgba(94, 73, 217, 0.4) 58.17%, rgba(58, 31, 218, 0.4) 100%)",
      }}
    >
      {/* Background Gradient Icons */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        {/* Top Left Icon */}
        <Image
          src="/assets/footer-icon-1.svg"
          alt="Background Decoration"
          width={320}
          height={320}
          className="absolute top-[-50px] left-[-50px] md:top-[-50px] md:-left-5 opacity-40"
        />

        {/* Bottom Right Icon */}
        <Image
          src="/assets/footer-icon-2.svg"
          alt="Background Decoration"
          width={320}
          height={320}
          className="absolute bottom-[-50px] right-[-50px] md:bottom-[-93px] md:right-0 opacity-40"
        />
      </div>

      {/* Content */}
      <h2 className="text-2xl lg:text-3xl font-bold text-colors-textPrimary z-10">
        Ready to start your career journey?
      </h2>
      <Button className="mt-8 text-sm font-[400] ">Join Now</Button>
    </section>
  );
};

export default CareerCTA;
