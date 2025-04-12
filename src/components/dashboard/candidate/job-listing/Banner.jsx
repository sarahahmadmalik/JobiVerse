'use client';

import Button from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function JobSearchBanner({
  searchTerm,
  setSearchTerm,
  location,
  setLocation,
  handleSearch
}) {
  return (
    <div
      className="text-white relative overflow-hidden rounded-t-[16px] p-6 md:p-10 flex flex-col md:flex-row justify-between items-end shadow-lg gap-6"
      style={{
        background: "radial-gradient(50% 50% at 50% 50%, rgba(176, 163, 255, 0.4) 0%, rgba(94, 73, 217, 0.4) 49%, rgba(58, 31, 218, 0.4) 100%)",
      }}
    >
      <div className="absolute w-full inset-0 flex justify-center items-center pointer-events-none">
        <Image
          src="/assets/dashboard/banner-icon-1.svg"
          alt="Background Decoration"
          width={320}
          height={320}
          className="absolute h-[200px] w-[200px] md:h-[300px] md:w-[300px] top-[-50px] left-[-50px] md:top-[-1rem] md:left-[2rem]"
        />
        <Image
          src="/assets/dashboard/banner-icon-2.svg"
          alt="Background Decoration"
          width={320}
          height={320}
          className="absolute h-[200px] w-[200px] md:h-[350px] md:w-[350px] top-[-50px] right-[-50px] md:top-[-3rem] md:right-[5rem]"
        />
      </div>

      <div className="w-full z-10 md:w-2/3">
        <h1 className="text-xl text-colors-primary md:text-2xl font-bold mb-6">
          Your Next Opportunity Awaits!
        </h1>

        <div className="bg-white rounded-[16px] px-4 py-2 flex flex-col sm:flex-row items-stretch sm:items-center w-full text-gray-700 gap-2 sm:gap-0">
          <div className="flex items-center gap-2 w-full sm:w-1/2 py-2 sm:py-0">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Job Title or Keyword"
              className="bg-transparent placeholder:text-gray-400 focus:outline-none w-full text-sm"
            />
          </div>

          <div className="hidden sm:block w-px h-6 bg-gray-300 mx-3"></div>

          <div className="flex items-center gap-2 w-full sm:w-1/2 py-2 sm:py-0">
            <MapPin className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location Preference"
              className="bg-transparent placeholder:text-gray-400 focus:outline-none w-full text-sm"
            />
          </div>

          <Button 
            onClick={handleSearch}
            className="!hover:bg-[#5237d9] -mr-2 !text-sm !shadow-none text-white px-6 py-2 mt-2 sm:mt-0 sm:ml-4 w-full sm:w-auto rounded-[12px]"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="relative hidden h-[150px] lg:flex justify-end items-start z-40">
        <div className="absolute lg:-right-[160px] lg:top-[5rem] transform -translate-x-1/2 -translate-y-1/2 rhombus-shape w-[300px] h-[220px]">
          <Image
            src="/assets/dashboard/listing-img.svg"
            alt="Job seeker"
            layout="fill"
            objectFit="cover"
            objectPosition='left'
          />
        </div>
      </div>
    </div>
  );
}