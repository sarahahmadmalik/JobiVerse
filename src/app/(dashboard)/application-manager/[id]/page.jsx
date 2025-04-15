// app/dashboard/applications/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Eye, BarChart2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/ui/loader";

export default function ApplicationInsightsPage({ params }) {
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Mock applications data - in a real app, you'd fetch this from an API
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
  useEffect(() => {
    async function loadApplication() {
      try {
        // Wait for params to resolve
        const { id } = await params;
        const appId = parseInt(id);
        const foundApp = applications.find(app => app.id === appId);
        
        if (foundApp) {
          setApplication(foundApp);
        } else {
          console.error("Application not found");
        }
      } catch (error) {
        console.error("Error loading application:", error);
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [params]);
  if (loading) {
    return (
      <div className="flex items-center min-h-screen justify-center">
      <Loader/>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500 mb-4">Application not found</p>
        <Link href="/dashboard/applications" className="text-colors-primary hover:text-blue-800">
          Return to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full p-3 max-w-6xl">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
      <div className="mb-4 text-colors-primary">
        <Link
          href="/application-manager"
          className="flex items-center gap-2 sm:text-indigo-600 text-sm group relative"
        >
          <ArrowLeft size={16} />
          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full">
            Back to Applications
          </span>
        </Link>
      </div>
      </div>

      {/* Application Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center mr-4">
            <span className="text-lg font-bold">{application.company.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">{application.position}</h1>
            <p className="text-gray-600">{application.company}</p>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
        </div>
      </div>

      {/* Application Status */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Application Status</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between mb-2">
            <span className="text-gray-600">Viewed by Recruiter</span>
            <span className="font-medium">{application.date}</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div className="bg-colors-primary h-2 rounded-full" style={{ width: getProgressWidth(application.status) }}></div>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Application Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Total time viewed</span>
            </div>
            <p className="font-medium">2 minutes 30 seconds</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Eye className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Top sections viewed</span>
            </div>
            <ul className="list-disc list-inside text-sm">
              <li>Work Experience</li>
              <li>Skills</li>
              <li>Education</li>
            </ul>
          </div>
          {/* <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <BarChart2 className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Salary Range</span>
            </div>
            <p className="font-medium">{application.salary}</p>
          </div> */}
        </div>
      </div>

      {/* Resume Heatmap */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Resume Heatmap Analysis</h2>
        <p className="text-sm text-gray-600 mb-4">
          This visualization shows which sections of your resume received the most attention from recruiters.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
          {/* Placeholder for the heatmap image */}
          <div className="relative w-full max-w-lg h-96 bg-gray-200 rounded flex items-center justify-center">
            <p className="text-gray-500">Resume heatmap visualization</p>
            {/* In a real implementation, you would use an actual image here */}
            <Image src={`/assets/sample.png`} alt="Resume heatmap" fill className="object-contain" />
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Improvement Suggestions</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-colors-primary/10 text-colors-primary flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
              <span>Highlight more quantifiable achievements in your work experience section.</span>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-colors-primary/10 text-colors-primary flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
              <span>Add more relevant technical skills that match the job description.</span>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-colors-primary/10 text-colors-primary flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
              <span>Consider reorganizing your education section for better visibility.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStatusColor(status) {
  const colors = {
    "Submitted": "bg-yellow-100 text-yellow-800",
    "Viewed": "bg-colors-primary/10 text-blue-800",
    "Shortlisted": "bg-green-100 text-green-800",
    "Interview": "bg-purple-100 text-purple-800",
    "Pending": "bg-gray-100 text-gray-800",
    "Rejected": "bg-red-100 text-red-800"
  };
  
  return colors[status] || "bg-gray-100 text-gray-800";
}

function getProgressWidth(status) {
  const progress = {
    "Submitted": "20%",
    "Viewed": "40%",
    "Shortlisted": "60%",
    "Interview": "80%",
    "Pending": "90%",
    "Rejected": "100%"
  };
  
  return progress[status] || "0%";
}