"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ResumeCard from "@/components/dashboard/candidate/home/ResumeCard";
import ApplicationCard from "@/components/dashboard/candidate/home/ApplicationCard";
import Schedule from "@/components/dashboard/candidate/home/Schedule";

function Page() {
  const resumes = [
    {
      title: "Senior Product Designer Resume",
      image: "/assets/dashboard/resume.svg",
    },
    {
      title: "Software Engineer Resume",
      image: "/assets/dashboard/resume.svg",
    },
    { title: "UX Designer Resume", image: "/assets/dashboard/resume.svg" },
    { title: "Product Manager Resume", image: "/assets/dashboard/resume.svg" },
    { title: "Data Scientist Resume", image: "/assets/dashboard/resume.svg" },
  ];

  const applications = [
    {
      jobTitle: "Senior App Developer",
      company: "Google",
      companyIcon: "/assets/dashboard/companyLogo.svg",
      date: "04/12/2024",
      status: "Viewed",
    },
    {
      jobTitle: "Frontend Engineer",
      company: "Google",
      companyIcon: "/assets/dashboard/companyLogo.svg",
      date: "05/12/2024",
      status: "Pending",
    },
  ];

  const tasks = [
    { text: "Meeting with recruiter from ABC", completed: false },
    { text: "Complete Application for the XYZ Position", completed: true },
    { text: "Meeting with recruiter from XYZ", completed: false },
  ];

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiper, setSwiper] = useState(null);

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

  return (
    <div className="min-h-screen md:py-4">
      <div className="flex w-full flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 w-full relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold">My Resumes</h2>
            <button className="text-blue-600 hover:underline">View All</button>
          </div>

          <div className="relative max-w-[350px] sm:max-w-none w-full overflow-hidden">
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
              {resumes.map((resume, index) => (
                <SwiperSlide key={index} className="w-full">
                  <div className="w-full px-1">
                    <ResumeCard {...resume} />
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
          </div>
        </div>

        <div className="lg:w-1/3">
          <Schedule tasks={tasks} />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold">
            Recent Applications
          </h2>
          <button className="text-blue-600 hover:underline">See All</button>
        </div>
        <div className="flex sm:flex-row flex-col flex-wrap gap-4">
          {applications.map((app, index) => (
            <ApplicationCard key={index} {...app} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;