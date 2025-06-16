"use client";
import { useState, useEffect } from "react";
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
  User,
  Globe,
  Building,
  Calendar
} from "lucide-react";
import Button from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import JobApplicantsDashboard from "@/components/dashboard/recruiter/application/Applicants";
import { getJobPostById } from "@/services/jobpost-service";
import Loader from "@/components/ui/loader";
import Image from "next/image";
import { applicationService } from "@/services/applicant-service";

export default function RecruiterJobDetails() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;
  const [activeTab, setActiveTab] = useState('description');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both job and applications simultaneously
        const [jobData, applicationsData] = await Promise.all([
          getJobPostById(jobId),
          applicationService.getJobApplications(jobId)
        ]);
        
        setJob(jobData);
        console.log(applicationsData)
        setApplications(applicationsData);
        
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const formatSalary = (amount) => {
    if (!amount) return 'Salary not specified';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}m/year`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k/year`;
    }
    return `$${amount}/year`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Job link copied to clipboard!");
  };

  const handleEdit = () => {
    router.push(`/dashboard/recruiter/jobs/edit/${job._id}`);
  };

  const handleToggleStatus = () => {
    alert(`Job status toggled to ${job.isOpen ? 'closed' : 'open'}`);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center py-4">
        <Loader />
      </div>
    );
  }


  if (!job) {
    return (
      <div className="max-w-6xl py-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 mb-4">Job not found</p>
          <Button onClick={() => router.push('/recruiter/job-listings')}>
            Back to Job Listings
          </Button>
        </div>
      </div>
    );
  }

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
                {job.recruiterInfo?.company?.logo ? (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-200">
                    <Image
                      src={job.recruiterInfo.company.logo}
                      alt={`${job.recruiterInfo.company.name} logo`}
                      width={56}
                      height={56}
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {job.recruiterInfo?.company?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 line-clamp-2">
                      {job.jobTitle}
                    </h1>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.isOpen 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {job.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                  <p className="text-base text-gray-600">{job.recruiterInfo?.company?.name || 'Unknown Company'}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {job.jobType && (
                  <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs">
                    {job.jobType}
                  </span>
                )}
                {job.experienceLevel && (
                  <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs">
                    {job.experienceLevel}
                  </span>
                )}
                {job.workMode && (
                  <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs">
                    {job.workMode}
                  </span>
                )}
                {job.skills?.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs"
                  >
                    {skill}
                  </span>
                ))}
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
              Applicants ({applications.length || 0})
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
                  <p className="text-sm text-gray-700 mb-5">{job.jobDescription}</p>

                  {job.requirements?.length > 0 && (
                    <>
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
                    </>
                  )}

                  {job.responsibilities?.length > 0 && (
                    <>
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
                    </>
                  )}
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
                              {formatSalary(job.salary?.value)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-medium text-gray-900">
                              {job.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Job Type</p>
                            <p className="text-sm font-medium text-gray-900">
                              {job.jobType}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Experience</p>
                            <p className="text-sm font-medium text-gray-900">
                              {job.experienceLevel}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Posted</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(job.postedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">
                        About {job.recruiterInfo?.company?.name || 'the company'}
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        {job.recruiterInfo?.company?.description ||
                          'No company description available.'}
                      </p>

                      {job.recruiterInfo?.company && (
                        <div className="space-y-3 mt-4">
                          {job.recruiterInfo.company.industry && (
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Building className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Industry</p>
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                  {job.recruiterInfo.company.industry}
                                </p>
                              </div>
                            </div>
                          )}
                          {job.recruiterInfo.company.size && (
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Users className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Company Size
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {job.recruiterInfo.company.size}
                                </p>
                              </div>
                            </div>
                          )}
                          {job.recruiterInfo.company.location && (
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                                <MapPin className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Headquarters
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                  {job.recruiterInfo.company.location}
                                </p>
                              </div>
                            </div>
                          )}
                          {job.recruiterInfo.company.foundedYear && (
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Calendar className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Founded</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {job.recruiterInfo.company.foundedYear}
                                </p>
                              </div>
                            </div>
                          )}
                          {job.recruiterInfo.company.website && (
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Globe className="w-3 h-3" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Website</p>
                                <a
                                  href={job.recruiterInfo.company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-indigo-600 hover:underline"
                                >
                                  Visit website
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <JobApplicantsDashboard jobId={job._id} applicants={applications} />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {job.jobTitle}
              </h3>
              <p className="text-xs text-gray-500">
                {job.recruiterInfo?.company?.name || 'Unknown Company'} • 
                {job.location} • {job.applications?.length || 0} applicants
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-gray-300 !text-sm text-gray-700 hover:bg-gray-50"
                onClick={handleToggleStatus}
              >
                {job.isOpen ? 'Close Job' : 'Reopen Job'}
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