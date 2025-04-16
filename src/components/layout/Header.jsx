"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 left-0 w-full px-4 md:px-8 py-6 z-50 transition-all duration-300 ${
        scrolling ? "backdrop-blur-lg bg-white/30 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center ">
          {/* Small screen logo */}
          <Image
            src="/logo-small.png"
            alt="Jobiverse Small Logo"
            width={80}
            height={100}
            priority
            className="block xs:hidden "
          />
          {/* Default logo for larger screens */}
          <Image
            src="/logo.png"
            alt="Jobiverse Logo"
            width={180}
            height={180}
            priority
            className="hidden xs:block "
          />
        </Link>

        {/* Center: Navigation Links */}
        <ul className="hidden lg:flex gap-6 xl:gap-8 text-[16px] font-[400] text-colors-textPrimary">
          {[
            { name: "Home", href: "/" },
            { name: "Job Listings", href: "/job-listings" },
            { name: "About Us", href: "/about" },
            { name: "Contact Us", href: "/contact" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative group rounded-lg transition-all duration-300 ease-in-out ${
                  pathname === item.href
                    ? "text-colors-primary"
                    : "text-colors-textPrimary hover:text-colors-primary"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-[5px] left-0 h-[2px] rounded-md bg-colors-primary duration-300 ease-in-out ${
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Buttons & Mobile Menu Button */}
        <div className=" flex font-[600] items-center sm:space-x-4">
          <Link
            href="/login"
            className="md:text-white hidden sm:flex text-colors-primary text-[16px]"
          >
            Sign in
          </Link>
          <Link href="/register">
            <Button className="px-[24px] hidden sm:flex py-[12px] text-[16px] font-medium rounded-[12px] bg-colors-primary hover:bg-backgroundImage-gradient-primary transition-all duration-300">
              Register
            </Button>
          </Link>

          <motion.button
            className="lg:hidden text-colors-primary md:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.button>
        </div>

        {/* Mobile Sidebar */}
        <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </nav>
  );
};

export default Navbar;
