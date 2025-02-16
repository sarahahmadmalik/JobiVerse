import Image from "next/image";
import Button from "../ui/Button";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#161819] overflow-hidden  min-h-[400px] text-white py-5 relative">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 h-[300px] flex justify-center items-center pointer-events-none">
        {/* First SVG (Top Left) */}
        <Image
          src="/assets/footer-icon-1.svg"
          alt="Background Decoration"
          width={200}
          height={200}
          className="absolute top-[-10px]  h-[200px] w-[200px] md:h-[500px] md:w-[320px] left-[-70px] md:top-[-50px] md:-left-5"
        />

        {/* Second SVG (Bottom Right) */}
        <Image
          src="/assets/footer-icon-2.svg"
          alt="Background Decoration"
          width={200}
          height={200}
          className="absolute  bottom-[100px] right-[-50px]  h-[200px] w-[200px] md:h-[500px] md:w-[320px] md:bottom-[-150px] md:right-0"
        />
      </div>

      {/* Footer Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 ">
        {/* Logo */}
        <Image
          src="/logo-white.svg"
          alt="Jobiverse Logo"
          width={280}
          height={280}
        />

        {/* Newsletter Section */}
        <h2 className="text-lg sm:text-2xl font-semibold text-colors-primary mt-8">
          Subscribe Our Newsletter
        </h2>
        <p className="text-colors-secondary font-[300] max-w-md mt-2">
          Sign up for our newsletter to get job search tips, industry insights,
          and the latest from Jobiverse.
        </p>

        {/* Email Subscription Input */}
        <div className="flex items-center gap-2 mt-4 bg-gray-900 border border-gray-700 rounded-[12px] px-4 py-2 w-full max-w-md relative">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 pl-6 text-[14px]  bg-transparent font-[300] outline-none text-white placeholder-gray-400"
          />

          <Image
            src="/assets/user-icon.svg"
            alt="User Icon"
            width={20}
            height={20}
            className="w-5 h-5 absolute top-13"
          />
          <Button className=" text-white font-[400] text-sm transition">
            Subscribe
          </Button>
        </div>

        {/* Links */}
        <div className="flex flex-wrap font-[400] justify-center gap-6 text-white text-[16px] my-[2.5rem] mb-6">
          <Link href="#">Help Center</Link>
          <Link href="#">About Us</Link>
          <Link href="#">Blog</Link>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Cookies</Link>
        </div>

        {/* Copyright */}
        <p className="text-[#FFFFFF80] font-[300] text-[14px] -mb-2 ">
          © 2024 JobiVerse. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
