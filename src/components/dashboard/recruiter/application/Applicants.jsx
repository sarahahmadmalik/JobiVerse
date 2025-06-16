'use client'
import React, { useState } from 'react'
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
  Check,
  User,
  FileText,
  Calendar,
  Clock,
  Sliders,
  Mail,
  Send,
  Clock3,
  File
} from 'lucide-react'
import Input from '@/components/ui/input'
import Dropdown from '@/components/ui/dropdown'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { toolbarPlugin } from '@react-pdf-viewer/toolbar'
import { applicationService } from '@/services/applicant-service'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/toolbar/lib/styles/index.css'
import { useSession } from 'next-auth/react'
import Spinner from '@/components/ui/spinner'

const JobApplicantsDashboard = ({ applicants = [], jobId }) => {
  const { data: session } = useSession()
  // Transform received applicants data
  const transformedApplications = applicants.map(applicant => ({
    id: applicant._id,
    name: applicant.candidateDetails?.name || 'Unknown Candidate',
    email: applicant.candidateDetails?.email || 'N/A',
    status: applicant.status || 'Submitted',
    skillMatches: Math.floor(Math.random() * 4) + 7,
    submittedOn: new Date(
      applicant.appliedAt || applicant.createdAt
    ).toLocaleDateString('en-GB'),
    isShortlisted: ['Shortlisted', 'Interview'].includes(applicant.status),
    experience: ['1-2 years', '2-3 years', '3-5 years', '5-7 years'][
      Math.floor(Math.random() * 4)
    ],
    location: ['Remote', 'New York', 'San Francisco', 'Chicago'][
      Math.floor(Math.random() * 4)
    ],
    education: ["Bachelor's", "Master's"][Math.floor(Math.random() * 2)],
    noticePeriod: ['Immediate', '1 month', '2 months'][
      Math.floor(Math.random() * 3)
    ],
    interviewScheduled: applicant.status === 'Interview',
    interviewDate:
      applicant.status === 'Interview'
        ? new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : '',
    interviewStage:
      applicant.status === 'Interview'
        ? ['Technical', 'HR', 'Final'][Math.floor(Math.random() * 3)]
        : '',
    emailSent: applicant.emailSent || false,
    resumeLink: applicant.documents?.resume?.resumeLink || '',
    resumeName: applicant.documents?.resume?.fileName || 'Resume'
  }))

  // State management
  const [applications, setApplications] = useState(transformedApplications)
  const [activeTab, setActiveTab] = useState('All')
  const [openActionMenu, setOpenActionMenu] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApplicants, setSelectedApplicants] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [currentResume, setCurrentResume] = useState(null)
  const [currentApplicant, setCurrentApplicant] = useState(null)
  const [emailContent, setEmailContent] = useState('')
  const [interviewDetails, setInterviewDetails] = useState({
    date: '',
    time: '',
    stage: 'Technical',
    interviewer: '',
    notes: ''
  })

  const [filters, setFilters] = useState({
    status: [],
    experience: [],
    location: [],
    education: [],
    noticePeriod: [],
    skillsMatchMin: 0,
    dateRange: { start: '', end: '' }
  })

  // PDF Viewer plugins
  const toolbarPluginInstance = toolbarPlugin()
  const { Toolbar } = toolbarPluginInstance

  // Filter options
  const statusOptions = [
    'Submitted',
    'Shortlisted',
    'Interview',
    'Rejected',
    'Hired'
  ]
  const experienceOptions = [
    '0-1 years',
    '1-2 years',
    '2-3 years',
    '3-5 years',
    '5-7 years',
    '7-10 years',
    '10+ years'
  ]
  const locationOptions = [
    'Remote',
    'New York',
    'San Francisco',
    'Chicago',
    'Boston',
    'Other'
  ]
  const educationOptions = ['High School', "Bachelor's", "Master's", 'PhD']
  const noticePeriodOptions = ['Immediate', '1 month', '2 months', '3 months']
  const interviewStages = ['Screening', 'Technical', 'HR', 'Final']

  // Filter applications
  const filteredApplications = applications.filter(application => {
    // Tab filter
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Shortlisted' && application.isShortlisted)

    // Search filter
    const matchesSearch =
      searchTerm === '' ||
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.submittedOn.includes(searchTerm)

    // Status filter
    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(application.status)

    // Experience filter
    const matchesExperience =
      filters.experience.length === 0 ||
      filters.experience.includes(application.experience)

    // Location filter
    const matchesLocation =
      filters.location.length === 0 ||
      filters.location.includes(application.location)

    // Education filter
    const matchesEducation =
      filters.education.length === 0 ||
      filters.education.includes(application.education)

    // Notice period filter
    const matchesNoticePeriod =
      filters.noticePeriod.length === 0 ||
      filters.noticePeriod.includes(application.noticePeriod)

    // Skills match filter
    const matchesSkills = application.skillMatches >= filters.skillsMatchMin

    // Date range filter
    const matchesDateRange =
      filters.dateRange.start === '' ||
      (application.submittedOn >= filters.dateRange.start &&
        (filters.dateRange.end === '' ||
          application.submittedOn <= filters.dateRange.end))

    return (
      matchesTab &&
      matchesSearch &&
      matchesStatus &&
      matchesExperience &&
      matchesLocation &&
      matchesEducation &&
      matchesNoticePeriod &&
      matchesSkills &&
      matchesDateRange
    )
  })

  // Pagination
  const totalApplications = filteredApplications.length
  const totalPages = Math.ceil(totalApplications / rowsPerPage)
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

