import React from "react";

const Schedule = ({ events = [] }) => {
  return (
    <div className="bg-white p-4 h-[360px] rounded-[16px] border border-[#00000024] w-full sm:min-w-60 flex-1 lg:max-w-[400px] overflow-y-auto">
      <h3 className="font-semibold text-lg mb-3">Upcoming Schedule</h3>

      {events.length === 0 ? (
        <p className="text-gray-500">No upcoming events scheduled.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event, index) => (
            <li key={index} className="flex gap-3">
              <div className="min-w-12 text-center">
                <div className="bg-blue-100 rounded-t-md py-1">
                  <span className="text-xs font-medium text-blue-700">
                    {event.month}
                  </span>
                </div>
                <div className="bg-white border border-blue-200 rounded-b-md py-1">
                  <span className="text-lg font-bold">{event.day}</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{event.title}</span>
                  {event.priority === "high" && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                      High Priority
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{event.time}</span>
                </div>
                {event.location && (
                  <div className="text-sm text-gray-500 flex items-center gap-1">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Schedule;
