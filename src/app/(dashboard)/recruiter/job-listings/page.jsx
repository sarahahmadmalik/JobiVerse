"use client";
import { useState, useEffect } from "react";
import RecruiterJobsForYou from "@/components/dashboard/recruiter/job-listings/JobListings";
import Loader from "@/components/ui/loader";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function RecruiterJobsPage() {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "open", "closed"

  const dummyJobs = [
    {
      id: 1,
      date: "04/12/2024",
      company: "Google",
      position: "Senior App Developer",
      salary: 180000,
      monthlySalary: 15000,
      salaryDisplay: "$15k/month",
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
      senior: true,
      status: "open", // Added status field
      applicants: 42, // Added applicant count
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
      senior: false,
      status: "open",
      applicants: 28,
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
      senior: false,
      status: "closed",
      applicants: 76,
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
      senior: true,
      status: "open",
      applicants: 15,
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
      senior: false,
      status: "closed",
      applicants: 34,
    },
  ];


  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Initial load - filter based on status
      const filtered = statusFilter === "all" 
        ? dummyJobs 
        : dummyJobs.filter(job => job.status === statusFilter);
      
      setFilteredJobs(filtered);
      setLoading(false);
    }, 500);
  }, [statusFilter]); // Re-run when statusFilter changes

  const handleDeleteJob = (jobId) => {
    setFilteredJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  const handleToggleJobStatus = (jobId) => {
    setFilteredJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            status: job.status === 'open' ? 'closed' : 'open'
          };
        }
        return job;
      })
    );
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            My Job Listings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your posted job listings
          </p>
        </div>
        
        <Link href="/recruiter/job-post">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
            <PlusCircle size={20} />
            <span>Create Job</span>
          </button>
        </Link>
      </div>

      <div className="py-3">
        {/* Status filter tabs */}
        <div className="flex mb-4 border-b">
          <button 
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 font-medium ${
              statusFilter === "all" 
                ? "text-indigo-600 border-b-2 border-indigo-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Jobs
          </button>
          <button 
            onClick={() => setStatusFilter("open")}
            className={`px-4 py-2 font-medium ${
              statusFilter === "open" 
                ? "text-indigo-600 border-b-2 border-indigo-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Open Jobs
          </button>
          <button 
            onClick={() => setStatusFilter("closed")}
            className={`px-4 py-2 font-medium ${
              statusFilter === "closed" 
                ? "text-indigo-600 border-b-2 border-indigo-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Closed Jobs
          </button>
        </div>
        
        {loading ? (
          <div className="h-screen w-full flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <RecruiterJobsForYou 
            jobs={filteredJobs} 
            onDelete={handleDeleteJob}
            onToggleStatus={handleToggleJobStatus}
            onEdit={(jobId) => console.log("Edit job", jobId)}
          />
        )}
      </div>
    </div>
  );
}