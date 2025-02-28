"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";

function LeftSection({
  title,
  description,
  buttonText,
  buttonLink = "/login", // Default to "/login"
  linkText,
  linkHref = "/login", // Default to "/login"
}) {
  console.log({
    title,
    description,
    buttonText,
    buttonLink,
    linkText,
    linkHref,
  });

  return (
    <div className="hidden md:flex w-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(176,163,255,0.4)_0%,rgba(94,73,217,0.4)_58.17%,rgba(58,31,218,0.4)_100%)] justify-center relative items-center text-white p-10">
      <Image
        src="/assets/login-union-2.svg"
        alt="Gradient Top Left"
        width={300}
        height={300}
        className="absolute top-0 left-0 w-80 opacity-50"
      />
      <Image
        src="/assets/login-union-1.svg"
        alt="Gradient Bottom Right"
        width={400}
        height={400}
        className="absolute bottom-0 right-0 w-96 opacity-50"
      />
      <div className="text-center z-40">
        <Image
          src="/logo-wh.svg"
          width={280}
          height={280}
          alt="Jobiverse Logo"
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl text-center max-w-[450px] mx-auto text-colors-textPrimary font-bold">
          {title}
        </h1>
        <p className="text-lg font-[300] text-center max-w-[500px] mt-6 text-[#161819AB]">
          {description}
        </p>
        <div className="flex flex-col items-center">
          <Link href={buttonLink}>
            <Button className="mt-6 bg-transparent border-2 border-colors-primary hover:!text-white !text-colors-primary w-[250px]">
              {buttonText}
            </Button>
          </Link>

          <Link
            href={linkHref} // Ensuring linkHref is always a string
            className="text-sm font-[300] mt-2 opacity-70 text-[#161819AB]"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
