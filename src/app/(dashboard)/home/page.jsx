"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ResumeCard from "@/components/dashboard/candidate/home/ResumeCard";
import ApplicationCard from "@/components/dashboard/candidate/home/ApplicationCard";
import Schedule from "@/components/dashboard/candidate/home/Schedule";
import { resumeService } from "@/services/resume-service";
import { applicationService } from "@/services/applicant-service";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";
import * as pdfjsLib from 'pdfjs-dist';
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function Page() {
  const { data: session } = useSession();
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const tasks = [
    {
      month: "Apr",
      day: "15",
      title: "Meeting with recruiter from ABC",
      time: "10:00 AM",
      location: "Zoom Conference",
      priority: 1
    },
    {
      month: "Apr",
      day: "16",
      title: "Complete Application for XYZ Position",
      time: "2:30 PM"
    },
    {
      month: "Apr",
      day: "17",
      title: "Follow up with HR at Google",
      time: "11:00 AM",
      location: "Phone Call"
    }
  ];

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiper, setSwiper] = useState(null);

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
    const fetchData = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch resumes
        const userResumes = await resumeService.getUserResumes(session.user.id);
        setResumes(userResumes || []);
        
        // Generate thumbnails for resumes
        userResumes.forEach(async (resume) => {
          if (resume.resumeLink) {
            await generateThumbnail(resume.resumeLink, resume._id);
          }
        });

        // Fetch applications
        const appsResponse = await applicationService.getCandidateApplications(session.user.id);
        if (appsResponse && appsResponse.success) {
          const transformedApplications = appsResponse.data.map(app => ({
            id: app._id,
            status: app.status,
            jobTitle: app.jobDetails?.jobTitle || 'Unknown Position',
            company: app.jobDetails?.recruiterInfo?.company?.name || 'Unknown Company',
            date: new Date(app.appliedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }),
            companyIcon: app.jobDetails?.recruiterInfo?.company?.logo,
            analysis: app.analysis || {}
          }));
          setApplications(transformedApplications);
        } else {
          throw new Error(appsResponse?.message || 'Failed to fetch applications');
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const handlePrev = () => {
    if (swiper && !isBeginning) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiper && !isEnd) {
      swiper.slideNext();
    }
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
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:py-4">
      <div className="flex w-full flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 w-full relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold">My Resumes</h2>
            <button className="text-blue-600 hover:underline">View All</button>
          </div>

          <div className="relative max-w-[350px] sm:max-w-none w-full overflow-hidden">
            {resumes.length > 0 ? (
              <>
                <Swiper
                  modules={[Navigation]}
                  onSwiper={setSwiper}
                  onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                  }}
                  loop={false}
                  slidesPerView={1}
                  spaceBetween={10}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1920: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                  }}
                  style={{ width: "100%" }}
                  className="w-full"
                >
                  {resumes.map((resume) => (
                    <SwiperSlide key={resume._id} className="w-full">
                      <div className="w-full px-1">
                        <ResumeCard 
                          title={resume.fileName || "Untitled Resume"} 
                          image={thumbnails[resume._id] || "/assets/dashboard/resume.svg"}
                          isGeneratingThumbnail={!thumbnails[resume._id]}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button
                  ref={navigationPrevRef}
                  onClick={handlePrev}
                  className={`absolute left-1 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 ${
                    isBeginning
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                  disabled={isBeginning}
                  aria-label="Previous slide"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  ref={navigationNextRef}
                  onClick={handleNext}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 ${
                    isEnd ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
                  }`}
                  disabled={isEnd}
                  aria-label="Next slide"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                <div className="max-w-md mx-auto text-center px-4">
                  <Image
                    src="/no-resume.svg"
                    alt="No resumes"
                    width={200}
                    height={200}
                    className="mx-auto mb-6"
                  />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Your resume collection is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start building your professional profile by creating your first resume.
                    Showcase your skills and experience to potential employers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
          <Schedule events={tasks} />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold">
            Recent Applications
          </h2>
          <Link href="/dashboard/applications" className="text-blue-600 hover:underline">See All</Link>
        </div>
        {applications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.slice(0, 3).map((app) => (
              <ApplicationCard
                key={app.id}
                id={app.id}
                status={app.status}
                jobTitle={app.jobTitle}
                company={app.company}
                date={app.date}
                companyIcon={app.companyIcon}
                analysis={app.analysis}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
            <div className="max-w-md mx-auto text-center px-4">
              <Image
                src="/no-applications.svg"
                alt="No applications"
                width={200}
                height={200}
                className="mx-auto mb-6"
              />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't applied to any jobs yet. Start your job search today!
              </p>
              <Link href="/job-listings">
                <Button className="px-4 py-2">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;