const openResumeViewer = async (resumeLink, applicantName, applicantId) => {
  try {
    // Find the applicant in current state
    const applicant = applications.find(app => app.id === applicantId);
    
    // Only update status if not already Shortlisted or Interview
    if (applicant && !['Shortlisted', 'Interview'].includes(applicant.status)) {
      // Update status to "Viewed" in the backend
      await updateApplicantStatus([applicantId], 'Reviewed');
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === applicantId ? { ...app, status: 'Reviewed' } : app
      ));
    }
    
    // Open resume viewer
    setCurrentResume({
      link: resumeLink,
      name: applicantName
    });
    setShowResumeModal(true);
  } catch (error) {
    console.error('Failed to update status:', error);
    // Still open the resume viewer even if status update fails
    setCurrentResume({
      link: resumeLink,
      name: applicantName
    });
    setShowResumeModal(true);
  }
};

  // Close resume viewer
  const closeResumeViewer = () => {
    setShowResumeModal(false)
    setCurrentResume(null)
  }

  // Handlers
  const handleActionClick = (id, e) => {
    e.stopPropagation()
    setOpenActionMenu(openActionMenu === id ? null : id)
  }

  const handleTabChange = tab => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSelectedApplicants([])
  }

  const handleSearch = e => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleRowsPerPageChange = e => {
    setRowsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))
  const goToNextPage = () =>
    setCurrentPage(prev => Math.min(prev + 1, totalPages))

  // Selection handlers
  const toggleSelectApplicant = id => {
    setSelectedApplicants(prev =>
      prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedApplicants.length === paginatedApplications.length) {
      setSelectedApplicants([])
    } else {
      setSelectedApplicants(paginatedApplications.map(app => app.id))
    }
  }

  // Updated bulk actions
  const bulkShortlist = async () => {
    try {
      await applicationService.updateApplicantsStatus(
        selectedApplicants,
        'Shortlisted'
      )
      setApplications(
        applications.map(app =>
          selectedApplicants.includes(app.id)
            ? { ...app, status: 'Shortlisted' }
            : app
        )
      )
      setSelectedApplicants([])
    } catch (error) {
      // Handle error (you might want to show a toast notification)
      console.error('Failed to shortlist applicants:', error)
    }
  }

  const bulkReject = async () => {
    try {
      await updateApplicantStatus(selectedApplicants, 'Rejected')
      setApplications(
        applications.map(app =>
          selectedApplicants.includes(app.id)
            ? { ...app, status: 'Rejected' }
            : app
        )
      )
      setSelectedApplicants([])
    } catch (error) {
      // Handle error
      console.error('Failed to reject applicants:', error)
    }
  }

  const bulkSendEmail = () => {
    // Get emails of selected applicants
    const selectedEmails = applications
      .filter(app => selectedApplicants.includes(app.id))
      .map(app => app.email)
      .filter(email => email && email !== 'N/A') // Filter out invalid emails

    if (selectedEmails.length === 0) {
      alert('No valid email addresses selected')
      return
    }

    // Create mailto link
    const mailtoLink = `mailto:${selectedEmails.join(',')}`

    // Open default mail client
    window.location.href = mailtoLink

    // Clear selection (optional)
    setSelectedApplicants([])
  }

  const bulkScheduleInterview = () => {
    setShowScheduleModal(true)
  }

  // Individual actions
  const openEmailModal = applicant => {
    setCurrentApplicant(applicant)
    setShowEmailModal(true)
  }

  const openScheduleModal = applicant => {
    setCurrentApplicant(applicant)
    setShowScheduleModal(true)
  }

  const sendEmail = email => {
    if (!email || email === 'N/A') {
      alert('No valid email address for this applicant')
      return
    }
    window.location.href = `mailto:${email}`
  }

  const scheduleInterview = () => {
    const interviewDate = `${interviewDetails.date} ${interviewDetails.time}`
    const status =
      interviewDetails.stage === 'Final' ? 'Interview' : 'Shortlisted'

    if (currentApplicant) {
      setApplications(
        applications.map(app =>
          app.id === currentApplicant.id
            ? {
                ...app,
                interviewScheduled: true,
                interviewDate,
                interviewStage: interviewDetails.stage,
                status
              }
            : app
        )
      )
    }
    setShowScheduleModal(false)
    setCurrentApplicant(null)
    setInterviewDetails({
      date: '',
      time: '',
      stage: 'Technical',
      interviewer: '',
      notes: ''
    })
  }

  // Filter handlers
  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      status: [],
      experience: [],
      location: [],
      education: [],
      noticePeriod: [],
      skillsMatchMin: 0,
      dateRange: { start: '', end: '' }
    })
    setCurrentPage(1)
  }

  const applyFilters = () => {
    setShowFilters(false)
    setCurrentPage(1)
  }

  // Filter modal component
  const FilterModal = () => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='p-4 border-b flex justify-between items-center'>
          <h3 className='text-lg font-medium'>Filter Applicants</h3>
          <button
            onClick={() => setShowFilters(false)}
            className='text-gray-500'
          >
            <X size={20} />
          </button>
        </div>

        <div className='p-4 space-y-6'>
          {/* Status Filter */}
          <div>
            <h4 className='text-sm font-medium mb-2'>Status</h4>
            <div className='flex flex-wrap gap-2'>
              {statusOptions.map(status => (
                <button
                  key={status}
                  onClick={() => toggleFilter('status', status)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.status.includes(status)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Filter */}
          <div>
            <h4 className='text-sm font-medium mb-2'>Experience</h4>
            <div className='flex flex-wrap gap-2'>
              {experienceOptions.map(exp => (
                <button
                  key={exp}
                  onClick={() => toggleFilter('experience', exp)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.experience.includes(exp)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h4 className='text-sm font-medium mb-2'>Location</h4>
            <div className='flex flex-wrap gap-2'>
              {locationOptions.map(loc => (
                <button
                  key={loc}
                  onClick={() => toggleFilter('location', loc)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.location.includes(loc)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Education Filter */}
          <div>
            <h4 className='text-sm font-medium mb-2'>Education</h4>
            <div className='flex flex-wrap gap-2'>
              {educationOptions.map(edu => (
                <button
                  key={edu}
                  onClick={() => toggleFilter('education', edu)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.education.includes(edu)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  {edu}
                </button>
              ))}
            </div>
          </div>

          {/* Notice Period Filter */}
          <div>
            <h4 className='text-sm font-medium mb-2'>Notice Period</h4>
            <div className='flex flex-wrap gap-2'>
              {noticePeriodOptions.map(np => (
                <button
                  key={np}
                  onClick={() => toggleFilter('noticePeriod', np)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.noticePeriod.includes(np)
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  {np}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Match Filter */}
          <div>
            <h4 className='text-sm font-medium mb-2'>Minimum Skills Match</h4>
            <div className='flex items-center gap-4'>
              <input
                type='range'
                min='0'
                max='10'
                value={filters.skillsMatchMin}
                onChange={e =>
                  setFilters({
                    ...filters,
                    skillsMatchMin: parseInt(e.target.value)
                  })
                }
                className='w-full'
              />
              <span className='text-sm font-medium'>
                {filters.skillsMatchMin}/10
              </span>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h4 className='text-sm font-medium mb-2'>Application Date Range</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>From</label>
                <input
                  type='date'
                  value={filters.dateRange.start}
                  onChange={e =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: e.target.value }
                    })
                  }
                  className='w-full border rounded-md p-2 text-sm'
                />
              </div>
              <div>
                <label className='block text-xs text-gray-500 mb-1'>To</label>
                <input
                  type='date'
                  value={filters.dateRange.end}
                  onChange={e =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: e.target.value }
                    })
                  }
                  className='w-full border rounded-md p-2 text-sm'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='p-4 border-t flex justify-between'>
          <button
            onClick={clearAllFilters}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50'
          >
            Clear All
          </button>
          <button
            onClick={applyFilters}
            className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700'
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )

  // Email Modal
  const EmailModal = () => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-2xl'>
        <div className='p-4 border-b flex justify-between items-center'>
          <h3 className='text-lg font-medium'>
            {currentApplicant
              ? `Send Email to ${currentApplicant.name}`
              : 'Send Email to Selected Candidates'}
          </h3>
          <button
            onClick={() => {
              setShowEmailModal(false)
              setCurrentApplicant(null)
              setEmailContent('')
            }}
            className='text-gray-500'
          >
            <X size={20} />
          </button>
        </div>

        <div className='p-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Subject
            </label>
            <input
              type='text'
              className='w-full border rounded-md p-2 text-sm'
              placeholder='Job Application Update'
              defaultValue='Regarding Your Job Application'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email Content
            </label>
            <textarea
              className='w-full border rounded-md p-2 text-sm h-40'
              placeholder='Write your email content here...'
              value={emailContent}
              onChange={e => setEmailContent(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className='p-4 border-t flex justify-end gap-2'>
          <button
            onClick={() => {
              setShowEmailModal(false)
              setCurrentApplicant(null)
              setEmailContent('')
            }}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            onClick={sendEmail}
            className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2'
          >
            <Send size={16} /> Send Email
          </button>
        </div>
      </div>
    </div>
  )

const ScheduleModal = () => {
  const [duration, setDuration] = useState(60); // Default 60 minutes
  const [isScheduling, setIsScheduling] = useState(false);
  const [interviewers, setInterviewers] = useState([]);
  const [newInterviewer, setNewInterviewer] = useState({
    name: '',
    email: ''
  });
  const [locationType, setLocationType] = useState('zoom'); // Default to zoom
  const [address, setAddress] = useState('');

  const handleAddInterviewer = () => {
    if (newInterviewer.name && newInterviewer.email) {
      setInterviewers([...interviewers, {
        name: newInterviewer.name,
        email: newInterviewer.email.toLowerCase()
      }]);
      setNewInterviewer({ name: '', email: '' });
    }
  };

  const handleRemoveInterviewer = (index) => {
    setInterviewers(interviewers.filter((_, i) => i !== index));
  };

const handleSchedule = async () => {
    if (!interviewDetails.date || !interviewDetails.time || interviewers.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    if (locationType !== 'zoom' && !address) {
      alert('Please provide the interview address');
      return;
    }

       console.log(session.user.id)

    setIsScheduling(true);
    try {
      const startTime = new Date(`${interviewDetails.date}T${interviewDetails.time}:00`).toISOString();
   
      
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          recruiterId: session.user.id, // Using NextAuth session user ID
          candidateIds: currentApplicant ? [currentApplicant.id] : selectedApplicants,
          startTime,
          duration,
          interviewers: interviewers.map(int => ({
            name: int.name,
            email: int.email.toLowerCase()
          })),
          notes: interviewDetails.notes,
          stage: interviewDetails.stage || 'Technical',
          location: locationType,
          address: locationType !== 'zoom' ? address : undefined,
          status: 'scheduled'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to schedule interview');
      }

      const interview = await response.json();

      setApplications(applications.map(app => 
        (currentApplicant ? [currentApplicant.id] : selectedApplicants).includes(app.id)
          ? { 
              ...app, 
              status: 'Interview',
              interviewDate: `${interviewDetails.date} ${interviewDetails.time}`,
              interviewStage: interviewDetails.stage || 'Technical',
              zoomLink: locationType === 'zoom' ? interview.joinUrl : undefined,
              interviewLocation: locationType !== 'zoom' ? address : undefined
            }
          : app
      ));

      setShowScheduleModal(false);
      resetForm();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert(`Failed to schedule interview: ${error.message}`);
    } finally {
      setIsScheduling(false);
    }
  };

  const resetForm = () => {
    setInterviewDetails({
      date: '',
      time: '',
      stage: 'Technical',
      notes: ''
    });
    setDuration(60);
    setInterviewers([]);
    setNewInterviewer({ name: '', email: '' });
    setLocationType('zoom');
    setAddress('');
  };

  const stageOptions = [
    { value: 'Screening', label: 'Screening' },
    { value: 'Technical', label: 'Technical' },
    { value: 'HR', label: 'HR' },
    { value: 'Final', label: 'Final' }
  ];

  const locationOptions = [
    { value: 'zoom', label: 'Zoom Meeting' },
    { value: 'in-office', label: 'In-Office' },
    { value: 'onsite', label: 'Onsite' }
  ];

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='p-4 border-b flex justify-between items-center'>
          <h3 className='text-lg font-medium text-colors-textPrimary'>
            {currentApplicant
              ? `Schedule Interview with ${currentApplicant.name}`
              : `Schedule Interview with ${selectedApplicants.length} Candidates`}
          </h3>
          <button
            onClick={() => {
              setShowScheduleModal(false);
              resetForm();
            }}
            className='text-colors-textSecondary'
          >
            <X size={20} />
          </button>
        </div>

        <div className='p-4 space-y-4'>
          {/* Date and Time */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label="Interview Date*"
              type="date"
              value={interviewDetails.date}
              onChange={e => setInterviewDetails({
                ...interviewDetails,
                date: e.target.value
              })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <Input
              label="Interview Time*"
              type="time"
              value={interviewDetails.time}
              onChange={e => setInterviewDetails({
                ...interviewDetails,
                time: e.target.value
              })}
              required
            />
          </div>

          {/* Duration */}
          <Input
            label="Duration (minutes)*"
            type="number"
            min="15"
            max="240"
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            required
          />

          {/* Location Type */}
          <Dropdown
            label="Interview Location*"
            options={locationOptions}
            value={locationType}
            onChange={(value) => setLocationType(value)}
          />

          {/* Address (conditionally shown) */}
          {locationType !== 'zoom' && (
            <div>
              <label className='block text-sm font-medium text-colors-textPrimary mb-1'>
                {locationType === 'in-office' ? 'Office Address*' : 'Onsite Address*'}
              </label>
              <textarea
                className='w-full px-4 py-3 border border-gray-300 rounded-[12px] text-colors-textPrimary placeholder-colors-textSecondary 
                  focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
                  hover:border-gray-400 transition-all duration-200 ease-in-out h-20'
                placeholder={`Enter ${locationType === 'in-office' ? 'office' : 'onsite'} address`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          )}

          {/* Interviewers */}
          <div>
            <label className='block text-sm font-medium text-colors-textPrimary mb-1'>
              Interviewers*
            </label>
            <div className='space-y-2'>
              {interviewers.map((interviewer, index) => (
                <div key={index} className='flex items-center gap-2 p-2 bg-gray-50 rounded'>
                  <div className='flex-1'>
                    <p className='font-medium text-colors-textPrimary'>{interviewer.name}</p>
                    <p className='text-sm text-colors-textSecondary'>{interviewer.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveInterviewer(index)}
                    className='text-red-500 hover:text-red-700'
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-2'>
                <Input
                  placeholder='Interviewer Name'
                  value={newInterviewer.name}
                  onChange={e => setNewInterviewer({
                    ...newInterviewer,
                    name: e.target.value
                  })}
                />
                <div className='flex gap-2'>
                  <Input
                    placeholder='Interviewer Email'
                    type="email"
                    value={newInterviewer.email}
                    onChange={e => setNewInterviewer({
                      ...newInterviewer,
                      email: e.target.value
                    })}
                    className="flex-1"
                  />
                  <button
                    onClick={handleAddInterviewer}
                    className='px-3 py-2 bg-colors-primary text-colors-secondary rounded-md hover:bg-opacity-90 disabled:opacity-50 transition'
                    disabled={!newInterviewer.name || !newInterviewer.email}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Stage */}
          <Dropdown
            label="Interview Stage"
            options={stageOptions}
            value={interviewDetails.stage}
            onChange={(value) => setInterviewDetails({
              ...interviewDetails,
              stage: value
            })}
          />

          {/* Notes */}
          <div>
            <label className='block text-sm font-medium text-colors-textPrimary mb-1'>
              Notes
            </label>
            <textarea
              className='w-full px-4 py-3 border border-gray-300 rounded-[12px] text-colors-textPrimary placeholder-colors-textSecondary 
                focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
                hover:border-gray-400 transition-all duration-200 ease-in-out h-20'
              placeholder='Any additional notes...'
              value={interviewDetails.notes}
              onChange={e => setInterviewDetails({
                ...interviewDetails,
                notes: e.target.value
              })}
            />
          </div>
        </div>

        <div className='p-4 border-t flex justify-end gap-2'>
          <button
            onClick={() => {
              setShowScheduleModal(false);
              resetForm();
            }}
            className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 text-colors-textPrimary'
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={isScheduling || !interviewDetails.date || !interviewDetails.time || 
                     interviewers.length === 0 || (locationType !== 'zoom' && !address)}
            className='px-4 py-2 bg-colors-primary text-colors-secondary rounded-md text-sm font-medium hover:bg-opacity-90 flex items-center gap-2 disabled:opacity-50 transition'
          >
            {isScheduling ? (
              <>
                Scheduling...
                <Spinner/>
              </>
            ) : (
              <>
                <Calendar size={16} />
                Schedule Interview
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

  // Resume Viewer Modal
  const ResumeViewerModal = () => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-6xl h-[90vh] flex flex-col'>
        <div className='p-4 border-b flex justify-between items-center'>
          <h3 className='text-lg font-medium'>
            {currentResume?.name}'s Resume
          </h3>
          <button onClick={closeResumeViewer} className='text-gray-500'>
            <X size={20} />
          </button>
        </div>

        <div className='flex-1 overflow-hidden'>
          {currentResume?.link ? (
            <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'>
              <div className='border-b p-2 bg-gray-100'>
                <Toolbar>
                  {props => {
                    const {
                      ZoomIn,
                      ZoomOut,
                      CurrentPageInput,
                      NumberOfPages,
                      CurrentScale
                    } = props
                    return (
                      <div className='flex justify-center items-center gap-4'>
                        <div className='flex gap-2 items-center'>
                          <ZoomOut />
                          <CurrentScale>
                            {props => (
                              <span className='text-sm font-medium'>
                                {Math.round(props.scale * 100)}%
                              </span>
                            )}
                          </CurrentScale>
                          <ZoomIn />
                        </div>

                        <div className='flex w-full justify-end items-center gap-2'>
                          Page <CurrentPageInput /> / <NumberOfPages />
                        </div>
                      </div>
                    )
                  }}
                </Toolbar>
              </div>

              <div className='h-[calc(100%-50px)]'>
                <Viewer
                  fileUrl={currentResume.link}
                  plugins={[toolbarPluginInstance]}
                  theme={{ theme: 'auto' }}
                  renderError={error => (
                    <div className='h-full flex flex-col items-center justify-center p-4 text-red-500'>
                      <p>Failed to load PDF</p>
                      <p className='text-sm mt-2'>{error.message}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md'
                      >
                        Retry
                      </button>
                    </div>
                  )}
                  renderLoader={percentages => (
                    <div className='h-full flex flex-col items-center justify-center'>
                      <div className='w-64 bg-gray-200 rounded-full h-2.5'>
                        <div
                          className='bg-blue-600 h-2.5 rounded-full'
                          style={{ width: `${percentages}%` }}
                        ></div>
                      </div>
                      <p className='mt-2 text-gray-600'>
                        Loading {percentages}%
                      </p>
                    </div>
                  )}
                />
              </div>
            </Worker>
          ) : (
            <div className='h-full flex items-center justify-center text-gray-500'>
              No resume available
            </div>
          )}
        </div>

        <div className='p-4 border-t flex justify-end'>
          <button
            onClick={closeResumeViewer}
            className='px-4 py-2 bg-blue-600 text-white rounded-md'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  // Table headers
  const tableHeaders = [
    { name: '', key: 'checkbox', className: 'w-10' },
    { name: 'Candidate', key: 'candidate' },
    { name: 'Status', key: 'status' },
    { name: 'Skills Match', key: 'skills' },
    { name: 'Resume', key: 'resume' },
    ...(activeTab === 'Shortlisted'
      ? [
          { name: 'Interview Status', key: 'interview' },
          { name: 'Email Sent', key: 'email' }
        ]
      : []),
    { name: 'Actions', key: 'actions', className: 'text-right' }
  ]

  return (
    <div className='bg-white rounded-lg shadow p-4 md:p-6 w-full max-w-6xl mx-auto'>
      {/* Modals */}
      {showFilters && <FilterModal />}
      {showEmailModal && <EmailModal />}
      {showScheduleModal && <ScheduleModal />}
      {showResumeModal && <ResumeViewerModal />}

      {/* Bulk Actions Bar */}
      {selectedApplicants.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <Check className='text-blue-600' size={18} />
            <span className='text-sm font-medium'>
              {selectedApplicants.length} selected
            </span>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={bulkShortlist}
              className='px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center gap-1'
            >
              <Check size={16} /> Shortlist Selected
            </button>
            <button
              onClick={bulkReject}
              className='px-3 py-1 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100 flex items-center gap-1'
            >
              <X size={16} /> Reject Selected
            </button>
            <button
              onClick={bulkSendEmail}
              className='px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center gap-1'
            >
              <Mail size={16} /> Email Selected
            </button>
            <button
              onClick={bulkScheduleInterview}
              className='px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 flex items-center gap-1'
            >
              <Calendar size={16} /> Schedule Interview
            </button>
          </div>
        </div>
      )}

      {/* Top navigation tabs */}
      <div className='border-b pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-3'>
        <div className='flex space-x-4 md:space-x-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0'>
          <button
            className={`whitespace-nowrap pb-2 ${
              activeTab === 'All'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('All')}
          >
            All
          </button>
          <button
            className={`whitespace-nowrap pb-2 ${
              activeTab === 'Shortlisted'
                ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('Shortlisted')}
          >
            Shortlisted
          </button>
        </div>
        <div className='text-sm text-gray-600 whitespace-nowrap'>
          Showing: <span className='font-bold'>{totalApplications}</span>{' '}
          applicants
        </div>
      </div>

      {/* Search and Filter */}
      <div className='my-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3'>
        <div className='relative w-full'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-4 w-4 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search by name, email or date'
            className='pl-10 pr-4 py-2 border rounded-md w-full text-sm'
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className='flex items-center gap-2 px-4 py-2 bg-white border rounded-md shadow-sm text-sm hover:bg-gray-50 w-full md:w-auto justify-center'
        >
          <Sliders size={16} />
          <span>Filters</span>
          {Object.values(filters).some(filter =>
            Array.isArray(filter)
              ? filter.length > 0
              : typeof filter === 'object'
              ? Object.values(filter).some(Boolean)
              : filter > 0
          ) && <span className='h-2 w-2 rounded-full bg-blue-600'></span>}
        </button>
      </div>

      {/* Applicants List */}
<div className='mt-4 relative overflow-x-auto'>
  <div className='min-w-full overflow-hidden'>
    <table className='min-w-full divide-y divide-gray-200'>
      <thead className='bg-gray-50'>
        <tr>
          {tableHeaders.map(header => (
            <th
              key={header.key}
              scope='col'
              className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                header.className || ''
              }`}
            >
              {header.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-200'>
        {paginatedApplications.length > 0 ? (
          paginatedApplications.map((applicant, index) => (
            <tr key={applicant.id} className='hover:bg-gray-50'>
              {/* Checkbox */}
              <td className='px-4 py-4'>
                <input
                  type='checkbox'
                  checked={selectedApplicants.includes(applicant.id)}
                  onChange={() => toggleSelectApplicant(applicant.id)}
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
              </td>

              {/* Candidate */}
              <td className='px-4 py-4'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                    <User className='h-5 w-5 text-gray-500' />
                  </div>
                  <div className='ml-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      {applicant.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {applicant.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className='px-4 py-4'>
                <div className='flex items-center'>
                  <span
                    className={`h-2 w-2 flex-shrink-0 rounded-full mr-1.5 ${
                      applicant.status === 'Shortlisted'
                        ? 'bg-green-400'
                        : applicant.status === 'Rejected'
                        ? 'bg-red-400'
                        : applicant.status === 'Interview'
                        ? 'bg-blue-400'
                        : 'bg-yellow-400'
                    }`}
                  ></span>
                  <span className='text-sm text-gray-600'>
                    {applicant.status}
                  </span>
                </div>
              </td>

              {/* Skills Match */}
              <td className='px-4 py-4'>
                <div className='flex items-center'>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full'
                      style={{
                        width: `${(applicant.skillMatches / 10) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className='ml-2 text-sm text-gray-600'>
                    {applicant.skillMatches}/10
                  </span>
                </div>
              </td>

              {/* Resume */}
              <td className='px-4 py-4'>
                {applicant.resumeLink ? (
                  <button
                    onClick={() =>
                      openResumeViewer(
                        applicant.resumeLink,
                        applicant.name
                      )
                    }
                    className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1'
                  >
                    <File size={16} />
                    View Resume
                  </button>
                ) : (
                  <span className='text-sm text-gray-500'>No resume</span>
                )}
              </td>

              {/* Conditional columns for Shortlisted tab */}
              {activeTab === 'Shortlisted' && (
                <>
                  <td className='px-4 py-4'>
                    {applicant.interviewScheduled ? (
                      <div className='flex items-center gap-2'>
                        <Clock3 size={14} className='text-blue-500' />
                        <div>
                          <div className='text-sm text-gray-900'>
                            {applicant.interviewStage}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {applicant.interviewDate}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className='text-sm text-gray-500'>
                        Not scheduled
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-4'>
                    {applicant.emailSent ? (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        Sent
                      </span>
                    ) : (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                        Pending
                      </span>
                    )}
                  </td>
                </>
              )}

              {/* Actions */}
              <td className='px-4 py-4 text-right text-sm relative'>
                <button
                  ref={el => {
                    if (el && openActionMenu === applicant.id) {
                      // Store button position for menu positioning
                      window.actionButtonRect = el.getBoundingClientRect();
                    }
                  }}
                  onClick={e => handleActionClick(applicant.id, e)}
                  className='text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors'
                >
                  <MoreVertical size={20} />
                </button>
                
                {openActionMenu === applicant.id && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setOpenActionMenu(null)}
                    />
                    
                    {/* Action Menu - Fixed positioning to never get cut off */}
                    <div 
                      className="fixed z-50 w-70 bg-white rounded-lg shadow-xl border border-gray-200"
                      style={{
                        top: `${window.actionButtonRect?.bottom - 8 || 0}px`,
                        left: `${(window.actionButtonRect?.right || 0) - 192}px`, // 192px = w-48
                        // maxHeight: `${window.innerHeight - (window.actionButtonRect?.bottom + 16 || 0)}px`,
                        overflowY: 'auto'
                      }}
                    >
                      <div className='py-1'>
                        {applicant.resumeLink && (
                          <button
                            className='block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3'
                            onClick={() => {
                              setCurrentApplicant(applicant)
                              setOpenActionMenu(null)
                              openResumeViewer(
                                applicant.resumeLink,
                                applicant.name
                              )
                            }}
                          >
                            <File size={16} className="text-gray-500" />
                            <span>View Resume</span>
                          </button>
                        )}
                        
                        <button
                          className='block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3'
                          onClick={() => {
                            handleIndividualEmail(applicant.email)
                            setOpenActionMenu(null)
                          }}
                        >
                          <Mail size={16} className="text-gray-500" />
                          <span>Send Email</span>
                        </button>
                        
                        <button
                          className='block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3'
                          onClick={() => {
                            setCurrentApplicant(applicant)
                            setOpenActionMenu(null)
                            openScheduleModal(applicant)
                          }}
                        >
                          <Calendar size={16} className="text-gray-500" />
                          <span>Schedule Interview</span>
                        </button>
                        
                        {/* Divider */}
                        <div className="border-t border-gray-100 my-1" />
                        
                        <button
                          className={`block w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 ${
                            applicant.isShortlisted
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-blue-600 hover:bg-blue-50'
                          }`}
                          onClick={() => {
                            setApplications(
                              applications.map(app =>
                                app.id === applicant.id
                                  ? {
                                      ...app,
                                      isShortlisted: !app.isShortlisted,
                                      status: app.isShortlisted
                                        ? 'Submitted'
                                        : 'Shortlisted'
                                    }
                                  : app
                              )
                            )
                            setOpenActionMenu(null)
                          }}
                        >
                          {applicant.isShortlisted ? (
                            <>
                              <X size={16} />
                              <span>Remove from Shortlist</span>
                            </>
                          ) : (
                            <>
                              <Check size={16} />
                              <span>Shortlist Candidate</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          className='block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3'
                          onClick={() => {
                            setApplications(
                              applications.map(app =>
                                app.id === applicant.id
                                  ? {
                                      ...app,
                                      isShortlisted: false,
                                      status: 'Rejected'
                                    }
                                  : app
                              )
                            )
                            setOpenActionMenu(null)
                          }}
                        >
                          <X size={16} className="text-red-600" />
                          <span>Reject Candidate</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={tableHeaders.length}
              className='px-4 py-6 text-center text-gray-500'
            >
              No applications found matching your criteria
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      {/* Pagination */}
      <div className='mt-4 flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className='flex items-center'>
          <span className='text-sm text-gray-700 mr-2'>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className='border-gray-300 rounded-md text-sm py-1'
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-700'>
            {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
              currentPage * rowsPerPage,
              totalApplications
            )} of ${totalApplications}`}
          </span>
          <div className='flex space-x-1'>
            <button
              className='p-1 rounded-md hover:bg-gray-100 disabled:opacity-50'
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className='p-1 rounded-md hover:bg-gray-100 disabled:opacity-50'
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobApplicantsDashboard
