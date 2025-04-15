"use client";
import { useState } from "react";
// import { useSession } from "next-auth/react";
import ProfileHeader from "@/components/dashboard/candidate/profile/ProfileHeader";
import PersonalInfoSection from "@/components/dashboard/candidate/profile/PersonalInfoSection";
import EducationSection from "@/components/dashboard/candidate/profile/EducationSection";
import ExperienceSection from "@//components/dashboard/candidate/profile/ExperienceSection";
import SkillsSection from "@/components/dashboard/candidate/profile/SkillsSection";
import PortfolioSection from "@/components/dashboard/candidate/profile/PortfolioSection";
import JobPreferencesSection from "@/components/dashboard/candidate/profile/JobPreferencesSection";
// import CompanyInfoSection from "@/components/profile/recruiter/CompanyInfoSection";
// import HiringPreferencesSection from "@/components/profile/recruiter/HiringPreferencesSection";
// import OpenPositionsSection from "@/components/profile/recruiter/OpenPositionsSection";

export default function ProfilePage() {
//   const { data: session } = useSession();
  const isCandidate =  "candidate";
  
  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState(false);

  // Candidate state
  const [candidateData, setCandidateData] = useState({
    name: "Areeba Nazim",
    title: "Frontend Developer",
    email: "areeba@gmail.com",
    phone: "+1219168192",
    location: "San Francisco, CA",
    bio: "Passionate frontend developer with 3+ years of experience building responsive web applications using React and Next.js.",
    avatar: null,
    coverImage: null,
    education: [
      {
        id: 1,
        institution: "Stanford University",
        degree: "Master of Computer Science",
        field: "Computer Science",
        startYear: "2018",
        endYear: "2020",
        description: "Specialized in Human-Computer Interaction"
      }
    ],
    experience: [
      {
        id: 1,
        company: "TechCorp",
        position: "Frontend Developer",
        startDate: "2020-06",
        endDate: "Present",
        description: "Developed and maintained company's main product using React and TypeScript"
      }
    ],
    skills: ["JavaScript", "React", "Next.js", "TypeScript", "Tailwind CSS"],
    portfolioLinks: {
      linkedin: "linkedin.com/in/areeba",
      github: "github.com/areeba",
      dribbble: "",
      behance: ""
    },
    jobPreferences: {
      seeking: true,
      availability: "Immediately",
      employmentTypes: ["Full Time", "Part Time"],
      remotePreference: "Hybrid",
      desiredSalary: "$80,000 - $100,000",
      industries: ["Technology", "SaaS"]
    }
  });

  // Recruiter state
  const [recruiterData, setRecruiterData] = useState({
    name: "Alex Johnson",
    title: "Technical Recruiter",
    email: "alex@techhiring.com",
    phone: "+1219168193",
    company: "TechHiring Inc.",
    companyLogo: "/images/company-logo.jpg",
    companyDescription: "Specialized in connecting tech talent with innovative companies",
    hiringPreferences: {
      roles: ["Frontend", "Backend", "Full Stack"],
      experienceLevels: ["Mid-level", "Senior"],
      locations: ["Remote", "San Francisco", "New York"],
      hiringVolume: "50+ positions annually"
    },
    openPositions: [
      {
        id: 1,
        title: "Senior React Developer",
        type: "Full Time",
        location: "Remote",
        posted: "2 days ago"
      }
    ]
  });

  const handleCandidateUpdate = (section, data) => {
    setCandidateData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleRecruiterUpdate = (section, data) => {
    setRecruiterData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const candidateTabs = [
    { id: "personal", label: "Personal Info" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "portfolio", label: "Portfolio" },
    { id: "preferences", label: "Job Preferences" }
  ];

  const recruiterTabs = [
    { id: "company", label: "Company Info" },
    { id: "preferences", label: "Hiring Preferences" },
    { id: "positions", label: "Open Positions" }
  ];

  const tabs = isCandidate ? candidateTabs : recruiterTabs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader 
        user={isCandidate ? candidateData : recruiterData} 
        isCandidate={isCandidate}
        editMode={editMode}
        toggleEditMode={toggleEditMode}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar - Tabs */}
          <div className="md:w-1/4 lg:w-1/5">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Profile Sections</h2>
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#eae7ff] text-colors-primary'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="md:w-3/4 lg:w-4/5">
            {isCandidate ? (
              <>
                {activeTab === "personal" && (
                  <PersonalInfoSection 
                    data={candidateData} 
                    onUpdate={(data) => handleCandidateUpdate('personal', data)}
                    editMode={editMode}
                  />
                )}
                {activeTab === "education" && (
                  <EducationSection 
                    data={candidateData.education} 
                    onUpdate={(data) => handleCandidateUpdate('education', data)}
                    editMode={editMode}
                  />
                )}
                {activeTab === "experience" && (
                  <ExperienceSection 
                    data={candidateData.experience} 
                    onUpdate={(data) => handleCandidateUpdate('experience', data)}
                    editMode={editMode}
                  />
                )}
                {activeTab === "skills" && (
                  <SkillsSection 
                    data={candidateData.skills} 
                    onUpdate={(data) => handleCandidateUpdate('skills', data)}
                    editMode={editMode}
                  />
                )}
                {activeTab === "portfolio" && (
                  <PortfolioSection 
                    data={candidateData.portfolioLinks} 
                    onUpdate={(data) => handleCandidateUpdate('portfolioLinks', data)}
                    editMode={editMode}
                  />
                )}
                {activeTab === "preferences" && (
                  <JobPreferencesSection 
                    data={candidateData.jobPreferences} 
                    onUpdate={(data) => handleCandidateUpdate('jobPreferences', data)}
                    editMode={editMode}
                  />
                )}
              </>
            ) : (
              <>
                {/* {activeTab === "company" && (
                  <CompanyInfoSection 
                    data={recruiterData} 
                    onUpdate={handleRecruiterUpdate}
                    editMode={editMode}
                  />
                )}
                {activeTab === "preferences" && (
                  <HiringPreferencesSection 
                    data={recruiterData.hiringPreferences} 
                    onUpdate={(data) => handleRecruiterUpdate('hiringPreferences', data)}
                    editMode={editMode}
                  />
                )}
                {activeTab === "positions" && (
                  <OpenPositionsSection 
                    data={recruiterData.openPositions} 
                    onUpdate={(data) => handleRecruiterUpdate('openPositions', data)}
                    editMode={editMode}
                  />
                )} */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}