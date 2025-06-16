"use client";
import React, { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import InterviewCard from "@/components/dashboard/recruiter/home/InterviewCard";
import Schedule from "@/components/dashboard/candidate/home/Schedule";
import { interviewService } from "@/services/interview-service";
import axios from "axios";
import Image from "next/image";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";

function RecruiterHomePage() {
  const { data: session } = useSession();
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recruiterTasks, setRecruiterTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    openPositions: 6,
    activeCandidates: 2,
    interviewsThisWeek: 0,
    avgHireTime: 0
  });

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        if (!session?.user?.id) return;
        
        const interviews = await interviewService.getInterviewsAsInterviewer(session.user.id);
        console.log(interviews)
        
        // Transform the data for the InterviewCard component
        const transformedInterviews = interviews.map(interview => ({
          id: interview._id,
          candidate: interview.candidates?.[0]?.firstName + interview.candidates?.[0]?.lastName,
          role: interview.jobDetails?.jobTitle || "Position",
          time: formatInterviewTime(interview.startTime),
          type: interview.stage || getInterviewType(interview.jobDetails?.jobTitle),
          interviewers: interview.interviewers.map(i => i.name),
          status: interview.status === "scheduled" ? "Invited" : interview.status,
          meetingType: interview.location === "zoom" ? "Zoom" : "In-Person",
          meetingLink: interview.joinUrl,
          location: interview.location === "zoom" 
            ? "Virtual Meeting" 
            : interview.address || "Office"
        }));

        // Sort by upcoming interviews first
        transformedInterviews.sort((a, b) => new Date(a.time) - new Date(b.time));
        
        setUpcomingInterviews(transformedInterviews);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [session]);

  const formatInterviewTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const getInterviewType = (jobTitle) => {
    if (!jobTitle) return "Screening";
    if (jobTitle.toLowerCase().includes("manager")) return "Behavioral";
    if (jobTitle.toLowerCase().includes("engineer")) return "Technical";
    return "Interview";
  };

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

  if (loading) {
    return <div className="min-h-screen md:py-4 flex justify-center items-center">
      <Loader/>
    </div>;
  }

  return (
    <div className="min-h-screen md:py-4">
      {/* Top Section - Upcoming Interviews */}
      <div className="flex w-full flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 w-full relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold">Upcoming Interviews</h2>
            <button className="text-blue-600 hover:underline">View Calendar</button>
          </div>

          <div className="relative max-w-[350px] sm:max-w-none w-full overflow-hidden">
            {upcomingInterviews.length > 0 ? (
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
                    640: { slidesPerView: 1, spaceBetween: 10 },
                    768: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 2, spaceBetween: 20 },
                    1920: { slidesPerView: 3, spaceBetween: 30 },
                  }}
                  style={{ width: "100%" }}
                  className="w-full"
                >
                  {upcomingInterviews.map((interview) => (
                    <SwiperSlide key={interview.id} className="w-full">
                      <div className="w-full px-1">
                        <InterviewCard {...interview} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button
                  ref={navigationPrevRef}
                  onClick={handlePrev}
                  className={`absolute left-1 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 ${
                    isBeginning ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
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
              <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                <div className="w-[160px] h-[160px] relative mb-4">
                  <Image 
                    src="/no-interview.svg" 
                    alt="No interviews scheduled"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Interviews Scheduled</h3>
                <p className="text-gray-500 max-w-md">
                  You don't have any upcoming interviews. Schedule new interviews to see them here.
                </p>
                <Button className="mt-4 !text-[14px] px-4 py-2 ">
                  Schedule Interview
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
         <Schedule events={upcomingInterviews} />
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Hiring Overview</h2>
          <button className="text-blue-600 hover:underline">View Details</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Open Positions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Open Positions</p>
                <p className="text-2xl font-bold mt-1">{stats.openPositions}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">+2 from last week</p>
          </div>

          {/* Candidates in Pipeline */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Candidates</p>
                <p className="text-2xl font-bold mt-1">{stats.activeCandidates}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">+12 from last week</p>
          </div>

          {/* Interviews Scheduled */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Interviews This Week</p>
                <p className="text-2xl font-bold mt-1">{upcomingInterviews?.length || 0}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">+1 from yesterday</p>
          </div>

          {/* Average Time to Hire */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Time to Hire</p>
                <p className="text-2xl font-bold mt-1">{stats.avgHireTime} days</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">-3 days from last quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterHomePage;