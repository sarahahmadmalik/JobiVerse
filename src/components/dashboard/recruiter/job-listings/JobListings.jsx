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
import Dropdown from "@/components/ui/dropdown"; // Import the new Dropdown component

export default function RecruiterJobsForYou({ jobs, onDelete, onToggleStatus, onEdit }) {
    // Enhanced sorting options
    const [sortOption, setSortOption] = useState('recent');
    const sortOptions = [
        { value: 'recent', label: 'Most Recent' },
        { value: 'salary-high', label: 'Salary (High to Low)' },
        { value: 'salary-low', label: 'Salary (Low to High)' },
        { value: 'applicants-high', label: 'Applicants (High to Low)' },
        { value: 'applicants-low', label: 'Applicants (Low to High)' },
        { value: 'experience-high', label: 'Experience (High to Low)' },
        { value: 'experience-low', label: 'Experience (Low to High)' },
        { value: 'company-asc', label: 'Company (A-Z)' },
        { value: 'company-desc', label: 'Company (Z-A)' },
        { value: 'location-asc', label: 'Location (A-Z)' },
        { value: 'location-desc', label: 'Location (Z-A)' },
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
  
    // Helper function to convert experience levels to numerical values for sorting
    const getExperienceValue = (job) => {
        if (job.senior) return 3;
        if (job.intermediate) return 2;
        if (job.entryLevel) return 1;
        return 0;
    };
  
    // Enhanced sorting function
    const sortedJobs = [...jobs].sort((a, b) => {
        switch (sortOption) {
            case 'salary-high':
                return b.monthlySalary - a.monthlySalary;
            case 'salary-low':
                return a.monthlySalary - b.monthlySalary;
            case 'applicants-high':
                return b.applicants - a.applicants;
            case 'applicants-low':
                return a.applicants - b.applicants;
            case 'experience-high':
                return getExperienceValue(b) - getExperienceValue(a);
            case 'experience-low':
                return getExperienceValue(a) - getExperienceValue(b);
            case 'company-asc':
                return a.company.localeCompare(b.company);
            case 'company-desc':
                return b.company.localeCompare(a.company);
            case 'location-asc':
                return a.location.localeCompare(b.location);
            case 'location-desc':
                return b.location.localeCompare(a.location);
            case 'title-asc':
                return a.position.localeCompare(b.position);
            case 'title-desc':
                return b.position.localeCompare(a.position);
            case 'recent':
            default:
                return new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'));
        }
    });
  
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
                    {/* Sorting dropdown */}
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
                    {sortedJobs.map((job, index) => (
                        <RecruiterJobCard
                            key={job.id}
                            job={job}
                            backgroundColor={getBackgroundColor(index)}
                            onDelete={() => onDelete(job.id)}
                            onToggleStatus={() => onToggleStatus(job.id)}
                            onEdit={() => onEdit(job.id)}
                        />
                    ))}
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