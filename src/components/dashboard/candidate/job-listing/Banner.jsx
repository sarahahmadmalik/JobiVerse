'use client';
import { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/button';
import { Search, MapPin, X } from 'lucide-react';
import Image from 'next/image';
import debounce from 'lodash.debounce';
import { getLocationSuggestions } from '@/services/location-service';

export default function JobSearchBanner({
  searchTerm,
  setSearchTerm,
  location,
  setLocation,
  handleSearch
}) {
  const [locationInput, setLocationInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionsRef = useRef(null);

  const fetchSuggestions = debounce(async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await getLocationSuggestions(query);
      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    setLocationInput(location);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    fetchSuggestions(value);
  };

  const selectLocation = (loc) => {
    setLocationInput(loc);
    setLocation(loc);
    setShowSuggestions(false);
  };

  const clearLocation = () => {
    setLocationInput("");
    setLocation("");
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowSuggestions(false);
    }
  };

  return (
    <div
      className="text-white relative overflow-hidden rounded-t-[16px] p-6 md:p-10 flex flex-col md:flex-row justify-between items-end shadow-lg gap-6"
      style={{
        background: "radial-gradient(50% 50% at 50% 50%, rgba(176, 163, 255, 0.4) 0%, rgba(94, 73, 217, 0.4) 49%, rgba(58, 31, 218, 0.4) 100%)",
      }}
    >
      {/* Background decorations remain the same */}
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
          {/* Job Search Input */}
          <div className="flex items-center gap-2 w-full sm:w-1/2 py-2 sm:py-0">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Job Title or Keyword"
              className="bg-transparent placeholder:text-gray-400 focus:outline-none w-full text-sm"
            />
          </div>

          <div className="hidden sm:block w-px h-6 bg-gray-300 mx-3"></div>

          {/* Location Input with Autocomplete */}
          <div className="flex items-center gap-2 w-full sm:w-1/2 py-2 sm:py-0 relative" ref={suggestionsRef}>
            <MapPin className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={locationInput}
              onChange={handleLocationChange}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="City, State, or Country"
              className="bg-transparent placeholder:text-gray-400 focus:outline-none w-full text-sm pr-6"
            />
            {locationInput && (
              <button 
                onClick={clearLocation}
                className="absolute right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => selectLocation(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))
                ) : locationInput && !isLoading && (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No locations found
                  </div>
                )}
              </div>
            )}
          </div>

          <Button 
            onClick={handleSearch}
            className="!hover:bg-[#5237d9] -mr-2 !text-sm !shadow-none text-white px-6 py-2 mt-2 sm:mt-0 sm:ml-4 w-full sm:w-auto rounded-[12px]"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Image remains the same */}
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