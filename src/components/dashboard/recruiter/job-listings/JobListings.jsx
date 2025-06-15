"use client";
import { useState } from "react";
import { 
  ArrowUpDown,
  Briefcase,
  MapPin,
  Users,
  Trash2,
  Pencil,
  Mail,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button";
import RecruiterJobCard from "./JobCard";
import Dropdown from "@/components/ui/dropdown";
import { useRouter } from 'next/navigation';

export default function RecruiterJobsForYou({ jobs, onDelete, onToggleStatus, onEdit }) {
    console.log(jobs)
    const router = useRouter();
    const [sortOption, setSortOption] = useState('recent');
    const sortOptions = [
        { value: 'recent', label: 'Most Recent' },
        { value: 'salary-high', label: 'Salary (High to Low)' },
        { value: 'salary-low', label: 'Salary (Low to High)' },
        { value: 'applicants-high', label: 'Applicants (High to Low)' },
        { value: 'applicants-low', label: 'Applicants (Low to High)' },
        { value: 'experience-high', label: 'Experience (High to Low)' },
        { value: 'experience-low', label: 'Experience (Low to High)' },
        { value: 'title-asc', label: 'Job Title (A-Z)' },
        { value: 'title-desc', label: 'Job Title (Z-A)' }
    ];
  
    const bgColors = [
        "bg-green-50",
        "bg-orange-50",
        "bg-purple-50",
        "bg-indigo-50",
        "bg-blue-50",
        "bg-pink-50"
    ];

    const getBackgroundColor = (index) => bgColors[index % bgColors.length];
  
    // Updated experience level mapping
    const getExperienceValue = (job) => {
        switch(job.experienceLevel) {
            case 'Entry': return 1;
            case 'Intermediate': return 2;
            case 'Senior': return 3;
            case 'Lead': return 4;
            case 'Executive': return 5;
            default: return 0;
        }
    };
  
    // Updated sorting function
    const sortedJobs = [...jobs].sort((a, b) => {
        switch (sortOption) {
            case 'salary-high':
                return (b.salary?.value || 0) - (a.salary?.value || 0);
            case 'salary-low':
                return (a.salary?.value || 0) - (b.salary?.value || 0);
            case 'applicants-high':
                return (b.applications?.length || 0) - (a.applications?.length || 0);
            case 'applicants-low':
                return (a.applications?.length || 0) - (b.applications?.length || 0);
            case 'experience-high':
                return getExperienceValue(b) - getExperienceValue(a);
            case 'experience-low':
                return getExperienceValue(a) - getExperienceValue(b);
            case 'title-asc':
                return a.jobTitle.localeCompare(b.jobTitle);
            case 'title-desc':
                return b.jobTitle.localeCompare(a.jobTitle);
            case 'recent':
            default:
                return new Date(b.postedAt) - new Date(a.postedAt);
        }
    });

    const handleViewDetails = (jobId) => {
        router.push(`/recruiter/job-listings/${jobId}`);
    };
  
    return (
        <div className="w-full relative py-4 md:px-4 px-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg md:text-xl font-semibold text-gray-900">Your Job Listings</h1>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {sortedJobs.length} {sortedJobs.length === 1 ? 'job' : 'jobs'}
                    </span>
                </div>
                <div className="flex items-center gap-3 mt-6 mb-2 md:my-0">
                    <div className="w-48">
                        <Dropdown
                            options={sortOptions}
                            onChange={setSortOption}
                            placeholder="Sort by"
                            value={sortOption}
                            icon={ArrowUpDown}
                        />
                    </div>
                </div>
            </div>
  
            <div className="flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {sortedJobs.map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RecruiterJobCard
                                    job={{
                                        id: job._id,
                                        title: job.jobTitle,
                                        company: job.recruiterId?.company?.name || "Your Company",
                                        location: job.location,
                                        salary: job.salary?.value || 0,
                                        salaryDisplay: job.salary?.value ? `$${(job.salary.value / 1000).toFixed(1)}k/month` : "Not specified",
                                        workMode: job.workMode,
                                        experienceLevel: job.experienceLevel,
                                        jobType: job.jobType,
                                        applicants: job.applications?.length || 0,
                                        company: job.recruiterInfo?.company?.name,
                                        postedAt: new Date(job.postedAt).toLocaleDateString(),
                                        isOpen: job.isOpen,
                                        skills: job.skills || []
                                    }}
                                    backgroundColor={getBackgroundColor(index)}
                                    onDelete={() => onDelete(job._id)}
                                    onToggleStatus={() => onToggleStatus(job._id, job.isOpen)}
                                    onEdit={() => onEdit(job._id)}
                                    onView={() => handleViewDetails(job._id)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
  
                {sortedJobs.length === 0 && (
                    <div className="text-center py-10">
                        <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            You haven't posted any jobs yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}