"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/ui/loader";
import { applicationService } from "@/services/applicant-service";
import { useParams } from "next/navigation";

export default function ApplicationInsightsPage() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Your color palette
  const colors = {
    primary: "#5E49D9",
    secondary: "#ffffff",
    textPrimary: "#161819",
    textSecondary: "#999999",
  };

  useEffect(() => {
    async function loadApplication() {
      try {
        const response = await applicationService.getApplicationById(params.id);
        
        if (response.success) {
          setApplication({
            id: response.data._id,
            company: response.data.jobDetails?.recruiterInfo?.company?.name || 'Unknown Company',
            position: response.data.jobDetails?.jobTitle || 'Unknown Position',
            status: response.data.status,
            date: new Date(response.data.appliedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }),
            companyLogo: response.data.jobDetails?.recruiterInfo?.company?.logo
          });
        } else {
          setError('Application not found');
        }
      } catch (error) {
        console.error("Error loading application:", error);
        setError('Failed to load application details');
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <Loader />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className={`mb-4 text-[${colors.textSecondary}]`}>Application not found</p>
        <Link href="/dashboard/applications" className={`text-[${colors.primary}] hover:opacity-80`}>
          Return to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full p-3 max-w-6xl">
      {/* Header with back button */}
      <div className="mb-4">
        <Link
          href="/application-manager"
          className={`flex items-center gap-2 text-[${colors.primary}] text-sm group relative`}
        >
          <ArrowLeft size={16} />
          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full">
            Back to Applications
          </span>
        </Link>
      </div>

      {/* Application Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
        <div className="flex items-center">
          {application.companyLogo ? (
            <div className="h-12 w-12 rounded-md bg-white flex items-center justify-center mr-4 overflow-hidden">
              <Image
                src={application.companyLogo}
                alt={`${application.company} logo`}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center mr-4">
              <span className="text-lg font-bold">{application.company.charAt(0)}</span>
            </div>
          )}
          <div>
            <h1 className={`text-xl font-semibold text-[${colors.textPrimary}]`}>{application.position}</h1>
            <p className={`text-[${colors.textSecondary}]`}>{application.company}</p>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status, colors)}`}>
            {application.status}
          </span>
        </div>
      </div>

      {/* Application Status */}
      <div className="mb-8">
        <h2 className={`text-lg font-medium mb-4 text-[${colors.textPrimary}]`}>Application Status</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between mb-2">
            <span className={`text-[${colors.textSecondary}]`}>Viewed by Recruiter</span>
            <span className="font-medium">{application.date}</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div className={`h-2 rounded-full`} style={{ width: getProgressWidth(application.status), backgroundColor: colors.primary }}></div>
          </div>
        </div>
      </div>

      {/* Static Analysis Section */}
      <div className="mb-8">
        <h2 className={`text-lg font-medium mb-4 text-[${colors.textPrimary}]`}>Application Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Clock className={`h-4 w-4 text-[${colors.textSecondary}] mr-2`} />
              <span className={`text-[${colors.textSecondary}]`}>Total time viewed</span>
            </div>
            <p className="font-medium">1 minutes 05 seconds</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Eye className={`h-4 w-4 text-[${colors.textSecondary}] mr-2`} />
              <span className={`text-[${colors.textSecondary}]`}>Top sections viewed</span>
            </div>
            <ul className="list-disc list-inside text-sm">
              <li>Work Experience</li>
              <li>Skills</li>
               <li>Summary</li>
              <li>Education</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Static Resume Heatmap */}
{/* Static Resume Heatmap */}
<div className="mb-8">
  <h2 className={`text-lg font-medium mb-4 text-[${colors.textPrimary}]`}>Resume Heatmap Analysis</h2>
  <p className={`text-sm text-[${colors.textSecondary}] mb-4`}>
    This visualization shows which sections of your resume received the most attention from recruiters.
  </p>
  <div className="bg-gray-50 p-4 rounded-lg">
    {/* Container for horizontal scrolling */}
    <div className="flex overflow-x-auto pb-4 -mx-4 px-4"> {/* Added negative margins and padding to compensate for container padding */}
      {/* First A4 Image */}
      <div className="flex-shrink-0 mr-4" style={{ width: '210mm', height: '297mm' }}> {/* A4 dimensions */}
        <div className="relative w-full h-full bg-white shadow-md border border-gray-200 overflow-hidden">
          <img 
            src="/img2.png" 
            alt="Resume page 1 heatmap" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Second A4 Image */}
      <div className="flex-shrink-0 mr-4" style={{ width: '210mm', height: '297mm' }}>
        <div className="relative w-full h-full bg-white shadow-md border border-gray-200 overflow-hidden">
          <img 
            src="/img3.png" 
            alt="Resume page 2 heatmap" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Third A4 Image */}
      <div className="flex-shrink-0" style={{ width: '210mm', height: '297mm' }}>
        <div className="relative w-full h-full bg-white shadow-md border border-gray-200 overflow-hidden">
          <img 
            src="/img4.png" 
            alt="Resume page 3 heatmap" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
    
    {/* Optional: Page indicators */}
    <div className="flex justify-center mt-4">
      {[1, 2, 3].map((page) => (
        <div 
          key={page}
          className="w-2 h-2 rounded-full bg-gray-300 mx-1"
          aria-label={`Page ${page}`}
        />
      ))}
    </div>
  </div>
</div>

      {/* Static Improvement Suggestions */}
      <div className="mb-8">
        <h2 className={`text-lg font-medium mb-4 text-[${colors.textPrimary}]`}>Improvement Suggestions</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className={`h-5 w-5 rounded-full bg-[${colors.primary}]/10 text-[${colors.primary}] flex items-center justify-center text-xs mr-3 mt-0.5`}>1</span>
              <span>Highlight more quantifiable achievements in your work experience section.</span>
            </li>
            <li className="flex items-start">
              <span className={`h-5 w-5 rounded-full bg-[${colors.primary}]/10 text-[${colors.primary}] flex items-center justify-center text-xs mr-3 mt-0.5`}>2</span>
              <span>Add more relevant technical skills that match the job description.</span>
            </li>
            <li className="flex items-start">
              <span className={`h-5 w-5 rounded-full bg-[${colors.primary}]/10 text-[${colors.primary}] flex items-center justify-center text-xs mr-3 mt-0.5`}>3</span>
              <span>Consider reorganizing your education section for better visibility.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Updated helper functions to use the color palette
function getStatusColor(status, colors) {
  const statusColors = {
    "Submitted": `bg-amber-100 text-amber-800`,
    "Reviewed": `bg-[${colors.primary}]/10 text-[${colors.primary}]`,
    "Interview": `bg-indigo-100 text-indigo-800`,
    "Rejected": `bg-red-100 text-red-800`,
    "Shortlisted": `bg-green-100 text-green-800`,
    "Hired": `bg-emerald-100 text-emerald-800`
  };
  
  return statusColors[status] || `bg-gray-100 text-gray-800`;
}

function getProgressWidth(status) {
  const progress = {
    "Submitted": "20%",
    "Reviewed": "40%",
    "Interview": "60%",
    "Shortlisted": "80%",
    "Hired": "100%",
    "Rejected": "100%"
  };
  
  return progress[status] || "0%";
}