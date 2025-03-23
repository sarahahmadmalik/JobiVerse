"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // Import Lucide icons
import Sidebar from "@/components/dashboard/shared/Sidebar";
// import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //const { data: session } = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex bg-[#EBEBEB] min-h-screen">
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="fixed top-5 right-4 z-50 md:hidden">
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

      {/* Mobile Sidebar - Fixed width (same as original sidebar) */}
      <motion.div
        className="fixed inset-y-0 z-40 md:hidden overflow-hidden w-64" // Set fixed width (w-64)
        initial={{ x: "-100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="h-full bg-[#EBEBEB] overflow-y-auto pb-20">
          <Sidebar />
        </div>
      </motion.div>

      {/* Desktop Sidebar - Only visible on md and up */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 rounded-tr rounded-[24px] rounded-br bg-white my-3 flex flex-col ${
          isMobileMenuOpen ? "md:ml-0" : ""
        }`}
      >
        {/* Header */}
        <header className="border-b border-gray-200 px-6 py-4 flex items-center">
          <h1 className="text-lg font-[500] text-colors-primary">
            Welcome back {"User"}!
          </h1>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
