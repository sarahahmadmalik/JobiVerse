"use client";
import { useState } from "react";
import {
  MapPin,
  ArrowLeft,
  Share2,
  Clock,
  Briefcase,
  DollarSign,
  Layers,
  Pencil,
  Users,
  FileText,
  User
} from "lucide-react";
import Button from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import JobApplicantsDashboard from "@/components/dashboard/recruiter/application/Applicants";

export default function RecruiterJobDetails() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('description'); // 'description' or 'applicants'

  // Dummy job data
  const job = {
    id: 1,
    date: "04/12/2024",
    company: "Google",
    position: "Senior App Developer",
    monthlySalary: 30000,
    location: "London, UK",
    description:
      "We're looking for an experienced Senior App Developer to join our team. You'll be responsible for developing and maintaining our flagship applications, working with cutting-edge technologies, and mentoring junior developers.",
    requirements: [
      "5+ years of experience in mobile app development",
      "Strong expertise in React Native and Flutter",
      "Experience with native iOS/Android development",
      "Knowledge of RESTful APIs and GraphQL",
      "Familiarity with CI/CD pipelines",
      "Excellent problem-solving skills",
    ],
    responsibilities: [
      "Develop and maintain mobile applications",
      "Collaborate with cross-functional teams",
      "Write clean, maintainable code",
      "Participate in code reviews",
      "Mentor junior developers",
      "Stay updated with industry trends",
    ],
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
    postedDate: "2 days ago",
    applicants: [
      { id: 1, name: "John Doe", status: "Shortlisted", appliedDate: "04/14/2024" },
      { id: 2, name: "Jane Smith", status: "Interview", appliedDate: "04/13/2024" },
      { id: 3, name: "Alex Johnson", status: "New", appliedDate: "04/12/2024" },
      { id: 4, name: "Sarah Williams", status: "Rejected", appliedDate: "04/11/2024" },
      { id: 3, name: "Alex Johnson", status: "New", appliedDate: "04/12/2024" },
      { id: 4, name: "Sarah Williams", status: "Rejected", appliedDate: "04/11/2024" },

    ],
    status: "open"
  };

  const formatSalary = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}m/month`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k/month`;
    }
    return `$${amount}/month`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Job link copied to clipboard!");
  };

  const handleEdit = () => {
    router.push(`/dashboard/recruiter/jobs/edit/${job.id}`);
  };

  const handleToggleStatus = () => {
    alert(`Job status toggled to ${job.status === 'open' ? 'closed' : 'open'}`);
  };

  const handleViewApplicant = (applicantId) => {
    router.push(`/dashboard/recruiter/applicants/${applicantId}`);
  };

  return (
    <div className="max-w-6xl py-4">
      <div className="mb-4 text-colors-primary">
        <Link
          href="/recruiter/job-listings"
          className="flex items-center gap-2 sm:text-indigo-600 text-sm group relative"
        >
          <ArrowLeft size={16} />
          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full">
            Back to jobs
          </span>
        </Link>
      </div>

      <motion.div
        className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with job info */}
        <div className="border-b border-gray-100">
          <div className="flex flex-col p-5 md:p-6 bg-gray-50 sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 line-clamp-2">
                      {job.position}
                    </h1>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === "open" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {job.status === "open" ? "Open" : "Closed"}
                    </span>
                  </div>
                  <p className="text-base text-gray-600">{job.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {job.fullTime && (
                  <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs">
                    Full time
                  </span>
                )}
                {job.partTime && (
                  <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs">
                    Part time
                  </span>
                )}
                {job.contract && (
                  <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs">
                    Contract
                  </span>
                )}
                {job.internship && (
                  <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs">
                    Internship
                  </span>
                )}
                {job.senior && (
                  <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs">
                    Senior level
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center sm:items-start gap-3 mt-2 sm:mt-0">
              <div className="flex gap-2">
                <motion.button
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Share job"
                >
                  <Share2 className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
              <Button
                className="shadow-none text-white flex !py-2 !text-sm whitespace-nowrap"
                onClick={handleEdit}
              >
                <Pencil size={16} className="mr-2" />
                Edit Job
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
                activeTab === 'description'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText size={16} />
              Job Description
            </button>
            <button
              onClick={() => setActiveTab('applicants')}
              className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
                activeTab === 'applicants'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={16} />
              Applicants ({job.applicants.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 md:p-6">
          {activeTab === 'description' ? (
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              {/* Job Description Content */}
              <div className="lg:col-span-5">
                <div className="prose max-w-none">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">
                    Job Description
                  </h2>
                  <p className="text-sm text-gray-700 mb-5">{job.description}</p>

                  <h2 className="text-lg font-bold text-gray-900 mb-3">
                    Requirements
                  </h2>
                  <ul className="space-y-1 mb-5">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className=" mr-2 text-sm">•</span>
                        <span className="text-sm text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>

                  <h2 className="text-lg font-bold text-gray-900 mb-3">
                    Responsibilities
                  </h2>
                  <ul className="space-y-1">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start">
                        <span className=" mr-2 text-sm">•</span>
                        <span className="text-sm text-gray-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Job Overview Sidebar */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-xl p-5 sticky top-4">
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-3">
                        Job Overview
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                            <DollarSign className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Salary</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatSalary(job.monthlySalary)}
                            </p>
                          </div>
                        </div>
                        {/* ... other overview items ... */}
                      </div>
                    </div>
                    {/* ... about company section ... */}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <JobApplicantsDashboard />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {job.position}
              </h3>
              <p className="text-xs text-gray-500">
                {job.company} • {job.location} • {job.applicants.length} applicants
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-gray-300 !text-sm text-gray-700 hover:bg-gray-50"
                onClick={handleToggleStatus}
              >
                {job.status === 'open' ? 'Close Job' : 'Reopen Job'}
              </Button>
              <Button
                className="text-white px-6 py-2 !text-sm flex items-center"
                onClick={handleEdit}
              >
                <Pencil size={16} className="mr-2" />
                Edit Job
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}