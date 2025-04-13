"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const Dropdown = ({ 
  label, 
  options, 
  onChange, 
  placeholder = "Select", 
  value,
  icon: IconComponent = null
}) => {
  const [selected, setSelected] = useState(
    options.find(option => option.value === value) || null
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option.value);
    }
  };

  useEffect(() => {
    if (value) {
      const newSelected = options.find(option => option.value === value);
      if (newSelected) {
        setSelected(newSelected);
      }
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="flex flex-col w-full relative">
      {label && (
        <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
          {label}
        </label>
      )}
      <div
        className={`w-full px-4 py-3 border border-gray-300 rounded-[12px] bg-white flex items-center justify-between cursor-pointer 
                   transition-all duration-200 ease-in-out 
                   ${
                     isOpen
                       ? "ring-1 ring-colors-primary border-colors-primary"
                       : "hover:border-gray-400"
                   }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selected ? "!text-gray-800" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        {IconComponent ? (
          <IconComponent 
            className="text-gray-400" 
            size={16}
          />
        ) : (
          <Image
            width={12}
            height={12}
            src="/assets/down.svg"
            alt="dropdown-icon"
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-[4.9rem] w-full mt-1 text-gray-800 bg-white border border-gray-300 rounded-[12px] shadow-lg z-10 max-h-60 overflow-y-auto"
          >
            {options.map((option, index) => (
              <div
                key={index}
                className="px-6 py-3 flex justify-between text-sm items-center cursor-pointer hover:bg-gray-100 transition"
                onClick={() => handleSelect(option)}
              >
                <span>{option.label}</span>
                {selected?.value === option.value && (
                  <Check size={18} color="#5E49D9" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;