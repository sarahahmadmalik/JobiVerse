"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProfileHeader from "@/components/dashboard/candidate/profile/ProfileHeader";
import PersonalInfoSection from "@/components/dashboard/candidate/profile/PersonalInfoSection";
import EducationSection from "@/components/dashboard/candidate/profile/EducationSection";
import ExperienceSection from "@/components/dashboard/candidate/profile/ExperienceSection";
import SkillsSection from "@/components/dashboard/candidate/profile/SkillsSection";
import PortfolioSection from "@/components/dashboard/candidate/profile/PortfolioSection";
import JobPreferencesSection from "@/components/dashboard/candidate/profile/JobPreferencesSection";
import { getCandidateProfile, updateCandidateProfile } from "@/services/candidate-service";
import Loader from "@/components/ui/loader";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  
  const [candidateData, setCandidateData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    avatar: null,
    education: [],
    experience: [],
    skills: [],
    portfolioLinks: {
      linkedin: "",
      github: "",
      dribbble: "",
      behance: ""
    },
    jobPreferences: {
      employmentTypes: [],
      preferredLocations: [],
      desiredTitle: "",
      desiredSalary: "",
      industries: []
    }
  });

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        if (!session?.user?.id) return;
        
        const data = await getCandidateProfile(session.user.id);
        
        // Transform API response to match component expectations
        setCandidateData({
          name: `${data.personal?.firstName || ''} ${data.personal?.lastName || ''}`.trim(),
          firstName: data.personal?.firstName || '',
          lastName: data.personal?.lastName || '',
          title: data.jobPreferences?.desiredTitle || '',
          email: data.personal?.email || '',
          phone: data.personal?.phone || '',
          location: data.personal?.location || '',
          avatar: data.personal?.avatar || null,
          education: data.education || [],
          experience: data.experience || [],
          skills: data.skills || [],
          portfolioLinks: {
            linkedin: data.socialLinks?.linkedin || '',
            github: data.socialLinks?.github || '',
            dribbble: data.socialLinks?.dribbble || '',
            behance: ''
          },
          jobPreferences: {
            employmentTypes: data.jobPreferences?.employmentTypes || [],
            preferredLocations: data.jobPreferences?.preferredLocations || [],
            desiredTitle: data.jobPreferences?.desiredTitle || "",
            desiredSalary: data.jobPreferences?.salaryExpectation 
              ? `$${data.jobPreferences.salaryExpectation}` 
              : "",
            industries: data.jobPreferences?.industries || []
          }
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching candidate data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [session]);

  const handleUpdate = async (section, data) => {
    try {
      if (!session?.user?.id) return;
      
      setLoading(true);
      
      let apiData = data;
      console.log(data)
      // Transform data for API based on section
      if (section === 'personal') {
        apiData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone,
          location: data.location
        };
        
        // Update local state with full name
        setCandidateData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            ...data
          },
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim()
        }));
      } else {
        // For other sections, update directly
        setCandidateData(prev => ({
          ...prev,
          [section]: data
        }));
      }
      
      await updateCandidateProfile(session.user.id, section, apiData);
    } catch (err) {
      setError(err.message);
      console.error('Error updating candidate data:', err);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading profile: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader 
        user={candidateData} 
        isCandidate={true}
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
                {candidateTabs.map(tab => (
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
            {activeTab === "personal" && (
              <PersonalInfoSection 
                data={candidateData} 
                onUpdate={(data) => handleUpdate('personal', data)}
                editMode={editMode}
              />
            )}
            {activeTab === "education" && (
              <EducationSection 
                data={candidateData.education} 
                onUpdate={(data) => handleUpdate('education', data)}
                editMode={editMode}
              />
            )}
            {activeTab === "experience" && (
              <ExperienceSection 
                data={candidateData.experience} 
                onUpdate={(data) => handleUpdate('experience', data)}
                editMode={editMode}
              />
            )}
            {activeTab === "skills" && (
              <SkillsSection 
                data={candidateData.skills} 
                onUpdate={(data) => handleUpdate('skills', data)}
                editMode={editMode}
              />
            )}
            {activeTab === "portfolio" && (
              <PortfolioSection 
                data={candidateData.portfolioLinks} 
                onUpdate={(data) => handleUpdate('portfolioLinks', data)}
                editMode={editMode}
              />
            )}
            {activeTab === "preferences" && (
              <JobPreferencesSection 
                data={candidateData.jobPreferences} 
                onUpdate={(data) => handleUpdate('jobPreferences', data)}
                editMode={editMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}