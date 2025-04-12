import React from "react";
import Link from "next/link";

const Schedule = ({ events = [] }) => {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(
        `${event.month} ${event.day}, ${today.getFullYear()}`
      );
      return eventDate >= today && eventDate <= nextMonth;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.month} ${a.day}, ${today.getFullYear()}`);
      const dateB = new Date(`${b.month} ${b.day}, ${today.getFullYear()}`);
      return dateA - dateB;
    })
    .slice(0, 5); // Show maximum 5 upcoming events

  return (
    <div className="bg-white p-3 sm:p-4 h-auto sm:h-[360px] rounded-lg sm:rounded-[16px] border border-[#00000024] w-full sm:min-w-60 flex-1 lg:max-w-[400px] overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="font-semibold text-lg sm:text-xl text-gray-800">
          Upcoming Schedule
        </h3>
        {events.length > 5 && (
          <Link href="/schedule" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        )}
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-2 flex-grow">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-2 sm:mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 text-base sm:text-lg">No upcoming events</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">You're all caught up!</p>
        </div>
      ) : (
        <>
          <ul className="space-y-3 sm:space-y-4 flex-grow">
            {upcomingEvents.map((event, index) => (
              <li
                key={index}
                className={`flex gap-2 sm:gap-4 px-2 sm:px-3 py-2 transition-all hover:bg-gray-50 rounded ${
                  event.priority === 1 ? "border-l-2 sm:border-l-4 border-red-500" : ""
                }`}
              >
                <div className="min-w-[45px] sm:min-w-[52px] text-center flex flex-col">
                  <div className="bg-blue-50 rounded-t-lg py-0.5 sm:py-1">
                    <span className="text-xs font-semibold text-blue-600 uppercase">
                      {event.month}
                    </span>
                  </div>
                  <div className="bg-white border border-blue-100 rounded-b-lg py-0.5 sm:py-1">
                    <span className="text-lg sm:text-md font-bold text-gray-700">
                      {event.day}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <h4 className="font-medium text-sm sm:text-sm text-gray-800">
                      {event.title}
                    </h4>
                    {event.priority === 1 && (
                      <span className="rounded-full  text-xs text-white font-[600] flex  items-center justify-center bg-red-500 w-4 h-4">!</span>
                    )}
                  </div>

                  <div className="mt-1 space-y-1 sm:space-y-1.5">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{event.time}</span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {events.length > 5 && (
            <div className="mt-3 text-center">
              <Link href="/schedule" className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center">
                View More
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Schedule;