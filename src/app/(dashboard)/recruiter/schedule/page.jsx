"use client";
import React, { useEffect, useRef, useState } from 'react';
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Schedule from '@/components/dashboard/candidate/home/Schedule';

const ScheduleView = () => {
  const calendarRef = useRef(null);
  const calendarContainerRef = useRef(null);
  const [currentView, setCurrentView] = useState('week');
  const [viewDate, setViewDate] = useState(new Date());
  const [isCalendarReady, setIsCalendarReady] = useState(false);
  
  const [events, setEvents] = useState([
    {
      id: '1',
      calendarId: 'job',
      title: 'Meeting with recruiter from ABC',
      category: 'time',
      start: new Date(2025, 1, 16, 10, 30),
      end: new Date(2025, 1, 16, 11, 50),
      location: 'Zoom Meeting',
      raw: { 
        color: '#7048e8', 
        borderColor: '#7048e8',
        backgroundColor: 'rgba(112, 72, 232, 0.1)',
        priority: 0 
      }
    },
    {
      id: '2',
      calendarId: 'application',
      title: 'Complete Application for the XYZ Position',
      category: 'time',
      start: new Date(2025, 1, 16, 15, 30),
      end: new Date(2025, 1, 16, 16, 50),
      location: 'Online',
      raw: { 
        color: '#4b9bff', 
        borderColor: '#4b9bff',
        backgroundColor: 'rgba(75, 155, 255, 0.1)',
        priority: 0 
      }
    },
    {
      id: '3',
      calendarId: 'job',
      title: 'Meeting with recruiter from XYZ',
      category: 'time',
      start: new Date(2025, 1, 18, 10, 30),
      end: new Date(2025, 1, 18, 11, 50),
      location: 'Office Room 302',
      raw: { 
        color: '#12b886', 
        borderColor: '#12b886',
        backgroundColor: 'rgba(18, 184, 134, 0.1)',
        priority: 1 
      }
    }
  ]);

  // Initialize calendar
  useEffect(() => {
    if (calendarContainerRef.current && !calendarRef.current) {
      const calendar = new Calendar(calendarContainerRef.current, {
        defaultView: currentView,
        useDetailPopup: true,
        useFormPopup: true,
        week: {
          startDayOfWeek: 0,
          dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          narrowWeekend: false,
          workweek: false,
          hourStart: 9,
          hourEnd: 19,
          eventView: ['time'],
          taskView: false,
        },
        theme: {
          week: {
            dayName: {
              borderLeft: '1px solid #e5e5e5',
              borderTop: '1px solid #e5e5e5',
              borderBottom: '1px solid #e5e5e5',
              backgroundColor: '#f8f8f8',
            },
            dayGrid: {
              borderRight: '1px solid #e5e5e5',
              backgroundColor: 'inherit',
            },
            dayGridLeft: {
              borderRight: '1px solid #e5e5e5',
              backgroundColor: 'inherit',
              width: '72px',
            },
            timeGridLeft: {
              fontSize: '12px',
              backgroundColor: 'white',
              borderRight: '1px solid #e5e5e5',
              width: '72px',
            },
            timeGridLeftAdditionalTimezone: {
              backgroundColor: 'white',
            },
            timeGridHour: {
              borderBottom: '1px solid #e5e5e5',
            },
            timeGridHalfHour: {
              borderBottom: '1px dashed #e5e5e5',
            },
            nowIndicatorLabel: {
              color: '#ff5583',
            },
            nowIndicatorPast: {
              border: '1px solid #ff5583',
            },
            nowIndicatorBullet: {
              backgroundColor: '#ff5583',
            },
            nowIndicatorToday: {
              border: '1px solid #ff5583',
            },
            nowIndicatorFuture: {
              border: '1px solid #ff5583',
            },
            pastTime: {
              color: '#999',
            },
            futureTime: {
              color: '#333',
            },
            gridSelection: {
              color: '#bbdc00',
            },
          },
        },
        calendars: [
          { id: 'job', name: 'Job Interviews', color: '#7048e8', backgroundColor: 'rgba(112, 72, 232, 0.1)' },
          { id: 'application', name: 'Applications', color: '#4b9bff', backgroundColor: 'rgba(75, 155, 255, 0.1)' }
        ],
        template: {
          time: function(event) {
            const priorityMark = event.raw?.priority === 1 
              ? '<span class="w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold absolute top-1 right-1">!</span>' 
              : '';
              
            return `
              <div class="relative p-2 h-full">
                ${priorityMark}
                <div class="font-medium text-sm">${event.title}</div>
                <div class="flex items-center text-xs mt-1">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ${event.start.getHours()}:${event.start.getMinutes().toString().padStart(2, '0')} - 
                  ${event.end.getHours()}:${event.end.getMinutes().toString().padStart(2, '0')}
                </div>
                ${event.location ? `
                  <div class="flex items-center text-xs mt-1">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    ${event.location}
                  </div>
                ` : ''}
              </div>
            `;
          }
        }
      });

      calendarRef.current = calendar;
      setIsCalendarReady(true);
      setViewDate(calendar.getDate());

      // Add events
      const eventsForCalendar = events.map(event => ({
        id: event.id,
        calendarId: event.calendarId,
        title: event.title,
        category: event.category,
        start: event.start,
        end: event.end,
        location: event.location,
        isReadOnly: false,
        color: event.raw?.color,
        backgroundColor: event.raw?.backgroundColor,
        borderColor: event.raw?.borderColor,
        raw: event.raw
      }));

      calendar.createEvents(eventsForCalendar);

      // Event handlers
      calendar.on('clickEvent', ({ event }) => {
        console.log('Event clicked:', event);
      });

      calendar.on('beforeCreateEvent', (eventData) => {
        console.log('Create event:', eventData);
        return {
          ...eventData,
          id: String(Math.random()),
          isReadOnly: false
        };
      });

      calendar.on('afterRenderEvent', () => {
        setViewDate(calendar.getDate());
      });

      return () => {
        calendar.destroy();
        calendarRef.current = null;
      };
    }
  }, [currentView]);

  // Calendar navigation handlers
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.prev();
      setViewDate(calendarRef.current.getDate());
    }
  };
  
  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.next();
      setViewDate(calendarRef.current.getDate());
    }
  };
  
  const handleViewChange = (view) => {
    if (calendarRef.current) {
      calendarRef.current.changeView(view);
      setCurrentView(view);
    }
  };
  
  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.today();
      setViewDate(new Date());
    }
  };
  
  // Format date range for display
  const formatDateRange = () => {
    try {
      if (!isCalendarReady || !calendarRef.current) {
        return new Date().toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }

      const currentDate = viewDate instanceof Date ? viewDate : new Date();
      
      if (currentView === 'day') {
        return currentDate.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      } else if (currentView === 'week') {
        const calendar = calendarRef.current;
        if (!calendar) return '';
        
        const startDate = new Date(calendar.getDateRangeStart());
        const endDate = new Date(calendar.getDateRangeEnd());
        
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
        const year = currentDate.getFullYear();
        
        if (startDate.getMonth() === endDate.getMonth()) {
          return `${month} ${startDay}-${endDay}, ${year}`;
        } else {
          const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
          const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
          return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
        }
      } else {
        // Month view
        return currentDate.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Convert events to the format needed for the Schedule component
  const upcomingEvents = events
    .filter(event => event.start >= new Date())
    .sort((a, b) => a.start - b.start)
    .map(event => ({
      title: event.title,
      month: event.start.toLocaleString('default', { month: 'short' }),
      day: event.start.getDate(),
      time: `${event.start.getHours()}:${event.start.getMinutes().toString().padStart(2, '0')} - ${event.end.getHours()}:${event.end.getMinutes().toString().padStart(2, '0')}`,
      location: event.location,
      priority: event.raw?.priority || 0
    }));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">My Schedule</h1>
        <div className="text-gray-500">{formatDateRange()}</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main calendar area */}
        <div className="flex-1 flex flex-col">
          {/* Calendar navigation */}
          <div className="flex justify-between items-center p-4 bg-white border-b">
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1 ml-2 hover:bg-gray-100 rounded text-sm"
              >
                Today
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleViewChange('day')}
                className={`px-3 py-1 rounded text-sm ${currentView === 'day' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                Day
              </button>
              <button
                onClick={() => handleViewChange('week')}
                className={`px-3 py-1 rounded text-sm ${currentView === 'week' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                Week
              </button>
              <button
                onClick={() => handleViewChange('month')}
                className={`px-3 py-1 rounded text-sm ${currentView === 'month' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="flex-1 overflow-auto">
            <div ref={calendarContainerRef} className="h-full w-full" />
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