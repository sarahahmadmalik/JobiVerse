"use client";

import { useState } from "react";

const InputAuto = ({ label, suggestions = [], onSelect, ...props }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      setFilteredSuggestions(
        suggestions.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    onSelect(item);
    setInputValue("");
    setFilteredSuggestions([]);
  };

  return (
    <div className="relative flex flex-col w-full">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Input field */}
      <input
        {...props}
        value={inputValue}
        onChange={handleInputChange}
        className="w-full px-[24px] py-[12px] border border-gray-300 rounded-[12px] text-gray-800 placeholder-gray-400 
                   focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
                   hover:border-gray-400 transition-all duration-200 ease-in-out"
      />

      {/* Suggestions dropdown */}
      {inputValue && filteredSuggestions.length > 0 && (
        <div className="absolute top-[4.2rem] z-10 w-full bg-white border border-gray-300 rounded-[12px] mt-1 shadow-md max-h-[200px] overflow-y-auto">
          {filteredSuggestions.map((item) => (
            <div
              key={item}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800"
              onClick={() => handleSelect(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputAuto;
