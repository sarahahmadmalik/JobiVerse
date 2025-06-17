'use client'
import React, { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  Users,
  Clock
} from 'lucide-react'
import Schedule from '@/components/dashboard/candidate/home/Schedule'
import { useSession } from 'next-auth/react'
import { interviewService } from '@/services/interview-service'
import Loader from '@/components/ui/loader'

const locales = {
  'en-US': require('date-fns/locale/en-US')
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

const ScheduleView = () => {
  const { data: session } = useSession()
  const [currentView, setCurrentView] = useState(Views.DAY)
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [loading, setLoading] = useState(true)

  const formatInterviewTime = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}`
    } else if (diffDays === 1) {
      return `Tomorrow, ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}`
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getInterviewType = jobTitle => {
    if (!jobTitle) return 'Screening'
    if (jobTitle.toLowerCase().includes('manager')) return 'Behavioral'
    if (jobTitle.toLowerCase().includes('engineer')) return 'Technical'
    return 'Interview'
  }

  // Fetch interviews from API
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        if (!session?.user?.id) return

        const interviews = await interviewService.getInterviewsAsInterviewer(
          session.user.id
        )

        console.log(interviews)

        // Transform the data for the Calendar
        const formattedEvents = interviews.map(interview => ({
          id: interview._id,
          title:
            interview.jobDetails?.jobTitle ||
            `Interview with ${interview.candidates?.[0]?.firstName}`,
          start: new Date(interview.startTime),
          end: new Date(
            interview.endTime ||
              new Date(new Date(interview.startTime).getTime() + 60 * 60000)
          ),
          location: interview.location,
          joinUrl: interview.joinUrl,
          interviewers: interview.interviewers,
          description: interview.notes,
          status: interview.status,
          resource: {
            type: getInterviewType(
              interview.jobDetails?.jobTitle
            ).toLowerCase(),
            color: getColorForStage(interview.stage),
            isZoom: interview.location === 'zoom',
            candidate:
              interview.candidates?.[0]?.firstName +
                interview.candidates?.[0]?.lastName ||
              interview.candidateIds?.[0]?.firstName + ' ' +
                interview.candidateIds?.[0]?.lastName ||
              'Candidate',

            jobDetails: interview.jobDetails
          }
        }))

        setEvents(formattedEvents)
      } catch (error) {
        console.error('Error fetching interviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [session])

  const getColorForStage = stage => {
    const colors = {
      screening: '#4b9bff',
      technical: '#7048e8',
      hr: '#12b886',
      final: '#f76707',
      behavioral: '#ff6b6b'
    }
    return colors[stage?.toLowerCase()] || '#495057'
  }

  // Define handleNavigate function
  const handleNavigate = newDate => {
    setDate(newDate)
  }

  // Define handleView function
  const handleView = newView => {
    setCurrentView(newView)
  }

  const eventStyleGetter = event => {
    const backgroundColor = event.resource.color + '20'
    const borderColor = event.resource.color
    return {
      style: {
        backgroundColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '4px',
        color: '#000',
        border: '0px',
        padding: '2px 4px'
      }
    }
  }

  const handleSelectEvent = event => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const handleJoinMeeting = joinUrl => {
    window.open(joinUrl, '_blank')
  }

  const EventComponent = ({ event }) => (
    <div className='flex flex-col'>
      <div className='font-medium truncate'>{event.title}</div>
      <div className='flex items-center text-xs text-gray-600'>
        <Clock size={12} className='mr-1' />
        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
      </div>
      {event.resource.isZoom && (
        <div className='flex items-center text-xs text-blue-600 mt-1'>
          <Video size={12} className='mr-1' />
          Zoom Meeting
        </div>
      )}
    </div>
  )

  const EventDetailsModal = () => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-xl font-semibold'>{selectedEvent.title}</h2>
          <button
            onClick={() => setShowEventDetails(false)}
            className='text-gray-500 hover:text-gray-700'
          >
            ✕
          </button>
        </div>

        <div className='space-y-4'>
          <div className='flex items-start'>
            <Clock size={16} className='mr-2 mt-1 text-gray-500' />
            <div>
              <p className='text-sm text-gray-500'>Time</p>
              <p>{format(selectedEvent.start, 'EEEE, MMMM d, yyyy')}</p>
              <p>
                {format(selectedEvent.start, 'h:mm a')} -{' '}
                {format(selectedEvent.end, 'h:mm a')}
              </p>
            </div>
          </div>

          {selectedEvent.resource.candidate && (
            <div className='flex items-start'>
              <Users size={16} className='mr-2 mt-1 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Candidate</p>
                <p>
                  {selectedEvent.resource.candidate.firstName}{' '}
                  {selectedEvent.resource.candidate.lastName}
                </p>
              </div>
            </div>
          )}

          {selectedEvent.resource.jobDetails && (
            <div className='flex items-start'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='mr-2 mt-1 text-gray-500'
              >
                <path d='M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8'></path>
                <line x1='16' y1='2' x2='16' y2='6'></line>
                <line x1='8' y1='2' x2='8' y2='6'></line>
                <line x1='3' y1='10' x2='21' y2='10'></line>
                <path d='M16 19a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2z'></path>
              </svg>
              <div>
                <p className='text-sm text-gray-500'>Position</p>
                <p>{selectedEvent.resource.jobDetails.jobTitle}</p>
              </div>
            </div>
          )}

          {selectedEvent.resource.isZoom ? (
            <div className='flex items-start'>
              <Video size={16} className='mr-2 mt-1 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Location</p>
                <p>Zoom Meeting</p>
                {selectedEvent.joinUrl && (
                  <button
                    onClick={() => handleJoinMeeting(selectedEvent.joinUrl)}
                    className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm'
                  >
                    Join Meeting
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className='flex items-start'>
              <MapPin size={16} className='mr-2 mt-1 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Location</p>
                <p>{selectedEvent.location || 'Office'}</p>
              </div>
            </div>
          )}

          {selectedEvent.interviewers && selectedEvent.interviewers.length > 0 && (
            <div className='flex items-start'>
              <Users size={16} className='mr-2 mt-1 text-gray-500' />
              <div>
                <p className='text-sm text-gray-500'>Interviewers</p>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {selectedEvent.interviewers.map((interviewer, i) => (
                    <span
                      key={i}
                      className='px-2 py-1 bg-gray-100 rounded text-sm'
                    >
                      {interviewer.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedEvent.description && (
            <div className='flex items-start'>
              <div>
                <p className='text-sm text-gray-500'>Notes</p>
                <p className='mt-1'>{selectedEvent.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  console.log(events)

  const upcomingEvents = events
    // .filter(event => event.start >= new Date())
    // .sort((a, b) => a.start - b.start)
    .map(event => ({
      id: event.id,
      candidate:
        event.resource?.candidate,
      role: event.resource.jobDetails?.jobTitle || 'Position',
      time: formatInterviewTime(event.start),
      type:
        event.resource.type ||
        getInterviewType(event.resource.jobDetails?.jobTitle),
      interviewers: event.interviewers?.map(i => i.name) || [],
      status: event.status === 'scheduled' ? 'Invited' : event.status,
      meetingType: event.resource.isZoom ? 'Zoom' : 'In-Person',
      meetingLink: event.joinUrl,
      location: event.resource.isZoom
        ? 'Virtual Meeting'
        : event.resource.address || 'Office',
      // Additional fields needed for Schedule component
      month: format(event.start, 'MMM'),
      day: format(event.start, 'd'),
      priority: 0
    }))

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full bg-gray-50'>
      <div className='flex justify-between items-center p-4 bg-white border-b'>
        <h1 className='text-lg md:text-xl font-semibold text-gray-900'>
          Interview Schedule
        </h1>
        <div className='text-gray-500'>
          {format(date, 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        <div className='flex-1 flex flex-col'>
          <div className='flex justify-between items-center p-4 bg-white border-b'>
            <div className='flex gap-2'>
              <button
                onClick={() =>
                  handleNavigate(new Date(date.setDate(date.getDate() - 1)))
                }
                className='p-2 hover:bg-gray-100 rounded-full'
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleNavigate(new Date())}
                className='px-3 py-1 hover:bg-gray-100 rounded text-sm'
              >
                Today
              </button>
              <button
                onClick={() =>
                  handleNavigate(new Date(date.setDate(date.getDate() + 1)))
                }
                className='p-2 hover:bg-gray-100 rounded-full'
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className='flex gap-2'>
              <button
                onClick={() => handleView(Views.DAY)}
                className={`px-3 py-1 rounded text-sm ${
                  currentView === Views.DAY
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => handleView(Views.WEEK)}
                className={`px-3 py-1 rounded text-sm ${
                  currentView === Views.WEEK
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                Week
              </button>
            </div>
          </div>

          <div className='flex-1 overflow-auto'>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor='start'
              endAccessor='end'
              style={{ height: '100%' }}
              view={currentView}
              date={date}
              onNavigate={handleNavigate}
              onView={handleView}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent
              }}
              views={[Views.DAY, Views.WEEK]}
              defaultView={Views.DAY}
              toolbar={false}
              min={new Date(0, 0, 0, 8, 0, 0)}
              max={new Date(0, 0, 0, 20, 0, 0)}
            />
          </div>
        </div>

        <div className='w-80 border-l bg-white p-2 overflow-y-auto'>
          {/* <h3 className="font-semibold mb-4">Upcoming Interviews</h3> */}
          <Schedule events={upcomingEvents} />
        </div>
      </div>

      {showEventDetails && selectedEvent && <EventDetailsModal />}
    </div>
  )
}

export default ScheduleView
