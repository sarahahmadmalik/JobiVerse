"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "../ui/Button";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 left-0 w-full px-8 py-6 z-50  transition-all duration-300 ${
        scrolling ? "backdrop-blur-lg bg-white/30 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Jobiverse Logo"
            width={180}
            height={180}
            priority
          />
        </Link>

        {/* Center: Navigation Links */}
        <ul className="hidden md:flex gap-10 text-[16px] font-[400] text-colors-textPrimary">
          {[
            { name: "Home", href: "/" },
            { name: "Job Listings", href: "/jobs" },
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

        {/* Right: Buttons */}
        <div className="hidden md:flex font-[600] text-white items-center space-x-4">
          <Link href="/login" className="text-primary text-[16px]">
            Sign in
          </Link>
          <Button className="px-[24px] py-[12px] text-[16px] font-medium rounded-[12px] bg-colors-primary hover:bg-backgroundImage-gradient-primary transition-all duration-300">
            Register
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
