"use client";
import React, { useState } from "react";
import ResumeCard from "@/components/dashboard/candidate/home/ResumeCard";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

const Input = ({ label, className = "", icon, ...props }) => {
  return (
    <div className="flex flex-col w-full relative">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full px-[24px] py-[12px] border border-gray-300 rounded-[12px] text-gray-800 placeholder-gray-400 
          focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
          hover:border-gray-400 transition-all duration-200 ease-in-out ${
            icon ? "pl-10" : ""
          } ${className}`}
      />
    </div>
  );
};

const MyResumes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const resumes = [
    {
      id: 1,
      title: "Software Engineer Resume",
      image: "/assets/dashboard/resume.svg",
      lastUpdated: "May 15, 2023",
    },
    {
      id: 2,
      title: "Product Manager Resume",
      image: "/assets/dashboard/resume.svg",
      lastUpdated: "June 2, 2023",
    },
    {
      id: 3,
      title: "UX Designer Resume",
      image: "/assets/dashboard/resume.svg",
      lastUpdated: "April 28, 2023",
    },
  ];

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-2">
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">
          My Resumes
        </h1>
        <p className="text-md text-gray-500 mt-1">
          Manage and edit your professional resumes
        </p>

        <div className="mt-4 relative sm:max-w-80 w-full ">
          <Input
            placeholder="Search resumes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch size={18} />}
            className=""
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {searchTerm && filteredResumes.length > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          Showing results for "{searchTerm}"
        </p>
      )}

      {filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <Link key={resume.id} href={`/my-resumes/${resume.id}`}>
              <ResumeCard title={resume.title} image={resume.image} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm
              ? `No resumes found matching "${searchTerm}"`
              : "No resumes available"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyResumes;
