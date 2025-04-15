"use client";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import Dropdown from "@/components/ui/dropdown";
import ApplicationCard from "@/components/dashboard/candidate/home/ApplicationCard";
import { STATUS_PRIORITY } from "@/constants/constants";

export default function ApplicationTracker() {
  const [sortOption, setSortOption] = useState('recent');
  
  const applications = [
    { id: 1, company: "Google", position: "Frontend Developer", status: "Viewed", date: "04/15/2024", salary: "$95k" },
    { id: 2, company: "Microsoft", position: "UX Designer", status: "Submitted", date: "04/14/2024", salary: "$85k" },
    { id: 3, company: "Amazon", position: "Backend Engineer", status: "Shortlisted", date: "04/12/2024", salary: "$110k" },
    { id: 4, company: "Apple", position: "iOS Developer", status: "Interview", date: "04/10/2024", salary: "$105k" },
    { id: 5, company: "Netflix", position: "Data Scientist", status: "Pending", date: "04/08/2024", salary: "$120k" },
    { id: 6, company: "Spotify", position: "Product Manager", status: "Rejected", date: "04/05/2024", salary: "$115k" },
    { id: 7, company: "Tesla", position: "ML Engineer", status: "Viewed", date: "04/03/2024", salary: "$125k" },
    { id: 8, company: "SpaceX", position: "Systems Engineer", status: "Submitted", date: "04/01/2024", salary: "$130k" },
    { id: 9, company: "Meta", position: "VR Developer", status: "Shortlisted", date: "03/28/2024", salary: "$100k" },
  ];
  
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'salary-high', label: 'Salary (High to Low)' },
    { value: 'salary-low', label: 'Salary (Low to High)' },
    { value: 'status', label: 'Application Status' },
    { value: 'company-asc', label: 'Company (A-Z)' },
    { value: 'company-desc', label: 'Company (Z-A)' },
  ];
  
  const sortedApplications = [...applications].sort((a, b) => {
    switch (sortOption) {
      case 'recent':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'salary-high':
        return parseInt(b.salary.replace(/\D/g, '')) - parseInt(a.salary.replace(/\D/g, ''));
      case 'salary-low':
        return parseInt(a.salary.replace(/\D/g, '')) - parseInt(b.salary.replace(/\D/g, ''));
      case 'status':
        return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      case 'company-asc':
        return a.company.localeCompare(b.company);
      case 'company-desc':
        return b.company.localeCompare(a.company);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">Track Your Applications</h1>
          <p className="text-gray-600 text-md mt-1">
            Monitor the progress of your job applications
          </p>
        </div>
        <div className="w-full sm:w-48">
          <Dropdown
            options={sortOptions}
            onChange={setSortOption}
            placeholder="Sort by"
            value={sortOption}
            icon={ArrowUpDown}
          />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              id={app.id}
              company={app.company}
              position={app.position}
              status={app.status}
              date={app.date}
              salary={app.salary}
            />
          ))}
        </div>
      </div>
    </div>
  );
}