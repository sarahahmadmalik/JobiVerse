"use client";
import { useState } from "react";
import {
  MapPin,
  Bookmark,
  ArrowLeft,
  Share2,
  Clock,
  Briefcase,
  DollarSign,
  Layers,
  X,
  Plus,
} from "lucide-react";
import Button from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Resume Selection Component
function ChooseResume({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [previousResumes, setPreviousResumes] = useState([
    { id: 1, name: "My Resume (2023)", size: "2.4MB", date: "Jan 15, 2023" },
    { id: 2, name: "Developer Resume", size: "1.8MB", date: "Mar 22, 2023" },
  ]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    // Create the file object
    const newFile = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + "MB",
      type: file.type,
    };

    setSelectedFile(newFile);
    simulateUpload(newFile);
  };

  const simulateUpload = (file) => {
    if (!file) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploadStatus("success");
          // Add to previous resumes after successful upload
          setPreviousResumes((prev) => [
            {
              id: Date.now(),
              name: file.name,
              size: file.size,
              date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            },
            ...prev,
          ]);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
  };

  const selectPreviousResume = (resume) => {
    setSelectedFile({
      name: resume.name,
      size: resume.size,
      type: "application/pdf",
    });
    setUploadStatus("success");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
          Choose Your Resume
        </h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Select an option below to attach your resume for the application.
        </p>

        <div className="relative mb-4">
          <select
            className="w-full border border-gray-300 text-gray-500 rounded-lg p-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
            onChange={(e) => {
              if (e.target.value) {
                const resume = previousResumes.find(
                  (r) => r.id === parseInt(e.target.value)
                );
                if (resume) selectPreviousResume(resume);
              }
            }}
          >
            <option value="">Select from Previous Resumes</option>
            {previousResumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.name} ({resume.size}) - {resume.date}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="border border-dashed border-gray-300 rounded-lg p-6 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Browse and choose the files you want to upload from your computer
              or drop it here.
            </p>
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 text-white mb-2">
                <Plus size={20} />
              </div>
              <p className="text-sm text-indigo-600 font-medium">Choose file</p>
              <p className="text-xs text-gray-500 mt-1">
                PDF or DOCX (Max. 5MB)
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
              />
            </label>
          </div>
        </div>

        {selectedFile && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{selectedFile.size}</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            {uploadStatus === "uploading" && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right text-gray-500 mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </>
            )}

            {uploadStatus === "success" && (
              <p className="text-xs text-green-500 mt-1">
                ✓ Successfully uploaded
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            disabled={!selectedFile || uploadStatus === "uploading"}
          >
            {uploadStatus === "uploading" ? "Uploading..." : "Use This Resume"}
          </button>
          <button
            className="border border-indigo-500 text-indigo-500 hover:bg-indigo-50 py-3 px-4 rounded-lg font-medium transition-colors"
            onClick={() => {
              // This would open a resume builder in a real implementation
              console.log("Open resume builder");
            }}
          >
            Create New
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobDetails() {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

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
    applicants: "45 applicants",
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

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Job link copied to clipboard!");
  };

  const openResumeModal = () => {
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setShowResumeModal(false);
  };

  return (
    <div className="max-w-6xl py-4">
      {/* Resume Modal */}
      {showResumeModal && <ChooseResume onClose={closeResumeModal} />}

      <div className="mb-4 text-colors-primary">
        <Link
          href="/job-listings"
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
        <div className=" border-b border-gray-100">
          <div className="flex flex-col p-5 md:p-6 bg-gray-50 sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Left side - Job info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 line-clamp-2">
                    {job.position}
                  </h1>
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
                {job.intermediate && (
                  <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs">
                    Intermediate
                  </span>
                )}
                {job.entryLevel && (
                  <span className="bg-indigo-50 text-indigo-600 rounded-full px-3 py-1 text-xs">
                    Entry level
                  </span>
                )}
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center sm:items-start gap-3 mt-2 sm:mt-0">
              <div className="flex gap-2">
                <motion.button
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isSaved ? "Unsave job" : "Save job"}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      isSaved ? "fill-indigo-500 " : "text-gray-400"
                    }`}
                  />
                </motion.button>
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
                className="shadow-none text-white !text-sm whitespace-nowrap"
                onClick={openResumeModal}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>

        {/* Job Details - Improved layout */}
        <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Main content - Description, Requirements, Responsibilities */}
          <div className="lg:col-span-5 order-2 lg:order-1">
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

          {/* Sidebar - Company and Job info */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-gray-50 rounded-xl p-5 sticky top-4">
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Job Overview
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 " />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Salary</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatSalary(job.monthlySalary)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <MapPin className="w-4 h-4 " />
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
                        <Briefcase className="w-4 h-4 " />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Job Type</p>
                        <p className="text-sm font-medium text-gray-900">
                          {job.fullTime
                            ? "Full-time"
                            : job.partTime
                            ? "Part-time"
                            : job.contract
                            ? "Contract"
                            : "Internship"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Layers className="w-4 h-4 " />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-sm font-medium text-gray-900">
                          {job.senior
                            ? "Senior"
                            : job.intermediate
                            ? "Intermediate"
                            : "Entry Level"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Clock className="w-4 h-4 " />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Posted</p>
                        <p className="text-sm font-medium text-gray-900">
                          {job.postedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    About {job.company}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {job.company} is a leading technology company dedicated to
                    creating innovative solutions that improve people's lives
                    worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Footer - Improved CTA area */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {job.position}
              </h3>
              <p className="text-xs text-gray-500">
                {job.company} • {job.location} • {job.applicants}
              </p>
            </div>
            <Button
              className="text-white px-6 py-2 !text-sm"
              onClick={openResumeModal}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
