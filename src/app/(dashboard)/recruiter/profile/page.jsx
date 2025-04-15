"use client";
import { useState } from "react";
import ProfileHeader from "@/components/dashboard/recruiter/profile/ProfileHeader";
import CompanyInfoSection from "@/components/dashboard/recruiter/profile/CompanyInfoSection";
import BrandingSection from "@/components/dashboard/recruiter/profile/Branding";
import ContactInfoSection from "@/components/dashboard/recruiter/profile/CompanyInfoSection";

export default function RecruiterProfilePage() {
  const [activeTab, setActiveTab] = useState("company");
  const [editMode, setEditMode] = useState(false);

  const [recruiterData, setRecruiterData] = useState({
    name: "Alex Johnson",
    title: "Technical Recruiter",
    email: "alex@techhiring.com",
    phone: "+1219168193",
    avatar: null,
    
    // Company Information
    company: {
      name: "TechHiring Inc.",
      industry: "Information Technology",
      size: "51-200 employees",
      founded: "2015",
      location: "San Francisco, CA",
      hqLocation: "San Francisco, CA",
      specialties: "Tech Recruitment, Talent Acquisition"
    },
    
    // Branding
    branding: {
      logo: "/images/company-logo.jpg",
      coverImage: "/images/company-cover.jpg",
      description: "Specialized in connecting top tech talent with innovative companies across North America. We focus on JavaScript, Python, and AI/ML roles.",
      website: "https://techhiring.com",
      linkedin: "techhiring",
      twitter: "techhiring"
    },
    
    // Contact Info
    contact: {
      primaryEmail: "careers@techhiring.com",
      phone: "+1 (415) 555-0199",
      address: "123 Tech Street, San Francisco, CA 94107",
      hrEmail: "hr@techhiring.com",
      generalEmail: "info@techhiring.com"
    }
  });

  const handleUpdate = (section, data) => {
    setRecruiterData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const tabs = [
    { id: "company", label: "Company Info" },
    { id: "branding", label: "Branding" },
    { id: "contact", label: "Contact Info" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader 
        user={recruiterData} 
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
            {activeTab === "company" && (
              <CompanyInfoSection 
                data={recruiterData.company} 
                onUpdate={(data) => handleUpdate('company', data)}
                editMode={editMode}
              />
            )}
            {activeTab === "branding" && (
              <BrandingSection 
                data={recruiterData.branding} 
                onUpdate={(data) => handleUpdate('branding', data)}
                editMode={editMode}
              />
            )}
            {activeTab === "contact" && (
              <ContactInfoSection 
                data={recruiterData.contact} 
                onUpdate={(data) => handleUpdate('contact', data)}
                editMode={editMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}