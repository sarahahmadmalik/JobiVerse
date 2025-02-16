"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "../ui/Button";

const MobileNav = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-10 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 w-3/4 max-w-[320px] h-full bg-white shadow-lg z-50 flex flex-col p-6"
      >
        {/* Logo */}
        <div className="flex justify-start mb-6">
          <Image src="/logo.png" alt="Logo" width={150} height={50} priority />
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col space-y-6 text-lg font-medium">
          {[
            { name: "Home", href: "/" },
            { name: "Job Listings", href: "/jobs" },
            { name: "About Us", href: "/about" },
            { name: "Contact Us", href: "/contact" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-4 py-2 rounded-lg transition-colors hover:bg-gray-100"
                onClick={onClose}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Sign-in & Register Buttons */}
        <div className="flex flex-col sm:hidden space-y-4 mt-auto">
          <Link
            href="/login"
            className="text-center px-4 py-2 rounded-[12px] text-colors-primary border border-colors-primary text-primary transition-all duration-500 ease-in-out hover:bg-[#705af2] hover:shadow-[0px_7px_29px_0px_rgba(93,24,220,0.6)] hover:text-white"
            onClick={onClose}
          >
            Sign in
          </Link>

          <Button className="px-[24px] py-[12px] text-[16px] font-medium rounded-[12px] bg-colors-primary hover:bg-backgroundImage-gradient-primary transition-all duration-300">
            Register
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default MobileNav;
