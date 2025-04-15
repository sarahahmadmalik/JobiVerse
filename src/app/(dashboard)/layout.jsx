"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/dashboard/shared/Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getPageTitle = () => {

    if (pathname.includes("/recruiter/job-listings")) {
      return "Job Listings";
    }
    if (pathname.includes("/recruiter/chats")) {
      return "Chats";
    }
    if (pathname.includes("/recruiter/schedule")) {
      return "Schedule";
    }
    if (pathname.includes("/recruiter/settings")) {
      return "Settings";
    }
    if (pathname.includes("/recruiter/profile")) {
      return "Profile";
    }
    
    if (pathname === "/home" || pathname === "/recruiter/home") {
      return "Welcome back, User!";
    }
  
    const segments = pathname
      .split("/")
      .filter((segment) => segment.trim() !== "");
  
    // Get the first segment only
    const targetSegment = segments[0];
  
    return targetSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex bg-[#EBEBEB] min-h-screen">
      <div className="absolute top-5 right-4 z-50 md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="flex justify-center items-center w-10 h-10 bg-colors-primary rounded-[8px] p-2"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <motion.div
        className="fixed inset-y-0 z-40 md:hidden overflow-hidden w-64"
        initial={{ x: "-100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="h-full bg-[#EBEBEB] overflow-y-auto pb-20">
          <Sidebar />
        </div>
      </motion.div>

      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div
        className={`flex-1 rounded-tr rounded-[24px] rounded-br bg-white my-3 flex flex-col ${
          isMobileMenuOpen ? "md:ml-0" : ""
        }`}
      >
        <header className="border-b border-gray-200 px-6 py-4 flex items-center">
          <h1 className="text-lg font-[500] text-colors-primary">
            {getPageTitle()}
          </h1>
        </header>

        <main className="md:p-6 py-6 px-4">{children}</main>
      </div>
    </div>
  );
}