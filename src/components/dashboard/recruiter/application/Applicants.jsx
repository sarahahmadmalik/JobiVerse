"use client";
import React, { useState } from 'react';
import { 
  MoreVertical, ChevronLeft, ChevronRight, Filter, Search, 
  X, Check, User, FileText, Calendar, Clock, Sliders, Mail, Send, Clock3
} from 'lucide-react';

const JobApplicantsDashboard = () => {
  // Sample data with interview tracking
  const [applications, setApplications] = useState([
    { id: 1, name: 'Justin Septimus', email: 'justin@example.com', status: 'New', 
      skillMatches: 4, submittedOn: '14/03/2025', isShortlisted: false, experience: '3-5 years', 
      location: 'New York', education: 'Bachelor\'s', noticePeriod: '1 month',
      interviewScheduled: false, interviewDate: '', interviewStage: '', emailSent: false },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'Shortlisted', 
      skillMatches: 8, submittedOn: '13/03/2025', isShortlisted: true, experience: '5-7 years', 
      location: 'San Francisco', education: 'Master\'s', noticePeriod: 'Immediate',
      interviewScheduled: true, interviewDate: '20/03/2025 10:00 AM', interviewStage: 'Technical', emailSent: true },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', status: 'Rejected', 
      skillMatches: 5, submittedOn: '12/03/2025', isShortlisted: false, experience: '2-3 years', 
      location: 'Remote', education: 'Bachelor\'s', noticePeriod: '2 months',
      interviewScheduled: false, interviewDate: '', interviewStage: '', emailSent: false },
    { id: 4, name: 'Emily Rodriguez', email: 'emily@example.com', status: 'Interview', 
      skillMatches: 7, submittedOn: '11/03/2025', isShortlisted: true, experience: '7-10 years', 
      location: 'Chicago', education: 'PhD', noticePeriod: '1 month',
      interviewScheduled: true, interviewDate: '18/03/2025 2:30 PM', interviewStage: 'Final', emailSent: true },
    { id: 5, name: 'David Kim', email: 'david@example.com', status: 'New', 
      skillMatches: 3, submittedOn: '10/03/2025', isShortlisted: false, experience: '1-2 years', 
      location: 'Boston', education: 'Bachelor\'s', noticePeriod: 'Immediate',
      interviewScheduled: false, interviewDate: '', interviewStage: '', emailSent: false },
    { id: 6, name: 'Jessica Williams', email: 'jessica@example.com', status: 'Shortlisted', 
      skillMatches: 6, submittedOn: '09/03/2025', isShortlisted: true, experience: '4-5 years', 
      location: 'Remote', education: 'Master\'s', noticePeriod: '1 month',
      interviewScheduled: false, interviewDate: '', interviewStage: '', emailSent: false }
  ]);

  // State management
  const [activeTab, setActiveTab] = useState('All');
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [emailContent, setEmailContent] = useState('');
  const [interviewDetails, setInterviewDetails] = useState({
    date: '',
    time: '',
    stage: 'Technical',
    interviewer: '',
    notes: ''
  });

  const [filters, setFilters] = useState({
    status: [],
    experience: [],
    location: [],
    education: [],
    noticePeriod: [],
    skillsMatchMin: 0,
    dateRange: { start: '', end: '' }
  });

  // Filter options
  const statusOptions = ['New', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];
  const experienceOptions = ['0-1 years', '1-2 years', '2-3 years', '3-5 years', '5-7 years', '7-10 years', '10+ years'];
  const locationOptions = ['Remote', 'New York', 'San Francisco', 'Chicago', 'Boston', 'Other'];
  const educationOptions = ['High School', 'Bachelor\'s', 'Master\'s', 'PhD'];
  const noticePeriodOptions = ['Immediate', '1 month', '2 months', '3 months'];
  const interviewStages = ['Screening', 'Technical', 'HR', 'Final'];

  // Filter applications
  const filteredApplications = applications.filter(application => {
    // Tab filter
    const matchesTab = activeTab === 'All' || 
                      (activeTab === 'Shortlisted' && application.isShortlisted);
    
    // Search filter
    const matchesSearch = searchTerm === '' || 
                         application.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         application.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         application.submittedOn.includes(searchTerm);
    
    // Status filter
    const matchesStatus = filters.status.length === 0 || 
                         filters.status.includes(application.status);
    
    // Experience filter
    const matchesExperience = filters.experience.length === 0 || 
                            filters.experience.includes(application.experience);
    
    // Location filter
    const matchesLocation = filters.location.length === 0 || 
                          filters.location.includes(application.location);
    
    // Education filter
    const matchesEducation = filters.education.length === 0 || 
                           filters.education.includes(application.education);
    
    // Notice period filter
    const matchesNoticePeriod = filters.noticePeriod.length === 0 || 
                              filters.noticePeriod.includes(application.noticePeriod);
    
    // Skills match filter
    const matchesSkills = application.skillMatches >= filters.skillsMatchMin;
    
    // Date range filter
    const matchesDateRange = filters.dateRange.start === '' || 
                            (application.submittedOn >= filters.dateRange.start && 
                             (filters.dateRange.end === '' || application.submittedOn <= filters.dateRange.end));

    return matchesTab && matchesSearch && matchesStatus && matchesExperience && 
           matchesLocation && matchesEducation && matchesNoticePeriod && 
           matchesSkills && matchesDateRange;
  });

  // Pagination
  const totalApplications = filteredApplications.length;
  const totalPages = Math.ceil(totalApplications / rowsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handlers
  const handleActionClick = (id, e) => {
    e.stopPropagation();
    setOpenActionMenu(openActionMenu === id ? null : id);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedApplicants([]);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Selection handlers
  const toggleSelectApplicant = (id) => {
    setSelectedApplicants(prev => 
      prev.includes(id) 
        ? prev.filter(appId => appId !== id) 
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedApplicants.length === paginatedApplications.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(paginatedApplications.map(app => app.id));
    }
  };

  // Bulk actions
  const bulkShortlist = () => {
    setApplications(applications.map(app => 
      selectedApplicants.includes(app.id) ? { ...app, isShortlisted: true, status: 'Shortlisted' } : app
    ));
    setSelectedApplicants([]);
  };

  const bulkReject = () => {
    setApplications(applications.map(app => 
      selectedApplicants.includes(app.id) ? { ...app, isShortlisted: false, status: 'Rejected' } : app
    ));
    setSelectedApplicants([]);
  };

  const bulkSendEmail = () => {
    setApplications(applications.map(app => 
      selectedApplicants.includes(app.id) ? { ...app, emailSent: true } : app
    ));
    setSelectedApplicants([]);
    setShowEmailModal(true);
  };

  const bulkScheduleInterview = () => {
    setShowScheduleModal(true);
  };

  // Individual actions
  const openEmailModal = (applicant) => {
    setCurrentApplicant(applicant);
    setShowEmailModal(true);
  };

  const openScheduleModal = (applicant) => {
    setCurrentApplicant(applicant);
    setShowScheduleModal(true);
  };

  const sendEmail = () => {
    if (currentApplicant) {
      setApplications(applications.map(app => 
        app.id === currentApplicant.id ? { ...app, emailSent: true } : app
      ));
    }
    setShowEmailModal(false);
    setCurrentApplicant(null);
    setEmailContent('');
  };

  const scheduleInterview = () => {
    const interviewDate = `${interviewDetails.date} ${interviewDetails.time}`;
    const status = interviewDetails.stage === 'Final' ? 'Interview' : 'Shortlisted';
    
    if (currentApplicant) {
      setApplications(applications.map(app => 
        app.id === currentApplicant.id ? { 
          ...app, 
          interviewScheduled: true,
          interviewDate,
          interviewStage: interviewDetails.stage,
          status
        } : app
      ));
    }
    setShowScheduleModal(false);
    setCurrentApplicant(null);
    setInterviewDetails({
      date: '',
      time: '',
      stage: 'Technical',
      interviewer: '',
      notes: ''
    });
  };

  // Filter handlers
  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({
      status: [],
      experience: [],
      location: [],
      education: [],
      noticePeriod: [],
      skillsMatchMin: 0,
      dateRange: { start: '', end: '' }
    });
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1);
  };

  // Filter modal component
  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Filter Applicants</h3>
          <button onClick={() => setShowFilters(false)} className="text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-medium mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
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
            <h4 className="text-sm font-medium mb-2">Experience</h4>
            <div className="flex flex-wrap gap-2">
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
            <h4 className="text-sm font-medium mb-2">Location</h4>
            <div className="flex flex-wrap gap-2">
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
            <h4 className="text-sm font-medium mb-2">Education</h4>
            <div className="flex flex-wrap gap-2">
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
            <h4 className="text-sm font-medium mb-2">Notice Period</h4>
            <div className="flex flex-wrap gap-2">
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
            <h4 className="text-sm font-medium mb-2">Minimum Skills Match</h4>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="10"
                value={filters.skillsMatchMin}
                onChange={(e) => setFilters({...filters, skillsMatchMin: parseInt(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm font-medium">{filters.skillsMatchMin}/10</span>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h4 className="text-sm font-medium mb-2">Application Date Range</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value}})}
                  className="w-full border rounded-md p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value}})}
                  className="w-full border rounded-md p-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-between">
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Clear All
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-colors-primary text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  // Email Modal
  const EmailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {currentApplicant ? `Send Email to ${currentApplicant.name}` : 'Send Email to Selected Candidates'}
          </h3>
          <button onClick={() => {
            setShowEmailModal(false);
            setCurrentApplicant(null);
            setEmailContent('');
          }} className="text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input 
              type="text" 
              className="w-full border rounded-md p-2 text-sm" 
              placeholder="Job Application Update"
              defaultValue="Regarding Your Job Application"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Content</label>
            <textarea 
              className="w-full border rounded-md p-2 text-sm h-40" 
              placeholder="Write your email content here..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={() => {
              setShowEmailModal(false);
              setCurrentApplicant(null);
              setEmailContent('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={sendEmail}
            className="px-4 py-2 bg-colors-ptext-colors-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Send size={16} /> Send Email
          </button>
        </div>
      </div>
    </div>
  );

  // Schedule Interview Modal
  const ScheduleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {currentApplicant ? `Schedule Interview with ${currentApplicant.name}` : 'Schedule Interviews with Selected Candidates'}
          </h3>
          <button onClick={() => {
            setShowScheduleModal(false);
            setCurrentApplicant(null);
            setInterviewDetails({
              date: '',
              time: '',
              stage: 'Technical',
              interviewer: '',
              notes: ''
            });
          }} className="text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                className="w-full border rounded-md p-2 text-sm" 
                value={interviewDetails.date}
                onChange={(e) => setInterviewDetails({...interviewDetails, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input 
                type="time" 
                className="w-full border rounded-md p-2 text-sm" 
                value={interviewDetails.time}
                onChange={(e) => setInterviewDetails({...interviewDetails, time: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Stage</label>
            <select 
              className="w-full border rounded-md p-2 text-sm"
              value={interviewDetails.stage}
              onChange={(e) => setInterviewDetails({...interviewDetails, stage: e.target.value})}
            >
              {interviewStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
            <input 
              type="text" 
              className="w-full border rounded-md p-2 text-sm" 
              placeholder="Name of interviewer"
              value={interviewDetails.interviewer}
              onChange={(e) => setInterviewDetails({...interviewDetails, interviewer: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              className="w-full border rounded-md p-2 text-sm h-20" 
              placeholder="Any additional notes..."
              value={interviewDetails.notes}
              onChange={(e) => setInterviewDetails({...interviewDetails, notes: e.target.value})}
            ></textarea>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={() => {
              setShowScheduleModal(false);
              setCurrentApplicant(null);
              setInterviewDetails({
                date: '',
                time: '',
                stage: 'Technical',
                interviewer: '',
                notes: ''
              });
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={scheduleInterview}
            className="px-4 py-2 bg-colors-ptext-colors-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Calendar size={16} /> Schedule Interview
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6 w-full max-w-6xl mx-auto">
      {/* Modals */}
      {showFilters && <FilterModal />}
      {showEmailModal && <EmailModal />}
      {showScheduleModal && <ScheduleModal />}

      {/* Bulk Actions Bar */}
      {selectedApplicants.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Check className="text-colors-ptext-colors-primary" size={18} />
            <span className="text-sm font-medium">
              {selectedApplicants.length} selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={bulkShortlist}
              className="px-3 py-1 bg-colors-ptext-colors-primary text-white text-sm rounded-md hover:bg-blue-700 flex items-center gap-1"
            >
              <User size={16} /> Shortlist
            </button>
            <button
              onClick={bulkReject}
              className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100 flex items-center gap-1"
            >
              <X size={16} /> Reject
            </button>
            <button
              onClick={bulkSendEmail}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center gap-1"
            >
              <Mail size={16} /> Send Email
            </button>
            <button
              onClick={bulkScheduleInterview}
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 flex items-center gap-1"
            >
              <Calendar size={16} /> Schedule Interview
            </button>
          </div>
        </div>
      )}

      {/* Top navigation tabs */}
      <div className="border-b pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex space-x-4 md:space-x-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            className={`whitespace-nowrap pb-2 ${
              activeTab === 'All' 
                ? 'border-b-2 border-colors-primary text-colors-primary font-medium' 
                : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('All')}
          >
            All
          </button>
          <button
            className={`whitespace-nowrap pb-2 ${
              activeTab === 'Shortlisted' 
                ? 'border-b-2 border-colors-primary text-colors-primary font-medium' 
                : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('Shortlisted')}
          >
            Shortlisted
          </button>
        </div>
        <div className="text-sm text-gray-600 whitespace-nowrap">
          Showing: <span className="font-bold">{totalApplications}</span> applicants
        </div>
      </div>

      {/* Search and Filter */}
      <div className="my-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or date"
            className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md shadow-sm text-sm hover:bg-gray-50 w-full md:w-auto justify-center"
        >
          <Sliders size={16} />
          <span>Filters</span>
          {Object.values(filters).some(filter => 
            Array.isArray(filter) ? filter.length > 0 : 
            typeof filter === 'object' ? Object.values(filter).some(Boolean) : 
            filter > 0
          ) && (
            <span className="h-2 w-2 rounded-full bg-colors-ptext-colors-primary"></span>
          )}
        </button>
      </div>

      {/* Applicants List */}
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-full overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    checked={selectedApplicants.length === paginatedApplications.length && paginatedApplications.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300text-colors-primary focus:ring-blue-500"
                  />
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills Match
                </th>
                {activeTab === 'Shortlisted' && (
                  <>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interview Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Sent
                    </th>
                  </>
                )}
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedApplications.length > 0 ? (
                paginatedApplications.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedApplicants.includes(applicant.id)}
                        onChange={() => toggleSelectApplicant(applicant.id)}
                        className="h-4 w-4 rounded border-gray-300text-colors-primary focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                          <div className="text-sm text-gray-500">{applicant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <span className={`h-2 w-2 flex-shrink-0 rounded-full mr-1.5 ${
                          applicant.status === 'Shortlisted' ? 'bg-green-400' :
                          applicant.status === 'Rejected' ? 'bg-red-400' :
                          applicant.status === 'Interview' ? 'bg-blue-400' :
                          'bg-yellow-400'
                        }`}></span>
                        <span className="text-sm text-gray-600">{applicant.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-colors-primary h-2 rounded-full" 
                            style={{ width: `${(applicant.skillMatches / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{applicant.skillMatches}/10</span>
                      </div>
                    </td>
                    {activeTab === 'Shortlisted' && (
                      <>
                        <td className="px-4 py-4">
                          {applicant.interviewScheduled ? (
                            <div className="flex items-center gap-2">
                              <Clock3 size={14} className="text-blue-500" />
                              <div>
                                <div className="text-sm text-gray-900">{applicant.interviewStage}</div>
                                <div className="text-xs text-gray-500">{applicant.interviewDate}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Not scheduled</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {applicant.emailSent ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-4 text-right text-sm relative">
                      <button
                        onClick={(e) => handleActionClick(applicant.id, e)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {openActionMenu === applicant.id && (
                        <div className="absolute right-10 top-0 z-10 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                          <div className="py-1">
                            <button 
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              onClick={() => {
                                setCurrentApplicant(applicant);
                                setOpenActionMenu(null);
                                openEmailModal(applicant);
                              }}
                            >
                              <Mail size={14} /> Send Email
                            </button>
                            <button 
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              onClick={() => {
                                setCurrentApplicant(applicant);
                                setOpenActionMenu(null);
                                openScheduleModal(applicant);
                              }}
                            >
                              <Calendar size={14} /> Schedule Interview
                            </button>
                            <button 
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                applicant.isShortlisted 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-colors-ptext-colors-primary hover:bg-blue-50'
                              } flex items-center gap-2`}
                              onClick={() => {
                                setApplications(applications.map(app => 
                                  app.id === applicant.id 
                                    ? { ...app, isShortlisted: !app.isShortlisted, 
                                        status: app.isShortlisted ? 'New' : 'Shortlisted' } 
                                    : app
                                ));
                                setOpenActionMenu(null);
                              }}
                            >
                              {applicant.isShortlisted ? (
                                <>
                                  <X size={14} /> Remove from Shortlist
                                </>
                              ) : (
                                <>
                                  <Check size={14} /> Shortlist Candidate
                                </>
                              )}
                            </button>
                            <button 
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              onClick={() => {
                                setApplications(applications.map(app => 
                                  app.id === applicant.id 
                                    ? { ...app, isShortlisted: false, status: 'Rejected' } 
                                    : app
                                ));
                                setOpenActionMenu(null);
                              }}
                            >
                              <X size={14} /> Reject Candidate
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === 'Shortlisted' ? 7 : 5} className="px-4 py-6 text-center text-gray-500">
                    No applications found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border-gray-300 rounded-md text-sm py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalApplications)} of ${totalApplications}`}
          </span>
          <div className="flex space-x-1">
            <button 
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicantsDashboard;