"use client";
import React, { useState, useEffect } from "react";
import ResumeCard from "@/components/dashboard/candidate/home/ResumeCard";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { resumeService } from "@/services/resume-service";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";
import * as pdfjsLib from 'pdfjs-dist';
import Image from "next/image";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Input = ({ label, className = "", icon, ...props }) => {
  return (
    <div className="flex flex-col w-full relative">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full px-[24px] py-[12px] border border-gray-300 rounded-[12px] text-gray-800 placeholder-gray-400 
          focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
          hover:border-gray-400 transition-all duration-200 ease-in-out ${
            icon ? "pl-10" : ""
          } ${className}`}
      />
    </div>
  );
};

const MyResumes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resumes, setResumes] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const generateThumbnail = async (pdfUrl, resumeId) => {
    try {
      if (thumbnails[resumeId]) {
        return thumbnails[resumeId];
      }

      const response = await fetch(pdfUrl);
      const arrayBuffer = await response.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const scale = 2.0;
      const viewport = page.getViewport({ scale });
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const cropHeight = Math.floor(viewport.height * 0.6);
      canvas.height = cropHeight;
      
      const cropViewport = page.getViewport({ 
        scale,
        offsetX: 0,
        offsetY: 0,
        width: viewport.width,
        height: cropHeight
      });
      
      await page.render({
        canvasContext: context,
        viewport: cropViewport,
        intent: 'print'
      }).promise;
      
      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setThumbnails(prev => ({
        ...prev,
        [resumeId]: thumbnailDataUrl
      }));
      
      return thumbnailDataUrl;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchResumes = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        const userResumes = await resumeService.getUserResumes(session.user.id);
        setResumes(userResumes || []);
        
        userResumes.forEach(async (resume) => {
          if (resume.resumeLink) {
            await generateThumbnail(resume.resumeLink, resume._id);
          }
        });
      } catch (err) {
        console.error("Error fetching resumes:", err);
        setError("Failed to load resumes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, [session]);

  const filteredResumes = resumes.filter((resume) =>
    resume.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2">
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">
          My Resumes
        </h1>
        <p className="text-md text-gray-500 mt-1">
          Manage and edit your professional resumes
        </p>

        <div className="mt-4 relative sm:max-w-80 w-full">
          <Input
            placeholder="Search resumes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FiSearch size={18} />}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {searchTerm && filteredResumes.length > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          Showing results for "{searchTerm}"
        </p>
      )}

      {filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <Link key={resume._id} href={`/my-resumes/${resume._id}`}>
              <ResumeCard 
                title={resume.fileName || "Untitled Resume"} 
                image={thumbnails[resume._id] || "/assets/dashboard/resume.svg"}
                isGeneratingThumbnail={!thumbnails[resume._id]}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="max-w-md mx-auto text-center">
            <Image
              src={searchTerm ? "/empty-search.svg" : "/no-resume.svg"}
              alt={searchTerm ? "No results found" : "No resumes"}
              width={150}
              height={150}
              className="mx-auto mb-6"
            />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No matching resumes found" : "You don't have any resumes yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? `We couldn't find any resumes matching "${searchTerm}"`
                : "Create your first resume to get started with your job search"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear search
              </button>
            ) : (
              <Link href="/dashboard/resume-builder">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create New Resume
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyResumes;