"use client";
import { useState, useEffect } from "react";
import JobsForYou from "@/components/dashboard/candidate/job-listing/JobsForYou";
import JobSearchBanner from "@/components/dashboard/candidate/job-listing/Banner";
import { getAllJobPosts } from "@/services/jobpost-service";
import Loader from "@/components/ui/loader";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const jobPosts = await getAllJobPosts();
        // console.log(jobPosts)
        setJobs(jobPosts);
        setFilteredJobs(jobPosts);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load job listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    try {
      const results = jobs.filter(job => {
        // Case insensitive search for position/company
        const matchesSearch = searchTerm 
          ? job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (job.recruiterInfo?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
          : true;
        
        // Case insensitive search for location
        const matchesLocation = location
          ? job.location.toLowerCase().includes(location.toLowerCase())
          : true;
        
        return matchesSearch && matchesLocation;
      });
      
      setFilteredJobs(results);
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add debounced search or search on Enter key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm, location, jobs]);

  console.log(filteredJobs)

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
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {loading ? (
          <div className="h-screen w-full flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <JobsForYou jobs={filteredJobs} />
        )}
      </div>
    </div>
  );
}