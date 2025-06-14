"use client";
import { useState, useEffect } from "react";
import ProfileHeader from "@/components/dashboard/recruiter/profile/ProfileHeader";
import CompanyInfoSection from "@/components/dashboard/recruiter/profile/CompanyInfoSection";
import BrandingSection from "@/components/dashboard/recruiter/profile/Branding";
import ContactInfoSection from "@/components/dashboard/recruiter/profile/ContactInfo";
import { useSession } from "next-auth/react";
import { getRecruiterProfile, updateRecruiterProfile } from "@/services/recruiter-service";
import Loader from "@/components/ui/loader";

export default function RecruiterProfilePage() {
  const [activeTab, setActiveTab] = useState("company");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  
  const [recruiterData, setRecruiterData] = useState({
    avatar: null,
    company: {
      name: "",
      industry: "",
      size: "",
      founded: "",
      location: "",
      hqLocation: "",
      specialties: [],
      description: ""
    },
    branding: {
      logo: "",
      coverImage: "",
      description: "",
      website: "",
      linkedin: "",
      twitter: ""
    },
    contact: {
      primaryEmail: "",
      phone: "",
      address: "",
      hrEmail: "",
      generalEmail: ""
    },
    isOnboarded: false
  });

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        setLoading(true);
        if (!session?.user?.id) return;
        
        const data = await getRecruiterProfile(session.user.id);
        
        setRecruiterData({
          avatar: data.avatar,
          email: data.email,
          phone: data.phone,
          company: {
            name: data.company.name,
            industry: data.company.industry,
            size: data.company.size,
            founded: data.company.founded,
            location: data.company.location,
            hqLocation: data.company.hqLocation,
            specialties: data.company.specialties,
            description: data.company.description
          },
          branding: {
            logo: data.branding.logo,
            coverImage: data.branding.coverImage || "",
            description: data.branding.description,
            website: data.branding.website,
            linkedin: data.branding.linkedin,
            twitter: data.branding.twitter
          },
          contact: {
            primaryEmail: data.contact.primaryEmail,
            phone: data.contact.phone,
            address: data.contact.address,
            hrEmail: data.contact.hrEmail,
            generalEmail: data.contact.generalEmail
          },
          isOnboarded: data.isOnboarded
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching recruiter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, [session]);

  const handleUpdate = async (section, data) => {
    try {
      if (!session?.user?.id) return;
      
      setLoading(true);
      await updateRecruiterProfile(session.user.id, section, data);

      console.log(data)
      
      setRecruiterData(prev => ({
        ...prev,
        [section]: data,
        ...(section === 'branding' && data.branding.logo ? { avatar: data.branding.logo } : {})
      }));
    } catch (err) {
      setError(err.message);
      console.error('Error updating recruiter data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const tabs = [
    { id: "company", label: "Company Info" },
    { id: "branding", label: "Branding" },
    { id: "contact", label: "Contact Info" }
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
        user={recruiterData} 
        editMode={editMode}
        toggleEditMode={toggleEditMode}
      />

      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar - Tabs */}
          <div className="md:w-1/4 lg:w-1/5">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Company Profile</h2>
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