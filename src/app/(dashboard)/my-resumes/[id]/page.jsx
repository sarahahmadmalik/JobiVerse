"use client";
import React, { useState, useEffect } from "react";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import Button from "@/components/ui/button";
import { FiDownload, FiEdit, FiChevronLeft } from "react-icons/fi";
import Link from "next/link";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import Loader from "@/components/ui/loader";

// Sample resume data - replace with API call in production
const getResumeById = (id) => {
  const resumes = [
    {
      id: 1,
      title: "Software Engineer Resume",
      image: "/resume-sample-1.jpg",
      lastUpdated: "May 15, 2023",
      pdfUrl: "/resumes/Sara Ahmad Malik - NEW CV.pdf",
    },
    {
      id: 2,
      title: "Product Manager Resume",
      image: "/resume-sample-2.jpg",
      lastUpdated: "June 2, 2023",
      pdfUrl: "/resumes/Sara Ahmad Malik - NEW CV.pdf",
    },
    {
      id: 3,
      title: "UX Designer Resume",
      image: "/resume-sample-3.jpg",
      lastUpdated: "April 28, 2023",
      pdfUrl: "/resumes/Sara Ahmad Malik - NEW CV.pdf",
    },
  ];
  return resumes.find((resume) => resume.id === Number(id));
};

const ResumeDetailPage = ({ params }) => {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      const foundResume = getResumeById(resolvedParams.id);
      setResume(foundResume);
      setIsLoading(false);
    });
  }, [params]);

  const handleDownloadResume = () => {
    if (!resume) return;

    const link = document.createElement("a");
    link.href = resume.pdfUrl;
    link.download = `${resume.title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 min-h-screen py-8 flex justify-center items-center h-64">
       <Loader/>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-red-500">Resume not found</p>
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
            <Link href={`/dashboard/resumes/${resume.id}/edit`}>
              <Button
                variant="outline"
                className="!text-[14px] !font-[500] flex items-center gap-2"
              >
                <FiEdit size={16} />
                Edit
              </Button>
            </Link>
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
                  const { ZoomIn, ZoomOut, CurrentPageInput, NumberOfPages, CurrentScale  } =
                    props;
                  return (
                    <div className="flex  justify-center items-center gap-4">
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
              fileUrl={resume.pdfUrl}
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
