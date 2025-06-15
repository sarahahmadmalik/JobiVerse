"use client";
import React, { useState, useEffect } from "react";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import Button from "@/components/ui/button";
import { FiDownload, FiEdit, FiChevronLeft } from "react-icons/fi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { resumeService } from "@/services/resume-service";
import { useParams } from "next/navigation";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import Loader from "@/components/ui/loader";

const ResumeDetailPage = () => {
  const params = useParams(); // Properly access params using useParams()
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  useEffect(() => {
    const fetchResume = async () => {
      console.log(params.id)
      if (!params?.id || !session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch resume using the resumeService
        const response = await resumeService.getResumeById(params.id);
        console.log(response)
        
        if (!response) {
          throw new Error('Resume not found');
        }

        setResume(response);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(err.message || "Failed to load resume");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [params?.id, session?.user?.id]); // Add dependencies to useEffect

  console.log(resume)

  const handleDownloadResume = () => {
    if (!resume?.resumeLink) return;

    const link = document.createElement("a");
    link.href = resume.resumeLink;
    link.download = `${resume.fileName?.replace(/\s+/g, "-").toLowerCase() || 'resume'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 min-h-screen py-8 flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-red-500">{error || "Resume not found"}</p>
          <Link
            href="/my-resumes"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Back to resumes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-3">
      <div className="bg-white rounded-[16px] border border-[#00000024] p-6 w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/my-resumes"
            className="flex items-center text-colors-primary hover:text-indigo-700"
          >
            <FiChevronLeft className="mr-1" />
            Back to Resumes
          </Link>
          <div className="flex gap-3">
            {/* <Link href={`/dashboard/resumes/${params.id}/edit`}>
              <Button
                variant="outline"
                className="!text-[14px] !font-[500] flex items-center gap-2"
              >
                <FiEdit size={16} />
                Edit
              </Button>
            </Link> */}
            <Button
              onClick={handleDownloadResume}
              className="!text-[14px] !font-[500] flex items-center gap-2"
            >
              <FiDownload size={16} />
              Download
            </Button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden h-[50rem]">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div className="border-b p-2 bg-gray-100">
              <Toolbar>
                {(props) => {
                  const { ZoomIn, ZoomOut, CurrentPageInput, NumberOfPages, CurrentScale } =
                    props;
                  return (
                    <div className="flex justify-center items-center gap-4">
                      <div className="flex gap-2 items-center">
                        <ZoomOut />
                        <CurrentScale>
                          {(props) => (
                            <span className="text-sm font-medium">
                              {Math.round(props.scale * 100)}%
                            </span>
                          )}
                        </CurrentScale>
                        <ZoomIn />
                      </div>

                      <div className="flex w-full justify-end items-center gap-2">
                        Page <CurrentPageInput /> / <NumberOfPages />
                      </div>
                    </div>
                  );
                }}
              </Toolbar>
            </div>

            <Viewer
              fileUrl={resume.resumeLink}
              plugins={[toolbarPluginInstance]}
              theme={{ theme: "auto" }}
              renderError={(error) => (
                <div className="h-full flex flex-col items-center justify-center p-4 text-red-500">
                  <p>Failed to load PDF</p>
                  <p className="text-sm mt-2">{error.message}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Retry
                  </Button>
                </div>
              )}
              renderLoader={(percentages) => (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-64 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${percentages}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-gray-600">Loading {percentages}%</p>
                </div>
              )}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetailPage;