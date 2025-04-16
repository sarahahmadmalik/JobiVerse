"use client";
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Schedule from "@/components/dashboard/candidate/home/Schedule";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ScheduleView = () => {
  const [currentView, setCurrentView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());

  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Meeting with recruiter from ABC",
      start: new Date(2025, 1, 16, 10, 30),
      end: new Date(2025, 1, 16, 11, 50),
      location: "Zoom Meeting",
      resource: {
        type: "job",
        color: "#7048e8",
        priority: 0,
      },
    },
    {
      id: "2",
      title: "Complete Application for the XYZ Position",
      start: new Date(2025, 1, 16, 15, 30),
      end: new Date(2025, 1, 16, 16, 50),
      location: "Online",
      resource: {
        type: "application",
        color: "#4b9bff",
        priority: 0,
      },
    },
    {
      id: "3",
      title: "Meeting with recruiter from XYZ",
      start: new Date(2025, 1, 18, 10, 30),
      end: new Date(2025, 1, 18, 11, 50),
      location: "Office Room 302",
      resource: {
        type: "job",
        color: "#12b886",
        priority: 1,
      },
    },
  ]);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.resource.color + "20"; // Add opacity
    const borderColor = event.resource.color;
    const style = {
      backgroundColor,
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: "4px",
      color: "#000",
      border: "0px",
    };
    return { style };
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleView = (newView) => {
    setCurrentView(newView);
  };

  const handleSelectEvent = (event) => {
    console.log("Event selected:", event);
  };

  const formatDateRange = () => {
    if (currentView === Views.DAY) {
      return format(date, "MMMM d, yyyy");
    } else if (currentView === Views.WEEK) {
      const start = startOfWeek(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    } else {
      return format(date, "MMMM yyyy");
    }
  };

  const upcomingEvents = events
    .filter((event) => event.start >= new Date())
    .sort((a, b) => a.start - b.start)
    .map((event) => ({
      title: event.title,
      month: format(event.start, "MMM"),
      day: format(event.start, "d"),
      time: `${format(event.start, "h:mm a")} - ${format(event.end, "h:mm a")}`,
      location: event.location,
      priority: event.resource?.priority || 0,
    }));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">
          My Schedule
        </h1>
        <div className="text-gray-500">{formatDateRange()}</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main calendar area */}
        <div className="flex-1 flex flex-col">
          {/* Calendar navigation */}
          <div className="flex justify-between items-center p-4 bg-white border-b">
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleNavigate(
                    new Date(
                      date.setDate(
                        date.getDate() - (currentView === Views.WEEK ? 7 : 1)
                      )
                    )
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() =>
                  handleNavigate(
                    new Date(
                      date.setDate(
                        date.getDate() + (currentView === Views.WEEK ? 7 : 1)
                      )
                    )
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight size={20} />
              </button>

              <button
                onClick={() => handleNavigate(new Date())}
                className="px-3 py-1 ml-2 hover:bg-gray-100 rounded text-sm"
              >
                Today
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleView(Views.DAY)}
                className={`px-3 py-1 rounded text-sm ${
                  currentView === Views.DAY
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => handleView(Views.WEEK)}
                className={`px-3 py-1 rounded text-sm ${
                  currentView === Views.WEEK
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => handleView(Views.MONTH)}
                className={`px-3 py-1 rounded text-sm ${
                  currentView === Views.MONTH
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex-1 overflow-auto">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              view={currentView}
              date={date}
              onNavigate={handleNavigate}
              onView={handleView}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              views={[Views.DAY, Views.WEEK, Views.MONTH]}
              defaultView={Views.WEEK}
              toolbar={false} 
            />
          </div>
        </div>

        {/* Right sidebar with upcoming events */}
        <div className="w-1/4 border-l bg-white p-4 overflow-y-auto">
          <Schedule events={upcomingEvents} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;
