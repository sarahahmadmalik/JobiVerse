"use client";
import Button from "@/components/ui/button";
import { Camera } from "lucide-react";

export default function ProfileHeader({ user, editMode, toggleEditMode }) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto ">
        {/* Fixed Gradient Cover Photo */}
        <div 
          className="h-48 w-full rounded-t-[16px] relative"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          {/* No edit button for cover photo */}
        </div>
        
        {/* Profile Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end relative px-4 sm:px-6 -mt-16">
          {/* Avatar */}
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-white border-4 border-white shadow-md overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <span className="text-lg font-medium">{user.name.charAt(0)}</span>
                </div>
              )}
            </div>
            {editMode && (
              <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                <Camera size={16} />
                <input type="file" className="hidden" />
              </button>
            )}
          </div>
          
          {/* Profile Details */}
          <div className="mt-4 md:mt-0 md:ml-6 pb-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-lg text-gray-600">{user.title}</p>
              </div>
              
              <Button
                onClick={toggleEditMode}
                className="px-4 py-2 !shadow-none rounded-md text-sm font-medium "
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{user.company?.name || 'Company name'}</span>
              <span className="mx-2">•</span>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}