"use client";
import { useState } from "react";
import JobsForYou from "@/components/dashboard/candidate/job-listing/JobsForYou";
import JobSearchBanner from "@/components/dashboard/candidate/job-listing/Banner";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState({
    searchTerm: "",
    location: "",
  });

  const dummyJobs = [
    {
      id: 1,
      date: "04/12/2024",
      company: "Google",
      position: "Senior App Developer",
      salary: 180000, // Annual salary in USD
      monthlySalary: 15000, // Monthly salary in USD
      salaryDisplay: "$15k/month", // Display version
      location: "London",
      fullTime: true,
      partTime: false,
      contract: false,
      internship: false,
      remote: true,
      hybrid: false,
      onsite: false,
      entryLevel: false,
      intermediate: false,
      senior: true
    },
    {
      id: 2,
      date: "04/10/2024",
      company: "Microsoft",
      position: "UX Designer",
      salary: 96000,
      monthlySalary: 8000,
      salaryDisplay: "$8k/month",
      location: "New York",
      fullTime: false,
      partTime: true,
      contract: false,
      internship: false,
      remote: false,
      hybrid: true,
      onsite: false,
      entryLevel: false,
      intermediate: true,
      senior: false
    },
    {
      id: 3,
      date: "04/05/2024",
      company: "Amazon",
      position: "Data Science Intern",
      salary: 48000,
      monthlySalary: 4000,
      salaryDisplay: "$4k/month",
      location: "Seattle",
      fullTime: false,
      partTime: false,
      contract: false,
      internship: true,
      remote: false,
      hybrid: false,
      onsite: true,
      entryLevel: true,
      intermediate: false,
      senior: false
    },
    {
      id: 4,
      date: "04/01/2024",
      company: "Apple",
      position: "iOS Developer (Contract)",
      salary: 144000,
      monthlySalary: 12000,
      salaryDisplay: "$12k/month",
      location: "Cupertino",
      fullTime: false,
      partTime: false,
      contract: true,
      internship: false,
      remote: true,
      hybrid: false,
      onsite: false,
      entryLevel: false,
      intermediate: false,
      senior: true
    },
    {
      id: 5,
      date: "03/28/2024",
      company: "Netflix",
      position: "Content Moderator",
      salary: 84000,
      monthlySalary: 7000,
      salaryDisplay: "$7k/month",
      location: "Los Angeles",
      fullTime: true,
      partTime: false,
      contract: false,
      internship: false,
      remote: true,
      hybrid: false,
      onsite: false,
      entryLevel: false,
      intermediate: true,
      senior: false
    },
    {
      id: 6,
      date: "03/25/2024",
      company: "Spotify",
      position: "Backend Engineer",
      salary: 156000,
      monthlySalary: 13000,
      salaryDisplay: "$13k/month",
      location: "Stockholm",
      fullTime: true,
      partTime: false,
      contract: false,
      internship: false,
      remote: false,
      hybrid: true,
      onsite: false,
      entryLevel: false,
      intermediate: false,
      senior: true
    },
    {
      id: 7,
      date: "03/20/2024",
      company: "Tesla",
      position: "Automation Engineer",
      salary: 108000,
      monthlySalary: 9000,
      salaryDisplay: "$9k/month",
      location: "Austin",
      fullTime: true,
      partTime: false,
      contract: false,
      internship: false,
      remote: false,
      hybrid: false,
      onsite: true,
      entryLevel: false,
      intermediate: true,
      senior: false
    },
    {
      id: 8,
      date: "03/15/2024",
      company: "SpaceX",
      position: "Aerospace Intern",
      salary: 36000,
      monthlySalary: 3000,
      salaryDisplay: "$3k/month",
      location: "Hawthorne",
      fullTime: false,
      partTime: false,
      contract: false,
      internship: true,
      remote: false,
      hybrid: false,
      onsite: true,
      entryLevel: true,
      intermediate: false,
      senior: false
    },
    {
      id: 9,
      date: "03/10/2024",
      company: "Meta",
      position: "VR Developer (Contract)",
      salary: 132000,
      monthlySalary: 11000,
      salaryDisplay: "$11k/month",
      location: "Menlo Park",
      fullTime: false,
      partTime: false,
      contract: true,
      internship: false,
      remote: false,
      hybrid: true,
      onsite: false,
      entryLevel: false,
      intermediate: false,
      senior: true
    },
    {
      id: 10,
      date: "03/05/2024",
      company: "Twitter",
      position: "Community Manager",
      salary: 72000,
      monthlySalary: 6000,
      salaryDisplay: "$6k/month",
      location: "San Francisco",
      fullTime: false,
      partTime: true,
      contract: false,
      internship: false,
      remote: true,
      hybrid: false,
      onsite: false,
      entryLevel: false,
      intermediate: true,
      senior: false
    }
  ];

  const handleSearch = () => {
    setFilters({
      searchTerm,
      location,
    });
  };

  return (
    <div className="min-h-screen rounded-b-[16px] bg-gray-50">
      <JobSearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        location={location}
        setLocation={setLocation}
        handleSearch={handleSearch}
      />

      <div className="p-3">
        <JobsForYou jobs={dummyJobs} />
      </div>
    </div>
  );
}
